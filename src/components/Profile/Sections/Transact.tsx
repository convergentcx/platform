import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

import { colors, shadowMixin } from '../../../common';

import { RingLoader } from 'react-spinners';

const TransactContainer = styled.div`
  background: #FFF;
  border-radius: 60px;
  border-width: 10px;
  width: 50vw;
  height: 90vh;
  margin-top: 5vh;
  ${shadowMixin}
  margin-bottom: 5vh;
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
  font-size: 20px;
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
  height: 56px;
  width: 40%;
  background: #EEE;
  @media (max-width: 480px) {
    margin: ;
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
    let servicesNumber = 0;
    let serviceArray: any[] = [];
    let symbol: any, curPrice: any;
    if (betaCache.has(address) && ipfsCache.has(betaCache.get(address).metadata)) {
      const { metadata, symbol: s, curPrice: cp, curServiceIndex } = betaCache.get(address);
      servicesNumber = parseInt(curServiceIndex) + 1;
      const { services } = ipfsCache.get(metadata);
      if (services.length < servicesNumber) {
        servicesNumber = services.length;
      }

      serviceArray = services;

      [0, 1, 2].map((i: number) => {
        console.log(serviceArray[i]);
      })
      // title = services[0].title;
      // description = services[0].description;
      // price = services[0].price;
      symbol = s;
      curPrice = cp;
    }

    if (servicesNumber > 3) {
      servicesNumber = 3;
    }

    return (
      <>
        { serviceArray.length && 
          [...Array(servicesNumber).keys()].map((i: number) => {
            console.log(i)
           return (
            <TransactContainer>
              <div style={{ height: '90%' }}>
                <TransactInner>
                  {(serviceArray[i] && serviceArray[i].title) || 'No title'}
                  <StatsContainer>
                    <StatsBox>
                      <StatsBoxHeader>
                        Price in Token
                        </StatsBoxHeader>
                        <StatsBoxContent>
                          {(serviceArray[i] && serviceArray[i].price) || '?'} {symbol}
                        </StatsBoxContent>
                      </StatsBox>
                      <StatsBox>
                        <StatsBoxHeader>
                          Current price in ETH
                        </StatsBoxHeader>
                        <StatsBoxContent>
                          {
                            web3Store.web3.utils.fromWei(web3Store.web3.utils.toBN(curPrice).mul(web3Store.web3.utils.toBN(serviceArray[i].price || 0))) || '?'} eth
                        </StatsBoxContent>
                      </StatsBox>
                  </StatsContainer>
                  <ServiceDescription>
                    {(serviceArray[i] && serviceArray[i].description) || 'No description'}
                  </ServiceDescription>
                  {/* <div style={{ display: 'flex', width: '100%' }}>
                    <div style={{ fontSize: '64px', width: '60%', textAlign: 'left' }}>
                      {title}
                    </div>
                    <div style={{ fontSize: '128px', alignSelf: 'center', justifySelf: 'center', width: '50%' }}>
                      {price}
                    </div>
                  </div>
                  <div style={{ fontSize: '16px', textAlign: 'left' }}>
                    {description}
                  </div> */}
                  <RequestTextArea 
                    name={`msg${i}`} 
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
          })
        }
      </>
    )
  }
});

export default TransactSection;
