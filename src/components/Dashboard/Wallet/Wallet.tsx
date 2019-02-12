import React from 'react';
import { inject, observer } from 'mobx-react';

const Wallet = inject('web3Store')(observer(class Wallet extends React.Component<any, any> {

  render() {
    return (
      <>
        Coming soon!
      </>
    )
  }
}));

export default Wallet;
