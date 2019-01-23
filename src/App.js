import React, { Component } from 'react';
import { Link, Route, withRouter } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { observer, inject } from 'mobx-react';
import makeBlockie from 'ethereum-blockies-base64';

/// Assets
import Logan from './assets/pics/Logan-Saether.jpg';
import Reptile from './assets/pics/contemplative-reptile.jpg';

/// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHandHoldingUsd,
  faHandshake, 
  faCamera, 
  faThumbsUp, 
  faArrowRight, 
  faArrowLeft, 
  faMapMarkerAlt, 
  faInfoCircle, 
  faUserFriends, 
  faRss, 
  faCoins, 
  faDollarSign,
  faMoneyBill, 
  faChartLine 
} from '@fortawesome/free-solid-svg-icons';

/// Components
import Home from './components/Home';
import FAQ from './components/FAQ';
import Subject from './components/Dropzone.jsx';

/// Styled-Components
// Pallette
const colors = {
  White: '#FFF',
  Black: '#000',
  CvgBlue: '#2424D0',
  CvgPurp: '#411999',
  darkPurp: '#05021A',
  bgGrey: '#E9EDF2',
};

// Mixins
const shadowMixin = 'box-shadow: 0 15px 35px rgba(50,50,93,.1), 0 5px 15px rgba(0,0,0,.07);'

// Components
/*

  Transitions
  --------------
  Fast -    0.2s
  Medium -  0.3s
  Slow -    0.5s

*/
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

const Wrapper = styled.div`
  margin: 0;
  padding: 0;
  font-size: 1.25rem;
  font-weight: 500;
  background: #f3f3f3;
  min-height: 100vh;
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  margin-left: 0%;
  margin-right: 0%;
  max-width: 100%;
  min-height: 100vh;
  background: #E9EDF2;
`

const Left = styled.div`
  width: calc(40%);
  @media (max-width: 450px) {
    margin-left: -5px;
    width: 100%;
  }
`

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
`

const ContentBox = styled.div`
  background: #FFF;
  border-radius: 10px;
  width: 50vw;
  height: 500px;
  margin-top: 50px;
  margin-left: 0;
`;

const ContentDate = styled.div`
  font-size: 11px;
  color: #999;
  padding-right: 12px;
  padding-bottom: 4px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const ContentHashes = styled.div`
  font-size: 11px;
  color: #999;
  padding-left: 8px;
  width: 50%;
  text-align: left;
  height: 100%;
  margin-top: 0;
  display: flex;
  flex-flow: row wrap;
`;

const ContentHash = styled.a`
  transition: 0.3s;
  margin-left: 12px;
  cursor: pointer;
  :hover {
    color: #555;
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

const TradeScreenTab = styled.button`
  width: 20%;
  background: ${props => props.active ? '#CCC' : '#FFF'};
  border: none;
  border-radius: 10px 0 0 0;
  color: ${props => props.active ? '#2424D0' : '#000'};
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

const InvestButton = styled.button`
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

const ExitButton = styled.button`
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

const SideNavLink = styled(Link)`
  padding: 8px 8px 8px 32px;
  text-decoration: none;
  font-size: 25px;
  color: #AAA;
  display: block;
  transition: 0.3s;
  :hover {
    color: #000;
  }
`;

const SideNavClose = styled.a`
  position: absolute;
  top: 0;
  right: 25px;
  margin-left: 50px;
  text-decoration: none;
  color: #AAA;
  display: block;
  transition: 0.3s;
  :hover {
    color: #000;
  }
`;

const SideNavOpen = styled.a`
  position: absolute;
  top: 0;
  right: 0;
  text-decoration: none;
  color: #AAA;
  display: flex;
  background: white;
  width: 25px;
  text-align: center;
  transition: 0.3s;
  :hover {
    color: #000;
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

const DashboardContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: #2424D0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DashboardLeft = styled.div`
  width: 20%;
  height: 100%;
  background: #005566;
`;

const DashboardMiddle = styled.div`
  width: 50%;
  height: 100%;
  background: #117788;
  justify-content: center;
  display: flex;
`;

const PolaroidCard = styled.div`
  width: 400px;
  height: 500px;
  background: #444488;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const CreativeInput = styled.input`
  width: 80%;
  color: #FFF;
  height: 30px;
  margin-top: 8px;
`;

const DashboardRight = styled.div`
  width: 20%;
  height: 100%;
  background: #2299AA;
`;

const InnerDisplay = (props) => (
  <div style={{ paddingTop: '32px' }}>
    {props.title}
    <hr/>
    <div style={{ color: 'grey', fontSize: '64px' }}>
      {props.info}
    </div>
  </div>
)

const ContentImage = styled.img`
  width: calc(100% - 16px);
  height: 420px;
  padding-top: 8px;
  border-radius: 16px 16px 0 0;
