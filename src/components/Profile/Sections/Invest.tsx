import React from 'react';
import { inject, observer } from 'mobx-react';
import { RingLoader } from 'react-spinners';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faCoins,
  faUserFriends,
  faDollarSign,
  faMoneyBill,
  faChartLine,
  faSyncAlt
} from '@fortawesome/free-solid-svg-icons';

import MyChart from '../Chart';
import { colors, shadowMixin } from '../../../common';
import Web3Store from '../../../stores/web3-store';

const InvestBox = styled.div`
  background: #FFF;
  border-radius: 60px;
  width: 50vw;
  height: 90vh;
  margin-top: 5vh;
  ${shadowMixin}
  @media (max-width: 450px) {
    min-width: 94vw;
    margin-bottom: 8%;
  }
`;

const TradeScreenTab = styled.button<any>`
  border: none;
  cursor: pointer;
  width: 20%;
  background: #FFF;
  border-radius: 60px 0 0 0;
  color: ${(props: any) => props.active ? colors.SoftBlue : '#000'};
  transition: 0.3s;
  :hover {
    color: ${colors.SoftBlue}
  }
`;

const TradeScreenContent = styled.div`
  width: 100%;
  height: 80%;
  background: #FFF;
  display: flex;
  justify-content: center;
  align-items: center;
`;

type ButtonProps = { exiting: boolean, investing: boolean };

const InvestButton = styled.button<ButtonProps>`
  cursor: pointer;
  width: 50%;
  background: #FFF;
  border-radius: 0 0 0 60px;
  color: #FFF;
  font-weight: 600;
  font-style: italic;
  border-color: ${colors.SoftGreenDark};
  background: ${colors.SoftGreenDark};
  transition: 0.2s;
  :hover {
    background: ${colors.SoftGreen};
    border-color: ${colors.SoftGreen};
  }
  ${props => props.investing &&
    `
  background: ${colors.SoftGreen};
  border-color: ${colors.SoftGreen};
  color: #666666;
  `
  }
  ${props => props.exiting &&
    `
  background: #232323;
  color: #464646;
  border-color: #232323;
  :hover {
    background: #232323;
    color: #464646;
    border-color: black;
  }
  `
  }
`;

const ExitButton = styled.button<ButtonProps>`
  cursor: pointer;
  width: 50%;
  background: #FFF;
  border-radius: 0 0 60px 0;
  color: #FFF;
  font-weight: 600;
  font-style: italic;
  border-color: ${colors.OrangeDark};
  background: ${colors.OrangeDark};
  transition: 0.2s;
  :hover {
    background: ${colors.Orange};
    border-color: ${colors.Orange};
  }
  ${props => props.exiting &&
    `
  background: ${colors.Orange};
  border-color: ${colors.Orange};
  color: #666666;
  `
  }
  ${props => props.investing &&
    `
  background: #232323;
  color: #464646;
  border-color: #232323;
  :hover {
    background: #232323;
    color: #464646;
    border-color: black;
  }
  `
  }
`;

const QuitButton = styled.button`
  color: white;
  padding-right: 4%;
  background: transparent;
  border: none;
  transition: 0.3s;
  font-weight: 900;
  cursor: pointer;
  :hover {
    color: ${colors.SoftBlue}
  }
`;

type ConfirmButtonProps = { exiting: boolean, investing: boolean };


const ConfirmButton = styled.button<ConfirmButtonProps>`
  border-radius: 50px;
  transition: 0.3s;
  height: 70px;
  width: 40%;
  margin-top: 40px;
  color: #FFF;
  border-color: #000;
  font-weight: 600;
  cursor: pointer;
  :hover {
    border-color: #232323;
    background: ${colors.SoftBlue}
    ;
  }
  ${props => props.exiting &&
    `
    background: ${colors.OrangeDark};
    `
  }
  ${props => props.investing &&
    `
    background: ${colors.SoftGreenDark};
    `
  }

`;

const StatsContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  padding: 0;
  padding-top: 50px;
  height: auto;
  width: 100%;
  align-self: flex-start;
`;

const StatsBox = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2%;
  padding: 8px;
  padding-top: 15px;
  border-radius: 10px;
  justify-content: flex-start;
  align-items: flex-start;
  height: 70px;
  width: 38%;
  background: #EEE;
  @media (max-width: 480px) {
    margin: 8px;
  }
  position: relative;
`;

const StatsBoxHeader = styled.div`
  font-size: 11px;
`;

