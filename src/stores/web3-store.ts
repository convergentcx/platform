import { observable, action } from 'mobx';
import Web3 from 'web3';

export default class Web3Store {
  @observable account = null;
  @observable readonly = false;  // App starts in readonly mode
  @observable web3: any|null = null;
  // @observable test: string = 'not updated';

  @action
  updateAccount = async () => {
    if (!this.web3 || this.readonly) { return; }
    const main = (await this.web3.eth.getAccounts())[0];
    console.log('setting account ', main);
    this.account = main;
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
    console.log('enabled');
  }

  // @action
  // updateTest = () => {
  //   console.log('testing');
  //   this.test = 'updated';
  // }
}
