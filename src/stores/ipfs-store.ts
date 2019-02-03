import { observable, action } from 'mobx';
import ipfsClient from 'ipfs-http-client';

export default class IpfsStore {
  @observable ipfs = null;

  @action 
  initIPFS = async () => {
    const ipfs = ipfsClient(
      'ipfs.infura.io',
      '5001',
      { protocol: 'https' }
    );

    this.ipfs = ipfs;
  }
}
