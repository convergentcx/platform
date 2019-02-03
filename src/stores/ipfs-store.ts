import { observable, action } from 'mobx';
import ipfsClient from 'ipfs-http-client';

import { AccountData, b32IntoMhash, mhashIntoBytes32 } from '../lib/ipfs-util';

export default class IpfsStore {
  @observable ipfs: any = null;
  @observable ipfsCache: Map<string, AccountData> = new Map();

  @action 
  initIPFS = async () => {
    const ipfs = ipfsClient(
      'ipfs.infura.io',
      '5001',
      { protocol: 'https' }
    );

    this.ipfs = ipfs;
  }

  initHelper = () => {
    if (!this.ipfs) {
      this.initIPFS();
    }
  }

  @action
  getDataAndCache = async (b32: string) => {
    this.initHelper();

    const obj = {
      digest: b32,
      hashFunction: 16,
      size: 32,
    };

    const contentAddress = b32IntoMhash(obj);
    const raw = await this.ipfs.get(contentAddress);
    const data: AccountData = JSON.parse(raw[0].content.toString());
    this.ipfsCache = this.ipfsCache.set(b32, data);
  }

  @action
  getData = async () => {

  }

  @action
  cache = async () => {

  }
}
