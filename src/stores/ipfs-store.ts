import { observable, action } from 'mobx';
import ipfsClient from 'ipfs-http-client';

import { AccountData, b32IntoMhash, mhashIntoBytes32 } from '../lib/ipfs-util';

export default class IpfsStore {
  @observable ipfs: any = null;
  @observable ipfsCache: Map<string, AccountData> = new Map();
  @observable ipfsLock: boolean = false;

  @action 
  initIPFS = async () => {
    const ipfs = ipfsClient(
      'ipfs.infura.io',
      '5001',
      { protocol: 'https' }
    );

    this.ipfs = ipfs;
    console.log('IPFS Activated');
  }

  initHelper = () => {
    if (!this.ipfs) {
      this.initIPFS();
    }
  }

  @action
  add = async (some: string): Promise<string> => {
    this.initHelper();
    this.ipfsLock = true;
    const ipfsHash = await this.ipfs.add(Buffer.from(some));
    this.ipfsLock = false;
    return ipfsHash;
  }

  @action
  getDataAndCache = async (address: string, b32: string) => {
    this.initHelper();
    console.log('b32: ',b32)
    const obj = {
      digest: b32,
      hashFunction: 18,
      size: 32,
    };

    const contentAddress = b32IntoMhash(obj);
    const raw = await this.ipfs.get(contentAddress);
    console.log(raw);
    const data: AccountData = JSON.parse(raw[0].content.toString());
    this.ipfsCache = this.ipfsCache.set(b32, data);
    console.log('cached: ', b32)
  }

  @action
  getData = async () => {

  }

  @action
  cache = async () => {

  }

  @action
  getBytes32 = (contentAddress: string): string => {
    const data = mhashIntoBytes32(contentAddress);
    console.log(data);
    return data.digest;
  }

  @action
  pollIpfs = async (getStore: any) => {
    if (!getStore().web3) throw new Error('Tried to initiate polling without web3');

    setInterval(() => {
      console.log('ipfs poll round')
      getStore().betaCache

      for (const [address, obj] of getStore().betaCache) {
        console.log(address)
        const { metadata } = obj;
        this.getDataAndCache(address, metadata);
      }
    }, 10000);
  }
}
