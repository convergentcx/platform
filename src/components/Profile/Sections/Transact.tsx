import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

import { colors, shadowMixin } from '../../../common';

const TransactContainer = styled.div`
  background: #FFF;
  border-radius: 60px;
  border-width: 10px;
  width: 50vw;
  height: 90vh;
  margin-top: 5vh;
  ${shadowMixin}
  @media (max-width: 450px) {
    width: 94vw;
    margin-bottom: 8%;
  }
`;

const TransactInner = styled.div`
  padding: 70px;
  text-align: left;
`;

const StatsContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  padding: 0;
  padding-top: 40px;
  height: auto;
  width: 100%;
  align-self: flex-start;
`;

const StatsBoxHeader = styled.div`
  font-size: 11px;
`;

const StatsBoxContent = styled.div`
  font-size: 25px;
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const StatsBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  border-radius: 10px;
  justify-content: flex-start;
  align-items: flex-start;
  height: 70px;
  width: 45%;
  background: #EEE;
  @media (max-width: 480px) {
    margin: 8px;
  }
  position: relative;
`;

const ServiceDescription = styled.div`
  padding-top: 40px;
  
  font-size: 14px;
`;

const RequestButton = styled.button`
  cursor: pointer;
  width: 100%;
  border-radius: 0 0 60px 60px;
  background: ${colors.SoftBlue};
  color: #FFF;
  font-weight: 600;
  font-style: italic;
  border: none;
  transition: 0.2s;
  :hover {
    color: #FFF;
    background: ${colors.CvgPurp};
  }
`;

const RequestTextArea = styled.textarea`
  width: 100%;
  margin-top: 30px;
  background: #EEE;
  color: #000;
`;

const TransactSection = observer(class TransactPage extends React.Component<any, any> {
  state = {
    msg: '',
    service: {},
  }

  request = () => {
    this.props.web3Store.request(this.props.address, 0, this.state.msg);
  }

  render() {
    const { address, web3Store } = this.props;
    const { betaCache, ipfsCache } = web3Store;
    let title, description, price;
    if (betaCache.has(address) && ipfsCache.has(betaCache.get(address).metadata)) {
      const { metadata } = betaCache.get(address);
      const { services } = ipfsCache.get(metadata);
      title = services[0].title;
      description = services[0].description;
      price = services[0].price;
    }

    return (
      <TransactContainer>
        <div style={{ height: '90%' }}>
          <TransactInner>
            Here goes the title of the service
            <StatsContainer>
              <StatsBox>
                <StatsBoxHeader>
                  Price in Token
                  </StatsBoxHeader>
                  <StatsBoxContent>
                    1 CVG
                  </StatsBoxContent>
                </StatsBox>
                <StatsBox>
                  <StatsBoxHeader>
                    Current price in ETH
                  </StatsBoxHeader>
                  <StatsBoxContent>
                    4 eth
                  </StatsBoxContent>
                </StatsBox>
            </StatsContainer>
            <ServiceDescription>
              Here goes the long description that people will hopefully add and be able to add some day and that users might actually find valuable under certain conditions.
              Here goes the long description that people will hopefully add and be able to add some day and that users might actually find valuable under certain conditions.
            </ServiceDescription>
            <div style={{ display: 'flex', width: '100%' }}>
              <div style={{ fontSize: '64px', width: '60%', textAlign: 'left' }}>
                {title}
              </div>
              <div style={{ fontSize: '128px', alignSelf: 'center', justifySelf: 'center', width: '50%' }}>
                {price}
              </div>
            </div>
            <div style={{ fontSize: '16px', textAlign: 'left' }}>
              {description}
            </div>
            <RequestTextArea 
              name="msg" 
              placeholder="Enter a message with details about your request ..." 
              rows={6} 
              cols={30} 
              onChange={(e) => this.setState({ [e.target.name]: e.target.value })}
            />
          </TransactInner>
        </div>
        <div style={{ height: '10%', display: 'flex' }}>
          <RequestButton onClick={this.request}>
            REQUEST
          </RequestButton>
        </div>
      </TransactContainer>
    )
  }
});

export default TransactSection;
