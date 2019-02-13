import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { RingLoader } from 'react-spinners';
import { intercept } from 'mobx';

import MessageItem from './MessageItem';

const Inbox = inject('web3Store')(observer(class Inbox extends React.Component<any,any> {
  state = {
    messages: [],
  }

  componentDidMount = async () => {
    const { web3Store, address } = this.props;
    if (web3Store.web3) {
      web3Store.syncMessages(address).then((res: any) => this.setState({ messages: res }));
    } else {
      setTimeout(() => web3Store.syncMessages(address).then((res: any) => this.setState({ messages: res })));
    }
    try { intercept(this.props, () => null); } catch (e) { console.log(e); }
  }

  render() {
    const { address } = this.props;
    const { messages } = this.state;

    let msgs: any[] = [];

    if (messages.length) {
      msgs = messages.map((eventObj: any) => {
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
      })
    }

    return (
      <div style={{ height: '100%', width: '100%' }}>
        {
          this.state.messages.length < 1
            ?
              <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <RingLoader/>
              </div>
            :
              msgs.reverse()
        }
      </div>
    )
  }

}));

export default Inbox;
