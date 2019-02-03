import { observable, action } from 'mobx';
import Web3 from 'web3';

import Account from '../assets/artifacts/Account.json';
import ConvergentBeta from '../assets/artifacts/ConvergentBeta.json';

import Polynomial from '../lib/polynomial';
import { toDecimal } from '../lib/util';

const CB_PROXY_ADDR = "0x93bd15db2cbb045604d5df11f037203a1b57c23a";

type CbAccount = {
  creator: string,
  blockNumber: number,
};

type BetaCacheObject = {
  price: string,
  marketCap: string,
  rr: string,
  vs: string,
  vr: string,
  ts: string,
  symbol: string,
  metadata: string,
};

export default class Web3Store {
  @observable account = null; // Main unlocked account
  @observable accountsCache: Set<string> = new Set();
  @observable betaCache: Map<string, BetaCacheObject> = new Map(); // Will update through polling every 2000 ms
  @observable cbAccounts: Map<string, CbAccount> = new Map(); // Will update any time a new account event comes (contains less data)
  @observable convergentBeta = null; // The contract instance
  @observable readonly = false;  // App starts in readonly mode
  @observable web3: any|null = null;  // Global Web3 object
  // @observable test: string = 'not updated';

  @action
  updateAccount = async () => {
    if (!this.web3 || this.readonly) { return; }
    const main = (await this.web3.eth.getAccounts())[0];
    console.log('setting account ', main);
    this.account = main;
  }

  @action
  cacheAccounts = () => {
    if (!this.convergentBeta) {
      setTimeout(this.cacheAccounts, 2000);
    }

    (this.convergentBeta as any).events.NewAccount({
      fromBlock: 0,
      filter: {
        creator: this.account,
      },
    }).on('data', (event: any) => {
      const LLL = event.returnValues.account;
      // console.log(LLL)
      if (!this.accountsCache.has(LLL)) {
        this.accountsCache.add(LLL);
      }
      // this.accountsCache = [...this.accountsCache, event.returnValues.account];
      // console.log(event)
      // console.log(this.accountsCache)
    });
  }

  @action
  updateWeb3 = (web3: any) => {
    this.web3 = web3;
    console.log('web3 updated');
  }

  @action
  turnOnWeb3 = async () => {
    console.log('enabling web3');
    // console.log(window);
    const _window = window as any;
    if (_window.ethereum) {
      // modern web3 provider
      _window.web3 = new Web3(_window.ethereum);
      try {
        await _window.ethereum.enable();
      } catch (e) { console.error(e); }
    } else if (_window.web3) {
      _window.web3 = new Web3(_window.web3.currentProvider);
    } else {
      console.log('Browser is not ethereum enabled');
      return;
    }
    this.updateWeb3(_window.web3);
    await this.updateAccount();
    await this.instantiateConvergentBeta();
    console.log('enabled');
  }

  @action
  instantiateConvergentBeta = async () => {
    if (!this.web3) {
      console.error('Unable to instantiate Convergent Beta');
    }

    const { abi } = ConvergentBeta;
    const convergentBeta = new this.web3.eth.Contract(
      abi,
      CB_PROXY_ADDR,
    );

    this.convergentBeta = convergentBeta;
    console.log('convergent beta instantiated');
    // console.log(this.convergentBeta);
    this.cacheAccounts();
    await this.startCachingAccounts();
  }

  @action
  startCachingAccounts = async () => {
    if (!this.convergentBeta) {
      console.error('convergent beta not initialized');
    }

    const initAccounts = await (this.convergentBeta as any).getPastEvents('NewAccount', {fromBlock: 0, toBlock: 'latest'});
    console.log(initAccounts)
    console.log(typeof initAccounts);
    initAccounts.forEach((event: any) => {
      // console.log(event)
      const { returnValues: { account, creator }, blockNumber } = event;
      // console.log(account, creator, blockNumber)
      this.cbAccounts.set(account, {
        creator,
        blockNumber,
      });
    });
    

    // this.cbAccounts = initAccounts;
    // Now start watching the accounts.
    (this.convergentBeta as any).events.NewAccount({fromBlock: 0})
    .on('data', (event: any) => {
      // console.log(event);
      const { returnValues: { account, creator }, blockNumber } = event;
      // console.log(account, creator, blockNumber)
      this.cbAccounts.set(account, {
        creator,
        blockNumber,
      });

      this.pollAllTehData();
    });
  }

  @action
  pollAllTehData = async () => {
    setInterval(() => {
      for (const [account, _] of this.cbAccounts) {
        this.getContractDataAndCache(account);
      }
    }, 10000);
  }

  @action
  getContractDataAndCache = async (address: string) => {
    // Check for web3
    if (!this.web3) {
      console.error('Web3 not enabled!');
      return;
    }
    // Validate address
    if (!this.web3.utils.isAddress(address)) {
      console.error('incorrect address');
      return;
    }

    const { abi } = Account;
    const acc = new this.web3.eth.Contract(abi, address);

    const rr = await (acc as any).methods.reserveRatio().call();
    const vs = await (acc as any).methods.virtualSupply().call();
    const vr = await (acc as any).methods.virtualReserve().call();
    const ts = await (acc as any).methods.totalSupply().call();
    const symbol = await (acc as any).methods.symbol().call();
    const metadata = await (acc as any).methods.metadata().call();

    const poly = Polynomial.fromBancorParams(
      toDecimal(vs.toString()),
      toDecimal(vr.toString()),
      toDecimal(rr.toString()),
      toDecimal('1000000'),
    );

    console.log(vs)
    const integral = poly.integral(
      toDecimal(vs).add(toDecimal(ts))
    );

    const marketCap = integral.mul(ts).toString();

    console.log(this.web3.utils.fromWei(integral.toString()), 'eth')

    const oldCache = this.betaCache;
    this.betaCache = Object.assign(oldCache, {
      [address] : {
        price: integral.toString(),
        marketCap,
        rr,
        vs,
        vr,
        ts,
        symbol,
        metadata,
      },
    });

    const nowBlock = await this.web3.eth.getBlockNumber();
    (acc as any).events.MetadataUpdated({fromBlock: nowBlock})
    .on('data', (event: any) => {
      const md = event.returnValues.newMetadata;
      if ((this.betaCache as any)[address].metadata !== md) {
        (this.betaCache as any)[address].metadata = md;
      };
    });

    // console.log(rr.toString());
    // console.log(vs.toString());
    // console.log(vr.toString());
    // console.log(ts.toString());

  }

  @action
  updateMetadata = async (economy: string, metadata: string) => {
    if (!this.web3) {
      console.error('no web3 lol')
      return;
    }

    if (!this.web3.utils.isAddress(economy)) {
      throw new Error('Incorrect economy address provided to updateMetadata function');
    }

    // console.log(metadata);

    const { abi } = Account;
    const acc = new this.web3.eth.Contract(abi, economy);

    const tx = await acc.methods.updateMetadata(metadata).send({from: this.account});
    console.log(tx)
  }

  // @action
  // updateTest = () => {
  //   console.log('testing');
  //   this.test = 'updated';
  // }
}