const BalanceRefreshButton = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const StatsBoxContent = styled.div`
  font-size: 25px;
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const InnerDisplay = observer((props: any) => (
  <div style={{ paddingTop: '32px' }}>
    {props.title}
    <hr />
    <div style={{ color: 'black', height: '100%', fontSize: '64px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {props.children}
    </div>
  </div>
));

const StatsDisplay = inject('web3Store')(observer((props: any) => (
  <StatsContainer>

    <StatsBox>
      <StatsBoxHeader>
        Current Price
      </StatsBoxHeader>
      <StatsBoxContent>
        {props.web3Store.web3.utils.fromWei(props.web3Store.betaCache.get(props.address).curPrice).slice(0, 5)} eth
      </StatsBoxContent>
    </StatsBox>

    <StatsBox>
      <StatsBoxHeader>
        Market Cap
      </StatsBoxHeader>
      <StatsBoxContent>
        {props.web3Store.web3.utils.fromWei(props.web3Store.betaCache.get(props.address).marketCap).slice(0, 5)} eth
      </StatsBoxContent>
    </StatsBox>

    <StatsBox>
      <StatsBoxHeader>
        Total Supply
      </StatsBoxHeader>
      <StatsBoxContent>
        {props.web3Store.web3.utils.fromWei(props.web3Store.betaCache.get(props.address).totalSupply).slice(0, 5)} {props.web3Store.betaCache.get(props.address).symbol}
      </StatsBoxContent>
    </StatsBox>

    <StatsBox>
      <StatsBoxHeader>
        Reserve
      </StatsBoxHeader>
      <StatsBoxContent>
        {props.web3Store.web3.utils.fromWei(props.web3Store.betaCache.get(props.address).reserve).slice(0, 5)} eth
      </StatsBoxContent>
    </StatsBox>

    <StatsBox>
      <StatsBoxHeader>
        Contributors
      </StatsBoxHeader>
      <StatsBoxContent>
        {props.web3Store.betaCache.get(props.address).contributorCount}
      </StatsBoxContent>
    </StatsBox>

    <StatsBox>
      <StatsBoxHeader>
        You Own
          </StatsBoxHeader>
      <BalanceRefreshButton onClick={() => props.web3Store.getBalance(props.address)}>
        <FontAwesomeIcon icon={faSyncAlt} size={"xs"} />
      </BalanceRefreshButton>
      <StatsBoxContent>
        {
          (props.web3Store.account && props.web3Store.balancesCache.has(props.address))
            ? props.web3Store.web3.utils.fromWei(props.web3Store.balancesCache.get(props.address)).slice(0, 5) + ' ' + props.web3Store.betaCache.get(props.address).symbol
            : '???' + ' ' + props.web3Store.betaCache.get(props.address).symbol
        }
      </StatsBoxContent>
    </StatsBox>

    {/* 
    <StatsBox>
      <StatsBoxHeader>
        You Own
      </StatsBoxHeader>
      <StatsBoxContent>
        {props.web3Store.web3.utils.fromWei(props.web3Store.balancesCache.get(props.address)).slice(0,5)} {props.web3Store.betaCache.get(props.address).symbol}
      </StatsBoxContent>
    </StatsBox> */}

  </StatsContainer>
)));

type TradeScreenProps = { address: string, web3Store: any };
type TradeScreenState = { active: number, loaded: boolean };

const TradeScreen = observer(class TradeScreen extends React.Component<TradeScreenProps, TradeScreenState> {
  state = {
    active: 0,
    loaded: false,
  }

  componentDidMount = async () => {
    const { address, web3Store } = this.props;
    if (!web3Store.betaCache.has(address)) {
      // Get data and cache it.
      await web3Store.getAccountDataAndCache(address);
    }
    this.pollForData(address);
  }

  pollForData = (address: string) => {
    const data = this.props.web3Store.betaCache.get(address);
    if (!data) {
      setTimeout(() => this.pollForData(address), 2000);
    } else {
      this.setState({ loaded: true });
    }
  }

  sendContributions = () => {
    const { address, web3Store } = this.props;
    if (!web3Store.account) {
      alert('You must be logged in to do this action!');
      return;
    }

    web3Store.sendContribution(address);
  }

  setActive = (idx: any) => {
    this.setState({
      active: parseInt(idx),
    });
  }

  render() {
    const { active } = this.state;
    const { address, web3Store } = this.props;

    const data = web3Store.betaCache.get(address);
    if (!data) {

    }

    return (
      <div style={{ height: '90%', padding: '5px' }}>
        <div style={{ width: '100%', height: '8%', display: 'flex', flexDirection: 'row', paddingLeft: '10px' }}>
          <TradeScreenTab
            active={this.state.active === 0}
            id={0}
            onClick={() => this.setActive(0)}
          >
            <FontAwesomeIcon icon={faCoins} />
          </TradeScreenTab>
          {/* <TradeScreenTab
            active={this.state.active === 1} 
            id ="1"
            onClick={() => this.setActive(1)}
          >
            <FontAwesomeIcon icon={faMoneyBill}/>
          </TradeScreenTab>
          <TradeScreenTab
            active={this.state.active === 2} 
            id ="2"
            onClick={() => this.setActive(2)}
          >
            <FontAwesomeIcon icon={faCoins}/>
          </TradeScreenTab>
          <TradeScreenTab
            active={this.state.active === 3} 
            id ="3"
            onClick={() => this.setActive(3)}
          >
            <FontAwesomeIcon icon={faUserFriends}/>
          </TradeScreenTab> */}
          <TradeScreenTab
            active={this.state.active === 4}
            id="4"
            onClick={() => this.setActive(4)}
          >
            <FontAwesomeIcon icon={faChartLine} />
          </TradeScreenTab>
        </div>
        <TradeScreenContent>
          {
            (
              active === 0
              &&
              // <InnerDisplay
              //   title="Price"
              // >

              (this.state.loaded
                ?
                <StatsDisplay address={address} />
                // `${web3Store.web3.utils.fromWei(web3Store.betaCache.get(address).curPrice)} eth`
                :
                <RingLoader />
              )
              // </InnerDisplay>
            ) ||
            (
              active === 1
              &&
              <InnerDisplay title="Market Cap">
                {
                  this.state.loaded
                    ?
                    `${
                    web3Store.web3.utils.fromWei(web3Store.betaCache.get(address).marketCap).slice(0, 9)
                    } eth`
                    :
                    <RingLoader />
                }
              </InnerDisplay>
            ) ||
            (
              active === 2
              &&
              <InnerDisplay
                title="Supply"
              >
                {
                  this.state.loaded
                    ?
                    `${web3Store.web3.utils.fromWei(web3Store.betaCache.get(address).totalSupply).slice(0, 9)} ${web3Store.betaCache.get(address).symbol.toLowerCase()}`
                    :
                    <RingLoader />
                }
              </InnerDisplay>
            ) ||
            (
              active === 3
              &&
              <InnerDisplay
                title="Contributors"
              >
                {
                  this.state.loaded
                    ?
                    `${web3Store.betaCache.get(address).name} has ${web3Store.web3.utils.fromWei(web3Store.betaCache.get(address).contributions)} contributions waiting.`
                    : 'Loading...'
                }
                <br />
                <button
                  onClick={this.sendContributions}
                >
                  Send!
                </button>
              </InnerDisplay>
            ) ||
            (
              active === 4
              &&
              <MyChart address={address} />
            )
          }
        </TradeScreenContent>
      </div>
    );
  }
});

const InvestScreen = inject('web3Store')(observer(class InvestScreen extends React.Component<any, any> {
  state = {
    howMuch: 0,
    cost: 0,
  }

  inputUpdate = (evt: any) => {
    const { value } = evt.target;
    this.updateCost(value);
  }

  updateCost = async (value: any) => {
    if (value === '') value = '0';
    value = this.props.web3Store.web3.utils.toWei(value, 'ether');
    const cost = await this.props.web3Store.getBuyReturn(
      this.props.address,
      value.toString(),
    );
    this.setState({
      howMuch: value,
      cost,
    })
  }

  buy = async () => {
    const { web3Store } = this.props;
    if (web3Store.readonly) {
      alert('You are in readonly mode! Cannot do actions.');
      return;
    }
    if (this.state.howMuch == 0) {
      alert('You are trying to invest 0. That makes no sense.');
      return;
    }
    await web3Store.buy(this.props.address, this.state.howMuch, this.state.cost);
  }

  render() {
    const { address, web3Store: { betaCache, web3: { utils } } } = this.props;

    let symbol;
    if (betaCache.has(address)) {
      symbol = betaCache.get(address).symbol;
    } else {
      symbol = "???";
    }

    return (
      <div style={{ height: '90%', background: 'rgba(0,0,0,0.8)', borderRadius: '60px 60px 0 0', textAlign: 'center' }}>
        <div style={{ width: '100%', background: '', height: '22%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', borderRadius: '10px 10px 0 0' }}>
          <QuitButton onClick={this.props.quit}>
            X
          </QuitButton>
        </div>
        <div style={{ color: 'white', fontSize: '32px', paddingTop: '12px' }}>
          How much? ({symbol})
        </div>
        <br />
        <input type={'number'} style={{ color: 'black', marginTop: '20px', background: 'white', border: 'none', width: '30%', height: '50px', fontSize: '40px', textAlign: 'center'  }} onChange={this.inputUpdate}>

        </input>
        <div style={{ color: 'white', fontSize: '32px', paddingTop: '32px' }}>
          Costs:
        </div>
        <div style={{ color: 'grey', fontSize: '28px', paddingTop: '8px' }}>
          {utils.fromWei(this.state.cost.toString())} eth
        </div>
        <br />
        <ConfirmButton
          investing={true}
          exiting={false}
          onClick={this.buy}
        >
          BUY
        </ConfirmButton>
      </div>
    )
  }
}));

const ExitScreen = inject('web3Store')(observer(class ExitScreen extends React.Component<any, any> {
  state = {
    inputVal: 0,
    sellReturn: 0,
  }

  inputUpdate = (evt: any) => {
    const { value } = evt.target;
    this.updateReturnVal(value);
  }

  updateReturnVal = async (value: any) => {
    if (value === '') value = '0';
    value = this.props.web3Store.web3.utils.toWei(value, 'ether');
    const returnVal = await this.props.web3Store.getSellReturn(
      this.props.address,
      value.toString(),
    );
    this.setState({
      inputVal: value,
      sellReturn: returnVal,
    })
  }

  sell = async () => {
    const { web3Store } = this.props;
    if (web3Store.readonly) {
      alert('You are in readonly mode! Cannot do actions.');
      return;
    }
    if (this.state.inputVal == 0) {
      alert('You are trying to invest 0. That makes no sense.');
      return;
    }
    await web3Store.sell(this.props.address, this.state.inputVal);
  }

  render() {
    const { web3Store } = this.props;

    return (
      <div style={{ height: '90%', background: 'rgba(0,0,0,0.8)', borderRadius: '60px 60px 0 0', textAlign: 'center' }}>
        <div style={{ width: '100%', background: '', height: '22%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', borderRadius: '10px 10px 0 0' }}>
          <QuitButton onClick={this.props.quit}>
            X
          </QuitButton>
        </div>
        <div style={{ color: 'white', fontSize: '32px', paddingTop: '12px' }}>
          Leaving so soon?
        </div>
        <br />
        <input type={'number'} style={{ color: 'black', marginTop: '20px', background: 'white', border: 'none', width: '30%', height: '50px', fontSize: '40px', textAlign: 'center' }} onChange={this.inputUpdate} />
        <div style={{ color: 'white', fontSize: '32px', paddingTop: '32px' }}>
          Returns:
        </div>
        <div style={{ color: 'grey', fontSize: '28px', paddingTop: '8px' }}>
          {web3Store.web3.utils.fromWei(this.state.sellReturn.toString())} eth
        </div>
        <br />
        <ConfirmButton
          investing={false}
          exiting={true}
          onClick={this.sell}
        >
          SELL
        </ConfirmButton>
      </div>
    )
  }
}));

class InvestSection extends React.Component<any, any> {
  state = {
    investing: false,
    exiting: false,
  }

  startInvest = () => {
    this.setState({
      investing: true,
      exiting: false,
    });
  }

  startExit = () => {
    this.setState({
      investing: false,
      exiting: true,
    });
  }

  quit = () => {
    this.setState({
      investing: false,
      exiting: false,
    });
  }

  render() {
    const { investing, exiting } = this.state;
    const { address } = this.props;
    return (
      <div>
        <InvestBox>
          {
            (investing && <InvestScreen address={address} quit={this.quit} />)
            ||
            (exiting && <ExitScreen address={address} quit={this.quit} />)
            ||
            <TradeScreen address={address} web3Store={this.props.web3Store} />
          } 
          <div style={{ height: '10%', display: 'flex' }}>
            <InvestButton investing={investing} exiting={exiting} onClick={this.startInvest}>
              INVEST
            </InvestButton>
            <ExitButton onClick={this.startExit} investing={investing} exiting={exiting}>
              EXIT
            </ExitButton>
          </div>
        </InvestBox>
      </div>
    );
  }
};

export default InvestSection;
