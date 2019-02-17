import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { RingLoader } from 'react-spinners';
import { intercept } from 'mobx';

import MessageItem from './MessageItem';

const Inbox = inject('web3Store')(observer(class Inbox extends React.Component<any,any> {

  componentDidMount = async () => {
    const { web3Store, address } = this.props;
    if (web3Store.web3) {
      web3Store.syncMessages(address);
    } else {
      setTimeout(() => web3Store.syncMessages(address));
    }
    try { intercept(this.props, () => null); } catch (e) { console.log(e); }
  }

  render() {
    const { address, web3Store } = this.props;

    return (
      <div style={{ height: '100%', width: '100%' }}>
        {
          (web3Store.messageCache.has(address)
            && web3Store.messageCache.get(address).length)
            ?
              web3Store.messageCache.get(address).map((eventObj: any) => {
                const { event, blockNumber, returnValues } = eventObj;
                if (event == 'Transfer' || !event || event == 'Approval') return;
        
                let values: {} = {};
                Object.keys(returnValues).forEach((value: any) => {
                  if (!parseInt(value) && parseInt(value) !== 0) {
                    Object.assign(values, { [value]: returnValues[value] });
                  }
                })
                return (
                  <MessageItem
                    address={address}
                    key={Math.random()}
                    title={event}
                    blockNumber={blockNumber}
                    content={values}
                  />
                );
              }).reverse()
            :
              <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <RingLoader/>
              </div>
        }
      </div>
    )
  }
}));

export default Inbox;
