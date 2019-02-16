import { observable, action } from 'mobx';
import ipfsClient from 'ipfs-http-client';
import Web3 from 'web3';

import ConvergentBeta from '../assets/artifacts2/ConvergentBeta.json';
import Account from '../assets/artifacts2/Account.json';

import { b32IntoMhash } from '../lib/ipfs-util';
import { ObservableValue } from 'mobx/lib/internal';

const CB_PROXY_ADDR_MAINNET = "0x9ce894a11ada19881ab560a5091a4cc3ff8f2d84";
const CB_PROXY_ADDR_RINKEBY = "0x60dacca6a82cbe636032f4a7363bdcb166de88be";

const MainnetWebsocketsProvider = 'wss://neatly-tolerant-coral.quiknode.io/73b04107-89ee-4261-9a8f-3c1e946c17b2/CyYMMeeGTb-EeIBHGwORaw==/';

enum Chain {
  Mainnet = '1',
  Rinkeby = '4',
}

const { NODE_ENV } = process.env;
let chain: Chain;
if (NODE_ENV === 'development') {
  chain = Chain.Rinkeby;
} else if (NODE_ENV === 'production') {
  chain = Chain.Mainnet;
}

type CbAccount = {
  creator: string,
  blockNumber: number,
};

type ServiceObject = {
  title: string,
  description: string,
  price: string,
}

type IPFSCacheObject = {
  bio: string,
  location: string,
  pic: string,
  services: ServiceObject[],
}

type BetaCacheObject = {
  metadata?: string,
  curServiceIndex?: string,
  reserve?: string,
  contributions?: string,
  curPrice?: string,
  marketCap?: string,
  totalSupply?: string,
  contributorCount?: number,
  rAsset?: string,
  beneficiary?: string,
  slopeN?: string,
  slopeD?: string,
  exponent?: string,
  spreadN?: string,
  spreadD?: string,
  symbol?: string,
  name?: string,
}

export default class Web3Store {
  @observable account: string = ''; // Main unlocked account
  @observable accountsCache: Set<string> = new Set();
  @observable betaCache: Map<string, BetaCacheObject> = new Map(); // Will update through polling every 2000 ms
  @observable cbAccounts: Map<string, CbAccount> = new Map(); // Will update any time a new account event comes (contains less data)
  @observable convergentBeta = null; // The contract instance
  @observable ipfs: any = null;   // Global IPFS object
  @observable ipfsCache: Map<string, IPFSCacheObject> = new Map();
  @observable ipfsLock: boolean = false;  // Locks for IPFS
  @observable readonly = false;  // App starts in readonly mode
  @observable toaster: any = null;  // The toast manager
  @observable web3: any|null = null;  // Global Web3 object
  @observable web3Ws: any = null;
  @observable balancesCache: Map<string, string> = new Map(); // Keeps map of address => account balance
  @observable messageCache: Map<string, object> = new Map();  // Keeps the messages

  // This is the first thing that will trigger when a user is on the DApp.
  @action
  initToastMgmt = (toastMgr: any) => {
    this.toaster = toastMgr;
  }


  // IPFS is the second thing to trigger when a user starts the DApp.
  @action
  initIPFS = () => {
    const ipfs = ipfsClient(
      'ipfs.infura.io',
      '5001',
      { protocol: 'https' },
    );

    this.ipfs = ipfs;
    this.toaster.add('IPFS initialized!', {appearance: 'info', autoDismiss: true})
  }

  // Thirdly, the DApp will start in READONLY mode by connecting to the provided
  // Infure node.
  @action
  initReadonly = async () => {
    let web3 = null;
    if (chain === Chain.Mainnet) {
      web3 = new Web3(new Web3.providers.WebsocketProvider('wss://neatly-tolerant-coral.quiknode.io/73b04107-89ee-4261-9a8f-3c1e946c17b2/CyYMMeeGTb-EeIBHGwORaw==/'));
    } else if (chain === Chain.Rinkeby) {
      web3 = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws'));
    }
    this.readonly = true;
    this.web3 = web3;
    this.web3Ws = web3;
    this.toaster.add(`App started in READONLY mode using Infura node. You will not be able to interact with Ethereum until you log in.`, { appearance: 'warning', autoDismiss: true })
    await this.instantiateConvergentBeta();
  }

