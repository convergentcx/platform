import { observable, action } from 'mobx';
import ipfsClient from 'ipfs-http-client';
import Web3 from 'web3';

// import Account from '../assets/artifacts/Account.json';
import ConvergentBeta2 from '../assets/artifacts2/ConvergentBeta.json';
import Account2 from '../assets/artifacts2/Account.json';

import Polynomial from '../lib/polynomial';
// import { toDecimal } from '../lib/util';

import { AccountData, b32IntoMhash } from '../lib/ipfs-util';

// const CB_PROXY_ADDR = "0x93bd15db2cbb045604d5df11f037203a1b57c23a";
const CB2_PROXY_ADDR = "0x130ce5d82ae4174a0284027f9ec1d0dcaa748ced";

type CbAccount = {
  creator: string,
  blockNumber: number,
};

// type BetaCacheObject = {
//   price: string,
//   marketCap: string,
//   rr: string,
//   vs: string,
//   vr: string,
//   ts: string,
//   symbol: string,
//   metadata: string,
//   poly: Polynomial,
//   heldContributions: string,
//   name: string,
// };

type NewBetaCache = {
  metadata: string,
  curServiceIndex: string,
  reserve: string,
  contributions: string,
  curPrice: string,
  marketCap: string,
  totalSupply: string,
  rAsset: string,
  beneficiary: string,
  slopeN: string,
  slopeD: string,
  exponent: string,
  spreadN: string,
  spreadD: string,
  symbol: string,
  name: string,
}

export default class Web3Store {
  @observable account: string = ''; // Main unlocked account
  @observable accountsCache: Set<string> = new Set();
  @observable betaCache: Map<string, NewBetaCache> = new Map(); // Will update through polling every 2000 ms
  @observable cbAccounts: Map<string, CbAccount> = new Map(); // Will update any time a new account event comes (contains less data)
  @observable convergentBeta = null; // The contract instance
  @observable convergentBeta2 = null; // The contract instance
  @observable ipfs: any = null;   // Global IPFS object
  @observable ipfsCache: Map<string, AccountData> = new Map();
  @observable ipfsLock: boolean = false;  // Locks for IPFS
  @observable readonly = false;  // App starts in readonly mode
  @observable toaster: any = null;  // The toast manager
  @observable web3: any|null = null;  // Global Web3 object
  // @observable test: string = 'not updated';

  @action
  updateAccount = async () => {
    if (!this.web3) { return; }
    const main = (await this.web3.eth.getAccounts())[0];
    this.account = main;
    this.cacheAccounts();
  }

  @action
  cacheAccounts = () => {
    if (this.readonly) { return }
    if (!this.convergentBeta) {
      setTimeout(this.cacheAccounts, 2000);
    }

    (this.convergentBeta as any).events.NewAccount({
      fromBlock: 0,
      filter: {
        creator: this.account,
      },
    }).on('data', (event: any) => {
      const myAccount = event.returnValues.account;
      if (!this.accountsCache.has(myAccount)) {
        this.accountsCache.add(myAccount);
      }
    });
  }

  @action
  upgrade = async (address: string) => {
    const tx = await (this.convergentBeta as any).methods.upgradeAccount(address).send(
      { from: this.account }
    );
    console.log(tx)
  }

  @action
  sendContribution = async (address: string) => {
    if (this.readonly) throw new Error('Cannot perform this action of sending contributions in readonly mode.');

    const { abi } = Account2;
    const acc = new this.web3.eth.Contract(abi, address);
    const ret = await acc.methods.sendContributions().send({ from: this.account });
    // console.log(ret)
  }

  @action
  getSellReturn = async (address: string, howMuch: string) => {
    const { abi } = Account2;
    const acc = new this.web3.eth.Contract(abi, address);

    const sellReturn = await acc.methods.returnForSell(howMuch).call();
    return sellReturn;
  }

  @action
  sell = async (address: string, howMuch: string) => {
    if (!this.account) {
      throw new Error('No account!!!');
    }

    const { abi } = Account2;
    const acc = new this.web3.eth.Contract(abi, address);
    const tx = await acc.methods.sell(
      howMuch,
      0,
    ).send({
      from: this.account,
      gasPrice: this.web3.utils.toWei('2', 'gwei'),
    });
    // console.log(ret)
  }

