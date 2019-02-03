import React from 'react';
import { Link, Route, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faCoins,
  faHandHoldingUsd,
  faHandshake, 
  faThumbsUp,
  faMapMarkerAlt, 
  faInfoCircle, 
  faUserFriends,
  faDollarSign,
  faMoneyBill, 
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';

import Logan from '../../assets/pics/Logan-Saether.jpg';
import { colors, shadowMixin } from '../../common';

const NavBox = styled.div`
  width: 260px;
  background-color: #FFF;
  position: sticky;
  margin-top: 20%;
  top: 20%;
  border-radius: 10px;
  margin-left: auto;
  margin-right: auto;
  ${shadowMixin}
`;

const NavList = styled.ul`
  color: black;
  display: block;
  width: 100%;
  padding: 0;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  padding-left: 24px;
  border: solid #888888;
  border-width: 0px;
  border-top-width: 0.5px;
  font-size: 11px;
  height: 32px;
`;

const ListLink = styled(Link)`
  text-decoration: none;
  color: #000;
  transition: 0.2s;
  :hover {
    color: ${colors.CvgPurp};
  }
`;

const NavName = styled.p`
  font-size: 16px;
  padding-left: 24px;
`;


const ProfileContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  margin-left: 0%;
  margin-right: 0%;
  max-width: 100%;
  min-height: 100vh;
  background: #E9EDF2;
`;

const Left = styled.div`
  width: calc(40%);
  @media (max-width: 450px) {
    margin-left: -5px;
    width: 100%;
  }
`;

const Middle = styled.div`
  width: calc(60%);
  text-align: center;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  @media (max-width: 450px) {
    width: 100%;
    margin-left: -5px;
  }
`;


const InvestBox = styled.div`
  background: #FFF;
  border-radius: 10px;
  width: 50vw;
  height: 90vh;
  margin-top: 5vh;
`;

const AboutContainer = styled.div`
  background: #FFF;
  border-radius: 10px;
  width: 50vw;
  height: 90vh;
  margin-top: 5vh;
  ${shadowMixin}
`;

const TradeScreenTab = styled.button<any>`
  width: 20%;
  background: ${(props: any) => props.active ? '#CCC' : '#FFF'};
  border: none;
  border-radius: 10px 0 0 0;
  color: ${(props: any) => props.active ? '#2424D0' : '#000'};
  transition: 0.3s;
  :hover {
    color: #2424D0;
  }
`;

const TradeScreenContent = styled.div`
  width: 100%;
  height: 92%;
  background: #CCC;
`;

type ButtonProps = {exiting: boolean, investing: boolean};

const InvestButton = styled.button<ButtonProps>`
  width: 50%;
  background: #FFF;
  border-radius: 0 0 0 10px;
  border-color: #348964;
  color: #348964;
  transition: 0.2s;
  :hover {
    color: #FFF;
    background: #348964;
  }
  ${props => props.investing &&
  `
  background: #348964;
  color: #FFF;
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
  }
  ` 
  }
`;

const ExitButton = styled.button<ButtonProps>`
  width: 50%;
  background: #FFF;
  border-radius: 0 0 10px 0;
  border-color: #810b0b;
  color: #810b0b;
  transition: 0.2s;
  :hover {
    color: #FFF;
    background: #810b0b;
  }
  ${props => props.exiting &&
  `
  background: #810b0b;
  color: #FFF;
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
  }
  ` 
  }
`;


const QuitButton = styled.button`
  color: #2424D0;
  padding-right: 4%;
  background: transparent;
  border: none;
  transition: 0.3s;
  :hover {
    color: orange;
  }
`;

const ConfirmButton = styled.button`
  border-radius: 50px;
  background: #2424D0;
  transition: 0.3s;
  height: 80px;
  width: 80px;
  color: #FFF;
  :hover {
    background: #05021A;
    color: orange;
    border-color: purple;
  }
`;

const RequestButton = styled.button`
  height: 32px;
  width: 100%;
  background: #2424D0;
  color: #FFF;
  border: none;
  border-radius: 0 0 10px 10px;
  transition: 0.3s;
  :hover {
    color: orange;
    background: #05021A;
  }
`;

const InnerDisplay = (props: any) => (
  <div style={{ paddingTop: '32px' }}>
    {props.title}
    <hr/>
    <div style={{ color: 'grey', fontSize: '64px' }}>
      {props.children}
    </div>
  </div>
);

type TradeScreenProps = {address: string, web3Store: any};
type TradeScreenState = {active: number, loaded: boolean};

class TradeScreen extends React.Component<TradeScreenProps, TradeScreenState> {
  state = {
    active: 0,
    loaded: false,
  }

  componentDidMount = async () => {
    const { address, web3Store } = this.props;
    // Get data and cache it.
    await web3Store.getContractDataAndCache(address);
    this.pollForData(address);
  }

  pollForData = (address: string) => {
    const data = this.props.web3Store.betaCache[address];
    if (!data) {
      setTimeout(() => this.pollForData(address), 2000);
    } else {
      this.setState({ loaded: true });
    }
  }

  setActive = (evt: any) => {
    const { id } = evt.target;
    this.setState({
      active: parseInt(id),
    });
  }

  render() {
    const { active } = this.state;
    const { address, web3Store } = this.props;

    const data = web3Store.betaCache[address];
    if (!data) {
      
    }

    return (
      <div style={{ height: '90%' }}>
        <div style={{ width: '100%', height: '8%', display: 'flex', flexDirection: 'row' }}>
          <TradeScreenTab
            active={this.state.active === 0}
            id={0}
            onClick={this.setActive}
          >
            <FontAwesomeIcon icon={faDollarSign}/>
          </TradeScreenTab>
          <TradeScreenTab
            active={this.state.active === 1} 
            id ="1"
            onClick={this.setActive}
          >
            <FontAwesomeIcon icon={faMoneyBill}/>
          </TradeScreenTab>
          <TradeScreenTab
            active={this.state.active === 2} 
            id ="2"
            onClick={this.setActive}
          >
            <FontAwesomeIcon icon={faCoins}/>
          </TradeScreenTab>
          <TradeScreenTab
            active={this.state.active === 3} 
            id ="3"
            onClick={this.setActive}
          >
            <FontAwesomeIcon icon={faUserFriends}/>
          </TradeScreenTab>
          <TradeScreenTab
            active={this.state.active === 4} 
            id ="4"
            onClick={this.setActive}
          >
            <FontAwesomeIcon icon={faChartLine}/>
          </TradeScreenTab>
        </div>
        <TradeScreenContent>
          {
            (
              active === 0
              &&
              <InnerDisplay
                title="Price"
                // info={`${web3Store.web3.utils.fromWei(web3Store.betaCache[address].price)} eth`}
              >
                {
                  this.state.loaded
                  ?
                    `${web3Store.web3.utils.fromWei(web3Store.betaCache[address].price)} eth`
                  :
                    'Loading....'
                }
              </InnerDisplay>
            ) ||
            (
              active === 1
              &&
              <InnerDisplay title="Market Cap">
                {
                  this.state.loaded
                  ?
                    `${web3Store.web3.utils.fromWei(
                      (web3Store.betaCache[address].price * web3Store.betaCache[address].ts).toString()
                    )} eth`
                  :
                      'Loading....'
                }
              </InnerDisplay>
            ) ||
            (
              active === 2
              &&
              <InnerDisplay
                title="Supply"
                info="1,000,576 LGN"
              >
                {
                  this.state.loaded
                  ?
                    `${web3Store.betaCache[address].ts} ${web3Store.betaCache[address].symbol}`
                  :
                    'Loading....'
                }
              </InnerDisplay>
            ) ||
            (
              active === 3
              &&
              <InnerDisplay
                title="Contributors"
                info="1,207"
              />
            ) ||
            (
              active === 4
              &&
              <InnerDisplay
                title="Bonding Curve"
                info="Custom Tab"
              />
            )
          }
        </TradeScreenContent>
      </div>
    );
  }
}

const InvestScreen = (props: any) => (
  <div style={{ height: '90%', background: '#000', borderRadius: '10px 10px 0 0', textAlign: 'center' }}>
    <div style={{ width: '100%', background: '', height: '8%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', borderRadius: '10px 10px 0 0' }}>
      <QuitButton onClick={props.quit}>
        X
      </QuitButton>
    </div>
    <div style={{ color: 'white', fontSize: '32px', paddingTop: '12px' }}>
      How much?
    </div>
    <br/>
    <input style={{ color: 'black', background: 'white', border: 'none' }}>

    </input>
    <div style={{ color: 'white', fontSize: '32px', paddingTop: '32px' }}>
      You get:
    </div>
    <div style={{ color: 'grey', fontSize: '28px', paddingTop: '8px' }}>
      ~ 12.4009 LGN
    </div>
    <div style={{ color: 'white', fontSize: '32px', paddingTop: '32px' }}>
      In time:
    </div>
    <div style={{ color: 'grey', fontSize: '28px', paddingTop: '8px' }}>
      24 minutes
    </div>
    <br/>
    <ConfirmButton>
      <FontAwesomeIcon icon={faThumbsUp} size="lg"/>
    </ConfirmButton>
    {/* <div style={{ color: 'white', fontSize: '32px', paddingTop: '32px' }}>
      Logan gets:
    </div>
    <div style={{ color: 'grey', fontSize: '28px', paddingTop: '8px' }}>
      12 USD
    </div> */}
  </div>
)

const ExitScreen = (props: any) => (
  <div style={{ height: '90%', background: '#000', borderRadius: '10px 10px 0 0', textAlign: 'center' }}>
    <div style={{ width: '100%', background: '', height: '8%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', borderRadius: '10px 10px 0 0' }}>
      <QuitButton onClick={props.quit}>
        X
      </QuitButton>
    </div>
    <div style={{ color: 'white', fontSize: '32px', paddingTop: '12px' }}>
      Leaving so soon?
    </div>
    <br/>
    <input style={{ color: 'black', background: 'white', border: 'none' }}/>
    <div style={{ color: 'white', fontSize: '32px', paddingTop: '32px' }}>
      ROI:
    </div>
    <div style={{ color: 'grey', fontSize: '28px', paddingTop: '8px' }}>
      ~$44.96 USD
    </div>
    <div style={{ color: 'white', fontSize: '32px', paddingTop: '32px' }}>
      In time:
    </div>
    <div style={{ color: 'grey', fontSize: '28px', paddingTop: '8px' }}>
      3 minutes
    </div>
    <br/>
    <ConfirmButton>
      <FontAwesomeIcon icon={faThumbsUp} size="lg"/>
    </ConfirmButton>
  </div>
);

class InvestPage extends React.Component<any, any> {
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
    console.log(this.props)
    return (
      <div>
        <InvestBox>
          {
            (investing && <InvestScreen quit={this.quit}/>)
            ||
            (exiting && <ExitScreen quit={this.quit}/>)
            ||
            <TradeScreen address={this.props.address} web3Store={this.props.web3Store}/>
          }
          {/* <div style={{ height: '30%' }}/> */}
          <div style={{ height: '10%', display: 'flex' }}>
          <InvestButton investing={investing} exiting={exiting} onClick={this.startInvest}>
            Invest
          </InvestButton>
          <ExitButton onClick={this.startExit} investing={investing} exiting={exiting}>
            Exit
          </ExitButton>
          </div>
        </InvestBox>
      </div>
    );
  }
};

const AboutPage = (props: any) => (
 <AboutContainer>
   {
     props.web3Store.betaCache[props.address]
     ?
      props.web3Store.betaCache[props.address].bio
     : 'filling'
   }
 </AboutContainer>
)

const TransactPage = () => (
  <div style={{ width: '45vw', marginLeft: '5%', marginTop: '5vh', height: '90vh' }}>
    <div style={{ display: 'flex', width: '100%' }}>
      <div style={{ fontSize: '64px', width: '60%', textAlign: 'left'}}>
        Film Screening
      </div>
      <div style={{ fontSize: '128px', alignSelf: 'center', justifySelf: 'center', width: '50%' }}>
        1
      </div>
    </div>
    <div style={{ fontSize: '16px', textAlign: 'left' }}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>
    <br/>
    <input style={{ border: 'solid', borderColor: 'black', color: 'black', borderWidth: '1px', background: 'white', width: '80%'}}/>
    <br/>
    <br/>
    <RequestButton>
      Request
    </RequestButton>
    <hr/>
    {/* Two
    <hr/>
    Three
    <hr/> */}
  </div>
)

const ProfilePage = withRouter((props: any) => (
  <ProfileContainer>
    <Left>
      <NavBox>
        <img src={Logan} alt="noneya" style={{ width: '100%', height: '45%', borderRadius: '10px 10px 0 0' }}/>
        <NavName>Logan Saether</NavName>
        <div style={{ fontSize: '10px', paddingLeft: '24px', marginTop: '-12px' }}>
          <FontAwesomeIcon icon={faMapMarkerAlt} size="sm"/>
          &nbsp;
          Berlin, Germany
        </div>
        <NavList>
          <ListItem>
            <FontAwesomeIcon icon={faInfoCircle} size="sm"/>
            &nbsp;&nbsp;
            <ListLink to={`/profile/${props.match.params.address}/about`}>about</ListLink>
          </ListItem>
          {/* <ListItem>
            <FontAwesomeIcon icon={faRss} size="sm"/>
            &nbsp;&nbsp;
            <ListLink to="/profile/feed">feed</ListLink>
          </ListItem> */}
          <ListItem>
            <FontAwesomeIcon icon={faHandHoldingUsd} size="sm"/>
            &nbsp;&nbsp;
            <ListLink to={`/profile/${props.match.params.address}/invest`}>invest</ListLink>
          </ListItem>
          <ListItem>
            <FontAwesomeIcon icon={faHandshake} size="sm"/>
            &nbsp;&nbsp;
            <ListLink to={`/profile/${props.match.params.address}/transact`}>transact</ListLink>
          </ListItem>
          {/* <ListItem>
            <FontAwesomeIcon icon={faUserFriends} size="sm"/>
            &nbsp;&nbsp;
            <ListLink to="/profile/network">network</ListLink>
          </ListItem> */}
        </NavList>
      </NavBox>
    </Left>
    <Middle>
      <Route path={`/profile/${props.match.params.address}/about`} render={() => <AboutPage address={props.match.params.address} web3Store={props.web3Store}/>}/>
      {/* <Route path='/profile/feed' component={ContentPage}/> */}
      <Route path={`/profile/${props.match.params.address}/invest`} render={() => <InvestPage address={props.match.params.address} web3Store={props.web3Store}/>}/>
      <Route path={`/profile/${props.match.params.address}/transact`} component={TransactPage}/>
      {props.children}
    </Middle>
  </ProfileContainer>
));

export default ProfilePage;
