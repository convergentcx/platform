import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { inject } from 'mobx-react';

import makeBlockie from 'ethereum-blockies-base64';

const MessageRow = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  height: 40px;
  background: #CCC;
  align-items: center;
  border: none;
  cursor: pointer;
  transition: 0.4s;
  :hover {
    background: rgba(255,255,255, 0.5);
  }
`;

const MessageTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 11px;
  width: 25%;
  height: 100%;
`;

const MessageBlockNumber = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 11px;
  width: 25%;
  height: 100%;
`;

const MessagePreview = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 11px;
  width: 35%;
  height: 100%;
`;

const MessageButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 11px;
  width: 15%;
  height: 100%;
`;

const MessageExpand = styled.div<any>`
  display: ${props => props.show ? 'flex' : 'none'};
  width: 100%;
  height: ${props => props.show ? '60px' : '0px'};
  justify-content: center;
  align-items: center;
  font-size: 11px;
  background: grey;
`;

const MessageShowMore = styled.div`
  border: none;
  background: transparent;
  color: #222;
  font-size: 24px;
`;

type MessageItemProps = {
  title: string,
  blockNumber: number,
  content: {},
  address: string,
  web3Store?: any,
}

type MessageItemState = {
  show: boolean,
}

const sort = (type: string, content: any) => {
  if (type === 'ServiceRequested') {
    const { requestor, serviceIndex, message } = content;
    const blockie = makeBlockie(requestor);
    return (
      <div style={{ display: 'flex', width: '100%', height: '100%'}}>
        <img style={{ width: '60px', height: '60px'}} src={blockie} alt={requestor}/>
        <div style={{ width: '30%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {serviceIndex}
        </div>
        <div style={{ width: '100%', padding: '16px', fontSize: '12px'}}>
          {message}
        </div>
      </div>
    )
  }
  return JSON.stringify(content);
}

const MessageItem = inject('web3Store')(class MessageItem extends React.Component<MessageItemProps, MessageItemState> {
  state = {
    show: false,
  }

  toggleExpand = () => {
    this.setState({ show: !this.state.show });
  }

  render() {
    const { web3Store } = this.props;
    // const { services } = web3Store.web3Store.betaCache.get(this.props.address).metadata
    return (
      <>
      <MessageRow onClick={this.toggleExpand}>
        <MessageTitle>
          {this.props.title}
        </MessageTitle>
        <MessageBlockNumber>
          {this.props.blockNumber}
        </MessageBlockNumber>
        <MessagePreview>
          
        </MessagePreview>
        <MessageButtonContainer>
          <MessageShowMore>
            <FontAwesomeIcon icon={this.state.show ? faCaretUp : faCaretDown}/>
          </MessageShowMore>
        </MessageButtonContainer>
      </MessageRow>
      <MessageExpand show={this.state.show}>
        {sort(this.props.title, this.props.content)}
      </MessageExpand>
      </>
    );
  }
});

export default MessageItem;