  @action
  getBuyReturn = async (address: string, value: string) =>{
    const { abi } = Account2;
    const acc = new this.web3.eth.Contract(abi, address);
    const price = await acc.methods.priceToBuy(value).call();
    return price;
  }

  @action
  buy = async (address: string, howMuch: string, cost: string) => {
    if (!this.account) {
      throw new Error('No account!!');
    }
    const { abi } = Account2;
    const acc = new this.web3.eth.Contract(abi, address);
    const ret = await acc.methods.buy(
      howMuch,
      cost,
    ).send({
      from: this.account,
      value: cost,
      gasPrice: this.web3.utils.toWei('2', 'gwei'),
    });
    // console.log(ret)
  }

  @action
  updateWeb3 = (web3: any) => {
    this.web3 = web3;
    // console.log('web3 updated');
  }

  @action
  initIPFS = () => {
    const ipfs = ipfsClient(
      'ipfs.infura.io',
      '5001',
      { protocol: 'https' },
    );

    this.ipfs = ipfs;
    this.toaster.add('IPFS initialized!', {appearance: 'info'})
    // console.log('IPFS connected');
  }

  @action
  ipfsAdd = async (some: string): Promise<string> => {
    this.ipfsLock = true;
    // console.log('IPFS ADDING YO')
    const ipfsHash = await this.ipfs.add(Buffer.from(some));
    this.ipfsLock = false;
    return ipfsHash;
  }

  @action
  initReadonly = async () => {
    const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws/v3/7121204aac9a45dcb9c2cc825fb85159'));
    // console.log('READONLY MODE')
    this.readonly = true;
    this.web3 = web3;
    this.toaster.add(`App started in READONLY mode using Infura node. You will not be able to interact with Ethereum until you log in.`, {appearance: 'info'})
    await this.instantiateConvergentBeta();
  }

  @action
  initToastMgmt = (toastMgr: any) => {
    this.toaster = toastMgr;
  }