`;

const HoveringBlockie = styled.img`
  position: fixed;
  width: 64px;
  height: 64px;
  top: 16px;
  right: 16px;
  border-radius: 50px;
  ${shadowMixin}
`;

class HoverableContent extends Component {
  state = {
    hovering: false,
  }

  render() {
    return (
      <div 
        onMouseEnter={() => this.setState({ hovering: true })} 
        onMouseLeave={() => this.setState({ hovering: false })}
        style={{ background: '', height: '436px' }}
      >
        <ContentImage src={Reptile} alt="ronja"/>
        {
          this.state.hovering &&
          <div style={{ background: 'rgba(0,0,0,0.6)', position: 'relative', top: '-425px', height: '420px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#FFF', margin: '0 8px 8px 8px', padding: '0', transition: '0.5s', borderRadius: '12px 12px 0 0' }}>
            {(this.props.text && this.props.text.toLowerCase()) || 'no input text with this image'}
          </div>
        }
      </div>
    );
  }
}

const ContentPage = () => (
  <div style={{ paddingBottom: '50px' }}>
    <ContentBox>
      <HoverableContent text="these are my statues"/>
      <div style={{ height: '44px', display: 'flex' }}>
        <ContentHashes>
          <ContentHash>#Classical</ContentHash>
          <ContentHash>#Art</ContentHash>
          <ContentHash>#Statue</ContentHash>
          <ContentHash>#Atlas</ContentHash>
          <ContentHash>#Painting</ContentHash>
        </ContentHashes>
        <div style={{ width: '50%', display: 'flex', justifyContent: 'flex-end', color: '#888' }}>
          <div style={{ alignSelf: 'flex-start', alignItems: 'center', paddingRight: '12px', display: 'flex' }}>
            <div style={{ fontSize: '11px' }}>
              23
            </div>
            &nbsp;
            <FontAwesomeIcon icon={faCoins} size="xs"/>
          </div>
        </div>
      </div>
      <ContentDate>
        <FontAwesomeIcon icon={faCamera} size="sm"/>
        &nbsp;
        January 20, 2019
      </ContentDate>
    </ContentBox>

    <ContentBox>
      <HoverableContent text="these are my statues"/>
      <div style={{ height: '44px', display: 'flex' }}>
        <ContentHashes>
          <ContentHash>#Classical</ContentHash>
          <ContentHash>#Art</ContentHash>
          <ContentHash>#Statue</ContentHash>
          <ContentHash>#Atlas</ContentHash>
          <ContentHash>#Painting</ContentHash>
        </ContentHashes>
        <div style={{ width: '50%', display: 'flex', justifyContent: 'flex-end', color: '#888' }}>
          <div style={{ alignSelf: 'flex-start', alignItems: 'center', paddingRight: '12px', display: 'flex' }}>
            <div style={{ fontSize: '11px' }}>
              23
            </div>
            &nbsp;
            <FontAwesomeIcon icon={faCoins} size="xs"/>
          </div>
        </div>
      </div>
      <ContentDate>
        <FontAwesomeIcon icon={faCamera} size="sm"/>
        &nbsp;
        January 20, 2019
      </ContentDate>
    </ContentBox>

    <ContentBox>
      <HoverableContent text="these are my statues"/>
      <div style={{ height: '44px', display: 'flex' }}>
        <ContentHashes>
          <ContentHash>#Classical</ContentHash>
          <ContentHash>#Art</ContentHash>
          <ContentHash>#Statue</ContentHash>
          <ContentHash>#Atlas</ContentHash>
          <ContentHash>#Painting</ContentHash>
        </ContentHashes>
        <div style={{ width: '50%', display: 'flex', justifyContent: 'flex-end', color: '#888' }}>
          <div style={{ alignSelf: 'flex-start', alignItems: 'center', paddingRight: '12px', display: 'flex' }}>
            <div style={{ fontSize: '11px' }}>
              23
            </div>
            &nbsp;
            <FontAwesomeIcon icon={faCoins} size="xs"/>
          </div>
        </div>
      </div>
      <ContentDate>
        <FontAwesomeIcon icon={faCamera} size="sm"/>
        &nbsp;
        January 20, 2019
      </ContentDate>
    </ContentBox>

  </div>
);

class TradeScreen extends Component {
  state = {
    active: 0,
  }

  setActive = (evt) => {
    const id = evt.target.id;
    this.setState({
      active: parseInt(id),
    });
  }

  render() {
    const { active } = this.state;
    return (
      <div style={{ height: '90%' }}>
        <div style={{ width: '100%', height: '8%', display: 'flex', flexDirection: 'row' }}>
          <TradeScreenTab
            active={this.state.active === 0}
            id={0}
            onClick={this.setActive}
          >
            <FontAwesomeIcon icon={faDollarSign} size="md"/>
          </TradeScreenTab>
          <TradeScreenTab
            active={this.state.active === 1} 
            id ={1}
            onClick={this.setActive}
          >
            <FontAwesomeIcon icon={faMoneyBill} size="md"/>
          </TradeScreenTab>
          <TradeScreenTab
            active={this.state.active === 2} 
            id ={2}
            onClick={this.setActive}
          >
            <FontAwesomeIcon icon={faCoins} size="md"/>
          </TradeScreenTab>
          <TradeScreenTab
            active={this.state.active === 3} 
            id ={3}
            onClick={this.setActive}
          >
            <FontAwesomeIcon icon={faUserFriends} size="md"/>
          </TradeScreenTab>
          <TradeScreenTab
            active={this.state.active === 4} 
            id ={4}
            onClick={this.setActive}
          >
            <FontAwesomeIcon icon={faChartLine} size="md"/>
          </TradeScreenTab>
        </div>
        <TradeScreenContent>
          {
            (
              active === 0
              &&
              <InnerDisplay
                title="Price"
                info="$404.69 USD"
              />
            ) ||
            (
              active === 1
              &&
              <InnerDisplay title="Market Cap" info="$23.02 USD"/>
            ) ||
            (
              active === 2
              &&
              <InnerDisplay
                title="Supply"
                info="1,000,576 LGN"
              />
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

const InvestScreen = (props) => (
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

const ExitScreen = (props) => (
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

class InvestPage extends Component {
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

    return (
      <div>
        <InvestBox>
          {
            (investing && <InvestScreen quit={this.quit}/>)
            ||
            (exiting && <ExitScreen quit={this.quit}/>)
            ||
            <TradeScreen/>
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

const AboutPage = (props) => (
 <AboutContainer>

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

const ProfilePage = withRouter((props) => (
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
            <ListLink to="/profile/about">about</ListLink>
          </ListItem>
          {/* <ListItem>
            <FontAwesomeIcon icon={faRss} size="sm"/>
            &nbsp;&nbsp;
            <ListLink to="/profile/feed">feed</ListLink>
          </ListItem> */}
          <ListItem>
            <FontAwesomeIcon icon={faHandHoldingUsd} size="sm"/>
            &nbsp;&nbsp;
            <ListLink to="/profile/invest">invest</ListLink>
          </ListItem>
          <ListItem>
            <FontAwesomeIcon icon={faHandshake} size="sm"/>
            &nbsp;&nbsp;
            <ListLink to="/profile/transact">transact</ListLink>
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
      <Route path='/profile/about' component={AboutPage}/>
      {/* <Route path='/profile/feed' component={ContentPage}/> */}
      <Route path='/profile/invest' component={InvestPage}/>
      <Route path='/profile/transact' component={TransactPage}/>
      {props.children}
    </Middle>
  </ProfileContainer>
));

const DashboardPage = () => (
  <DashboardContainer>
    <DashboardLeft/>
    <DashboardMiddle>
      <PolaroidCard>
        <Subject/>
        <CreativeInput/>
      </PolaroidCard>
    </DashboardMiddle>
    <DashboardRight/>
  </DashboardContainer>
)

const App = inject('web3Store')(observer(
class App extends Component {

  state = {
    sideNav: false,
  }

  closeNav = () => {
    this.setState({
      sideNav: false,
    })
  }

  render() {
    const { sideNav } = this.state;
    console.log(this.props)
    return (
      <Wrapper>
      
        <div style={{ height: '100%', width: sideNav ? '250px':'25px', overflowX: 'hidden', zIndex: '1', position: 'fixed', top: '0', left: '0', background: 'rgba(0,0,0,0.5)', paddingTop: '60px' }}>
          {
            !sideNav 
            && <SideNavOpen onClick={() => this.setState({ sideNav: true })} style={{
              position: 'absolute', top: '0', display: 'block'
            }}>
              <FontAwesomeIcon icon={faArrowRight} size="sm"/>
            </SideNavOpen>
          }
          <SideNavClose href="javascript:void(0)" onClick={this.closeNav}>
            <FontAwesomeIcon icon={faArrowLeft} size="sm"/>
          </SideNavClose>
          <SideNavLink onClick={this.closeNav} to="/">Home</SideNavLink>
          <SideNavLink onClick={this.closeNav} to="/dashboard">Dashboard</SideNavLink>
          <SideNavLink onClick={this.closeNav} to="/profile">Explore</SideNavLink>
          <SideNavLink onClick={this.closeNav} to="/faq">FAQ</SideNavLink>
        </div>

        <HoveringBlockie src={this.props.web3Store.account ? makeBlockie(this.props.web3Store.account) : Logan} alt='logan' onClick={() => this.props.web3Store.turnOnWeb3()}/>

        <Route exact path='/' component={Home}/>
        <Route path='/dashboard' component={DashboardPage}/>
        <Route path='/profile' component={ProfilePage}/>
        <Route path='/faq' component={FAQ}/>

      </Wrapper>
    );
  }
}));

export default withRouter(App);