  // When a user signs in this is the event that will trigger.
  @action
  turnOnWeb3 = async () => {
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
      this.toaster.add('Please use a Web3-enabled browser to perform write operations to Ethereum.', { appearance: 'info', autoDismiss: true });
      return 
    }
    const netId = await _window.web3.eth.net.getId();
    if (chain !== netId.toString()) {
      _window.alert('DApp is running on the Ethereum mainnet. Please switch your Web3 provider to Mainnet.');
      return;
    }
    this.updateWeb3(_window.web3);
    await this.signWelcome();
    this.readonly = false;
    await this.updateAccount();
    this.toaster.add(`Logged in to ${this.account.slice(0,10) + '...' + this.account.slice(-4)}. You may now interact with Ethereum.`, {appearance: 'success', autoDismiss: true})
    await this.instantiateConvergentBeta();
  }

  @action
  createAccount = async (
    premint: string,
    metadata: string,
    name: string,
    symbol: string,
  ) => {
    if (!this.account) { return; }

    const { abi } = ConvergentBeta;
    const addr = chain === Chain.Rinkeby ? CB_PROXY_ADDR_RINKEBY : CB_PROXY_ADDR_MAINNET;

    const cb = new this.web3.eth.Contract(
      abi,
      addr,
    );

    const tx = await cb.methods.createAccount(
      "0x0000000000000000000000000000000000000000",   // reserve asset
      "1",                                            // slopeN
      "1000",                                         // slopeD
      "1",                                            // exponent
      "60",                                           // spreadN
      "100",                                          // spreadD
      premint,                                        // premint
      metadata,                                       //metadata
      name,                                           //_name
      symbol,                                         // _symbol
    ).send({ from: this.account });
    this.handleTransactionReturn(tx);
    return tx;
  }

  @action
  instantiateConvergentBeta = async () => {
    if (!this.web3) {
      console.error('Unable to instantiate Convergent Beta');
    }

    const { abi } = ConvergentBeta;
    const addr = chain === Chain.Rinkeby ? CB_PROXY_ADDR_RINKEBY : CB_PROXY_ADDR_MAINNET;

    const convergentBeta = new this.web3Ws.eth.Contract(
      abi,
      addr,
    );
    this.convergentBeta = convergentBeta;
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

    // console.log('starting sync');

    // Now start watching the accounts.
    // const nowBlock = await this.web3.eth.getBlockNumber();
    (this.convergentBeta as any).events.NewAccount({ fromBlock: 0 })
    .on('data', (event: any) => {
      const { returnValues: { account, creator }, blockNumber } = event;
      this.cbAccounts.set(account, {
        creator,
        blockNumber,
      });
      this.getAccountDataAndCache(account);
    });

    // console.log('after first block')

    const initAccounts = await (this.convergentBeta as any).getPastEvents('NewAccount', {fromBlock: 0, toBlock: 'latest'});

    // console.log('after fetching past events')

    initAccounts.forEach((event: any) => {
      const { returnValues: { account, creator }, blockNumber } = event;

      this.cbAccounts.set(account, {
        creator,
        blockNumber,
      });

      this.getAccountDataAndCache(account);

    });

    // console.log('after for each')
    

    // Now start watching the accounts.
    const nowBlock = await this.web3.eth.getBlockNumber();
    (this.convergentBeta as any).events.NewAccount({ fromBlock: nowBlock })
    .on('data', (event: any) => {
      const { returnValues: { account, creator }, blockNumber } = event;
      this.cbAccounts.set(account, {
        creator,
        blockNumber,
      });
      this.getAccountDataAndCache(account);
    });

    this.pollAllTehData();
    this.pollIPFS();
  }

  @action
  cacheIntoWindowStorage = async (address: string, dataBlob: string) => {
    window.localStorage.setItem(address, dataBlob);
  }

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
    }).on('data', async (event: any) => {
      const myAccount = event.returnValues.account;
      if (!this.accountsCache.has(myAccount)) {
        this.accountsCache.add(myAccount);
        await this.getAccountDataAndCache(myAccount);
        await this.ipfsGetDataAndCache((this.betaCache as any).get(myAccount).metadata);
      }
    });
  }

  @action
  request = async (address: string, serviceIndex: number, msg: string) => {
    const { abi } = Account;
    const acc = new this.web3.eth.Contract(abi, address);
    const tx = await (acc as any).methods.requestService(
      serviceIndex.toString(),
      msg,
    ).send(
      { from: this.account },
    );
    console.log(tx); //TODO add notifications
  }

  @action
  addService = async (address: string, price: string) => {
    if (this.betaCache.has(address) && (this.betaCache.get(address) as any).curServiceIndex > 0) {
      return;
    }
    const { abi } = Account;
    const acc = new this.web3.eth.Contract(abi, address);
    const tx = await (acc as any).methods.addService(
      price
    ).send(
      { from: this.account },
    );
    console.log(tx); //TODO add notifications
  }

  @action
  upgrade = async (address: string) => {
    const tx = await (this.convergentBeta as any).methods.upgradeAccount(address).send(
      { from: this.account }
    );
    console.log(tx); //TODO add notifications
  }

  @action
  sendContribution = async (address: string) => {
    if (this.readonly) throw new Error('Cannot perform this action of sending contributions in readonly mode.');

    const { abi } = Account;
    const acc = new this.web3.eth.Contract(abi, address);
    const ret = await acc.methods.withdraw().send({ from: this.account });
    this.handleTransactionReturn(ret);
  }

  handleTransactionReturn = (tx: any) => {
    // console.log(tx)
    tx.status === true
      ? this.toaster.add(`Transaction succeeded! Check it out here ${
        tx.transactionHash.slice(0,5) + '...' + tx.transactionHash.slice(-4)
      }`, { appearance: 'success', autoDismiss: true })
      : this.toaster.add('Transaction failed!', { appearance: 'error', autoDismiss: true });
  }

  @action
  getSellReturn = async (address: string, howMuch: string) => {
    const { abi } = Account;
    const acc = new this.web3.eth.Contract(abi, address);

    const sellReturn = await acc.methods.returnForSell(howMuch).call();
    return sellReturn;
  }

  @action
  syncMessages = async (address: string) => {
    const { abi } = Account;
    const acc = new this.web3Ws.eth.Contract(abi, address);

    const messages = await (acc as any).getPastEvents('allEvents', { fromBlock: 0 });
    this.messageCache.set(address, messages);
    return messages; // TODO if logged in, record messages for your accounts for updates lol
  }

  @action
  sell = async (address: string, howMuch: string) => {
    if (!this.account) {
      throw new Error('No account!!!');
    }

    const { abi } = Account;
    const acc = new this.web3.eth.Contract(abi, address);
    const tx = await acc.methods.sell(
      howMuch,
      0,
    ).send({
      from: this.account,
      gasPrice: this.web3.utils.toWei('2', 'gwei'),
    });
    this.handleTransactionReturn(tx);
    // console.log(ret)
  }

  @action
  getBuyReturn = async (address: string, value: string) =>{
    const { abi } = Account;
    const acc = new this.web3.eth.Contract(abi, address);
    const price = await acc.methods.priceToBuy(value).call();
    return price;
  }

  @action
  buy = async (address: string, howMuch: string, cost: string) => {
    if (!this.account) {
      throw new Error('No account!!');
    }
    const { abi } = Account;
    const acc = new this.web3.eth.Contract(abi, address);
    const ret = await acc.methods.buy(
      howMuch,
      cost,
    ).send({
      from: this.account,
      value: cost,
      gasPrice: this.web3.utils.toWei('2', 'gwei'),
    });
    this.handleTransactionReturn(ret);
    // console.log(ret)
  }

  @action
  updateWeb3 = (web3: any) => {
    this.web3 = web3;
    // console.log('web3 updated');
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
  signWelcome = async () => {
    const main = (await this.web3.eth.getAccounts())[0];
    await this.web3.eth.personal.sign("Welcome to Convergent Beta DApp. By signing this message you agree to abide by the Terms of Use. Happy investing in your friends!", main);
  }

  // @action
  pollAllTehData = async () => {
    // this.cbAccounts.forEach((account: any) => {
    //   this.getAccountDataAndCache(account);
    // });
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
      this.ipfsGetDataAndCache(data.metadata!);
    }

    setInterval(() => {
      // console.log('ipfs polling round')
      for (const [address, data] of this.betaCache) {
        // console.log(address, data)
        this.ipfsGetDataAndCache(data.metadata!);
      }
    }, 60000);
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
    const data: IPFSCacheObject = JSON.parse(raw[0].content.toString());
    // console.log(data.services)
    // TODO: Cannot cache picture because it will slow down the whole DApp.
    this.ipfsCache = this.ipfsCache.set(metadata, data);
  }

  ipfsTransmute = async (metadata: string) => {
    const obj = {
      digest: metadata,
      hashFunction: 18,
      size: 32,
    };

    const contentAddress = b32IntoMhash(obj);
    return contentAddress;
  }

  @action
  getAccountDataAndCache = async (address: string) => {
    if (!this.betaCache.has(address)) {
      await this.firstFill(address);
    } else { this.updateValues(address); }
    this.getContributorCount(address);
  }

  @action
  fillFromWindowStorage = async (address: string) => {
    if (window.localStorage.getItem(address)) {
      const dataString: string = window.localStorage.getItem(address)!;
      this.betaCache.set(
        address,
        JSON.parse(dataString),
      )
      this.ipfsGetDataAndCache((this.betaCache as any).get(address).metadata);
      return true;
    }
    return false;
  }

  @action
  firstFill = async (address: string) => {
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

    if (await this.fillFromWindowStorage(address)) {
      return;
    }

    console.log('one', address)

    const { abi } = Account;
    const acc = new this.web3.eth.Contract(abi, address);

    // These will change and should be polled
    const metadata = await (acc as any).methods.metadata().call();
    const curServiceIndex = await (acc as any).methods.curServiceIndex().call();
    const reserve = await (acc as any).methods.reserve().call(); 
    const contributions = await (acc as any).methods.contributions().call();
    const curPrice = await (acc as any).methods.currentPrice().call()
    const marketCap = await (acc as any).methods.marketCap().call();
    const totalSupply = await (acc as any).methods.totalSupply().call();
    // This takes longer.
    // this.getContributorCount(address);
    // this.updateValues(address);

    console.log('two', address)
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

    // if (this.account) {
    //   this.getBalance(this.account);
    // }


    console.log('three', address)
    const data = {
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
    };

    this.betaCache.set(
      address,
      data,
    );

    console.log('four', address)

    this.cacheIntoWindowStorage(address, JSON.stringify(data));

    const nowBlock = await this.web3.eth.getBlockNumber();

    // Watch the MetadataUpdated event.
    (acc as any).events.MetadataUpdated({ fromBlock: nowBlock })
    .on('data', (event: any) => {
      const { newMetadata } = event.returnValues;
      const oldEntry = this.betaCache.get(address);
      if (newMetadata !== (oldEntry as any).metadata) {
        const newEntry = Object.assign(oldEntry, { metadata: newMetadata });
        this.betaCache.set(address, newEntry);
      }
      this.ipfsGetDataAndCache(newMetadata);
    });

    // Watch the Bought events
    (acc as any).events.Bought({ fromBlock: nowBlock })
    .on('data', async (event: any) => {
      // Just update values
      const curPrice = await (acc as any).methods.currentPrice().call()
      const marketCap = await (acc as any).methods.marketCap().call();
      const totalSupply = await (acc as any).methods.totalSupply().call();
      const reserve = await (acc as any).methods.reserve().call(); 
      const contributions = await (acc as any).methods.contributions().call();
      // This takes longer.
      this.getContributorCount(address);
      //
      const oldEntry = this.betaCache.get(address);
      const newEntry = Object.assign(oldEntry, {
        curPrice,
        marketCap,
        totalSupply,
        reserve,
        contributions,
      });
      this.betaCache.set(address, newEntry);
    });

    (acc as any).events.Sold({ fromBlock: nowBlock })
    .on('data', async (event: any) => {
      // Just update values
      const curPrice = await (acc as any).methods.currentPrice().call()
      const marketCap = await (acc as any).methods.marketCap().call();
      const totalSupply = await (acc as any).methods.totalSupply().call();
      const reserve = await (acc as any).methods.reserve().call(); 
      const oldEntry = this.betaCache.get(address);
      const newEntry = Object.assign(oldEntry, {
        curPrice,
        marketCap,
        totalSupply,
        reserve,
      });
      this.betaCache.set(address, newEntry);
      this.getContributorCount(address);
    });

    this.ipfsGetDataAndCache(metadata);
  }

  // Updates the values that will change.
  @action updateValues = async (address: string) => {
    const { abi } = Account;
    const acc = new this.web3.eth.Contract(abi, address);

    // These will change and should be polled
    const metadata = await (acc as any).methods.metadata().call();
    const curServiceIndex = await (acc as any).methods.curServiceIndex().call();
    const reserve = await (acc as any).methods.reserve().call(); 
    const contributions = await (acc as any).methods.contributions().call();
    const curPrice = await (acc as any).methods.currentPrice().call()
    const marketCap = await (acc as any).methods.marketCap().call();
    const totalSupply = await (acc as any).methods.totalSupply().call();
    // This takes longer.
    this.getContributorCount(address);
    this.ipfsGetDataAndCache(metadata);
    if (this.betaCache.has(address)) {
      const oldEntry = this.betaCache.get(address);
      const newEntry = Object.assign(oldEntry, {
        metadata,
        curServiceIndex,
        reserve,
        contributions,
        curPrice,
        marketCap,
        totalSupply,
      });
      this.betaCache.set(address, newEntry);
      this.cacheIntoWindowStorage(address, JSON.stringify(newEntry));
    } else {
      this.betaCache.set(address, {
        metadata,
        curServiceIndex,
        reserve,
        contributions,
        curPrice,
        marketCap,
        totalSupply,
      });
    }
  }

  @action
  getContributorCount = async (address: string) => {
    const { abi } = Account;
    const acc = new this.web3Ws.eth.Contract(abi, address);
    const buyEvents = await (acc as any).getPastEvents('Bought', { fromBlock: 0 });
    let buyers = new Set();
    buyEvents.forEach((event: any) => {
      const { buyer } = event.returnValues;
      if (!buyers.has(buyer)) {
        buyers.add(buyer);
      }
    })
    if (this.betaCache.has(address)) {
      if ((this.betaCache as any).get(address).contributorCount !== buyers.size) {
        const oldEntry = this.betaCache.get(address);
        const newEntry = Object.assign(oldEntry, { contributorCount: buyers.size});
        this.betaCache.set(address, newEntry);
      }
    }
  }

  @action
  getBalance = async (address: string) => {
    if (!this.account) {
      setTimeout(() => this.getBalance(address), 4000)
      return;
    }

    const { abi } = Account;
    const acc = new this.web3.eth.Contract(abi, address);
    const bal = await acc.methods.balanceOf(this.account).call();
    this.balancesCache.set(address, bal.toString());

    setTimeout(() => {
      this.getBalance(address)
    }, 4000);

    return bal;
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

    const { abi } = Account;
    const acc = new this.web3.eth.Contract(abi, economy);

    const tx = await acc.methods.updateMetadata(metadata).send({from: this.account});
    this.handleTransactionReturn(tx);
  }
}