  @action
  turnOnWeb3 = async () => {
    // console.log('enabling web3');
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
      // console.log('Browser is not ethereum enabled');
      // console.log('falling back');
      return;
    }
    const netId = await _window.web3.eth.net.getId();
    // console.log('netId', netId)
    if (netId !== 4) {
      _window.alert('Please tune in on the Rinkeby test network!');
      return;
    }
    this.updateWeb3(_window.web3);
    this.readonly = false;
    await this.updateAccount();
    this.toaster.add(`Logged in to ${this.account.slice(0,10) + '...' + this.account.slice(-4)}. You may now interact with Ethereum.`, {appearance: 'success'})
    // await this.signWelcome();
    await this.instantiateConvergentBeta();
    // console.log('enabled');
  }

  @action
  signWelcome = async () => {
    await this.web3.eth.personal.sign("Welcome to Convergent Beta DApp. Happy investing in your friends!", this.account);
  }

  @action
  instantiateConvergentBeta = async () => {
    if (!this.web3) {
      console.error('Unable to instantiate Convergent Beta');
    }

    const { abi: abi2 } = ConvergentBeta2;
    const convergentBeta2 = new this.web3.eth.Contract(
      abi2,
      CB2_PROXY_ADDR,
    );
    this.convergentBeta = convergentBeta2;
    this.cacheAccounts();
    await this.startCachingAccounts();
  }

  // This function gets minimal data and is launched every time a new account event comes in.
  // TODO: it should trigger a full data caching for this address.
  @action
  startCachingAccounts = async () => {
    if (!this.convergentBeta) {
      console.error('convergent beta not initialized');
    }

    const initAccounts = await (this.convergentBeta as any).getPastEvents('NewAccount', {fromBlock: 0, toBlock: 'latest'});

    initAccounts.forEach((event: any) => {
      const { returnValues: { account, creator }, blockNumber } = event;

      this.cbAccounts.set(account, {
        creator,
        blockNumber,
      });

    });
    

    // Now start watching the accounts.
    (this.convergentBeta as any).events.NewAccount({fromBlock: 0})
    .on('data', (event: any) => {
      const { returnValues: { account, creator }, blockNumber } = event;
      this.cbAccounts.set(account, {
        creator,
        blockNumber,
      });
    });

    this.pollAllTehData();
    this.pollIPFS();
  }

  @action
  pollAllTehData = async () => {
    for (const [account, _] of this.cbAccounts) {
      this.getAccountDataAndCache(account);
    }

    setInterval(() => {
      // console.log('web3 polling round');
      for (const [account, _] of this.cbAccounts) {
        this.getAccountDataAndCache(account);
      }
    }, 30000);
  }

  @action
  pollIPFS = () => {
    if (!this.web3) throw new Error('pollIPFS failed');

    for (const [address, data] of this.betaCache) {
      this.ipfsGetDataAndCache(data.metadata);
    }

    setInterval(() => {
      // console.log('ipfs polling round')
      for (const [address, data] of this.betaCache) {
        // console.log(address, data)
        this.ipfsGetDataAndCache(data.metadata);
      }
    }, 30000);
  }

  // TODO, when a profile page is viewed, update the data in the background, and poll it more often

  @action
  ipfsGetDataAndCache = async (metadata: string) => {
    const obj = {
      digest: metadata,
      hashFunction: 18,
      size: 32,
    };

    const contentAddress = b32IntoMhash(obj);
    const raw = await this.ipfs.get(contentAddress);
    const data: AccountData = JSON.parse(raw[0].content.toString());

    // TODO: Cannot cache picture because it will slow down the whole DApp.
    this.ipfsCache = this.ipfsCache.set(metadata, data);
  }

  @action
  getAccountDataAndCache = async (address: string) => {
    // Check for web3
    if (!this.web3) {
      console.error('Web3 not enabled!');
      return;
    }
    // Validate address
    if (!this.web3.utils.isAddress(address)) {
      console.error('Address unable to be validated!');
      return;
    }

    const { abi } = Account2;
    const acc = new this.web3.eth.Contract(abi, address);

    // These will change and should be polled
    const metadata = await (acc as any).methods.metadata().call();
    const curServiceIndex = await (acc as any).methods.curServiceIndex().call();
    const reserve = await (acc as any).methods.reserve().call(); 
    const contributions = await (acc as any).methods.contributions().call();
    const curPrice = await (acc as any).methods.currentPrice().call()
    const marketCap = await (acc as any).methods.marketCap().call();
    const totalSupply = await (acc as any).methods.totalSupply().call();

    // These SHOULD never change (at least in mvp)
    const rAsset = await (acc as any).methods.reserveAsset().call();
    const beneficiary = await (acc as any).methods.beneficiary().call();
    const slopeN = await (acc as any).methods.slopeN().call();
    const slopeD = await (acc as any).methods.slopeD().call();
    const exponent = await (acc as any).methods.exponent().call();
    const spreadN = await (acc as any).methods.spreadN().call();
    const spreadD = await (acc as any).methods.spreadD().call();
    const symbol = await (acc as any).methods.symbol().call();
    const name = await (acc as any).methods.name().call();

    this.betaCache.set(
      address,
      {
        metadata,
        curServiceIndex,
        reserve,
        contributions,
        curPrice,
        marketCap,
        totalSupply,
        rAsset,
        beneficiary,
        slopeN,
        slopeD,
        exponent,
        spreadN,
        spreadD,
        symbol,
        name,
      }
    );

    const nowBlock = await this.web3.eth.getBlockNumber();
    (acc as any).events.MetadataUpdated({ fromBlock: nowBlock })
    .on('data', (event: any) => {
      const { newMetadata } = event.returnValues;
      const oldEntry = this.betaCache.get(address);
      if (newMetadata !== (oldEntry as any).metadata) {
        const newEntry = Object.assign(oldEntry, { metadata: newMetadata });
        this.betaCache.set(address, newEntry);
      }
    });
  }

  // TODO: why is this function here?
  @action
  updateMetadata = async (economy: string, metadata: string) => {
    if (!this.web3) {
      console.error('no web3 lol')
      return;
    }

    if (!this.web3.utils.isAddress(economy)) {
      throw new Error('Incorrect economy address provided to updateMetadata function');
    }

    const { abi } = Account2;
    const acc = new this.web3.eth.Contract(abi, economy);

    const tx = await acc.methods.updateMetadata(metadata).send({from: this.account});
    // console.log(tx)
  }

  // @action
  // updateTest = () => {
  //   console.log('testing');
  //   this.test = 'updated';
  // }
}
