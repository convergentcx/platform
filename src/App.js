import React, { Component } from 'react';
import { Link, Route, withRouter } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { observer, inject } from 'mobx-react';
import makeBlockie from 'ethereum-blockies-base64';

import Tooltip from 'rc-tooltip';

/// Assets
import Logan from './assets/pics/Logan-Saether.jpg';
import Lock from './assets/pics/lock.png';
import Reptile from './assets/pics/contemplative-reptile.jpg';

/// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCamera, 
  faArrowRight, 
  faArrowLeft, 
  faCoins,
  faBong,
  faFastForward,
  faHome,
  faUserLock,
  faGlobeEurope,
  faDatabase,
  faDesktop,
  faIndustry,
  faUsersCog,
  faRocket,
  faQuestion,
} from '@fortawesome/free-solid-svg-icons';

import { faEthereum } from '@fortawesome/free-brands-svg-icons';
/// Components
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import List from './components/List';
import FAQ from './components/FAQ';
import Profile from './components/Profile';

/// Styled-Components
// Pallette
// const colors = {
//   White: '#FFF',
//   Black: '#000',
//   CvgBlue: '#2424D0',
//   CvgPurp: '#411999',
//   darkPurp: '#05021A',
//   bgGrey: '#E9EDF2',
// };

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
const Wrapper = styled.div`
  margin: 0;
  padding: 0;
  font-size: 1.25rem;
  font-weight: 500;
  background: #f3f3f3;
  min-height: 100vh;
`;

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
  bottom: 2%;
  right: 2%;
  border-radius: 50px;
  ${shadowMixin}
`;

const SpeedDialAnchor = observer(styled.div`
  cursor: pointer;
  position: fixed;
  width: 56px;
  height: 56px;
  bottom: 4%;
  right: 2%;
  border-radius: 28px;
  ${shadowMixin}
  background: ${props => props.open ? '#232323' : '#000'};
  color: ${props => props.locked ? (props.readonly ? 'orange' : 'red') : 'green'};
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.3s;
  font-size: 24px;
  font-weight: 900;
  :hover {
    color: ;
    background: #232323;
  }
`);

const SpeedDialButton = styled.div`
  cursor: pointer;
  position: fixed;
  width: 48px;
  height: 48px;
  bottom: calc(${props => props.offset * 52}px + 36px + 8%);
  right: calc(2% + 4px);
  border-radius: 24px;
  ${shadowMixin}
  background: #0044DD;
  color: #FFF;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.3s;
  :hover {
    background: #2424D0;
    color: #AAA;
  }
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
};

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

// class SpeedDial extends React.Component {
//   state = {
//     open: false,
//   }

//   render() {
//     return (
//       <>
//         <SpeedDialAnchor open={this.state.open} onClick={() => this.setState({open: !this.state.open})}>
//           <FontAwesomeIcon icon={faBong}/>
//         </SpeedDialAnchor>
//         {this.state.open &&
//           <>
//             <SpeedDialButton offset={10}>
//               <FontAwesomeIcon icon={faFastForward}/>
//             </SpeedDialButton>
//           </>
//         }
//       </>
//     )
//   }
// }

// const LockedSpeedDial = observer(class LockedSpeedDial extends React.Component {
//   state = {
//     hovering: 0,
//     open: false,
//   }

//   render() {
//     return (
//       <>
//         <SpeedDialAnchor locked={true} readonly={this.props.web3Store.readonly} open={this.state.open} onClick={() => this.setState({open: !this.state.open})}>
//           <FontAwesomeIcon icon={faEthereum}/>
//         </SpeedDialAnchor>
//         {this.state.open &&
//           <>
//               <SpeedDialButton 
//                 offset={0}
//                 onClick={() => this.props.web3Store.turnOnWeb3()}
//               >
//                 <FontAwesomeIcon icon={faUserLock}/>
//               </SpeedDialButton>
//           </>
//         }
//       </>
//     )
//   }
// });

const SpeedDial = withRouter(observer(class SpeedDial extends React.Component {
  state = {
    hovering: 0,
    open: false,
  }

  render() {
    const { history } = this.props;
    const locked = !this.props.web3Store.account;
    // console.log(locked)

    return (
      <>
        <SpeedDialAnchor locked={locked} readonly ={this.props.web3Store.readonly} open={this.state.open} onClick={() => this.setState({open: !this.state.open})}>
          <FontAwesomeIcon icon={faEthereum}/>
        </SpeedDialAnchor>
        {this.state.open &&
          <>
              <SpeedDialButton 
                offset={0}
                onClick={() => history.push('/list')}
              >
                <FontAwesomeIcon icon={faGlobeEurope}/>
              </SpeedDialButton>
              <SpeedDialButton 
                offset={1}
                onClick={() => history.push('/dashboard')}
              >
                <FontAwesomeIcon icon={faUsersCog}/>
              </SpeedDialButton>
              <SpeedDialButton 
                offset={2}
                onClick={() => history.push('/')}
              >
                <FontAwesomeIcon icon={faRocket}/>
              </SpeedDialButton>
              <SpeedDialButton 
                offset={3}
                onClick={() => history.push('/faq')}
              >
                <FontAwesomeIcon icon={faQuestion}/>
              </SpeedDialButton>
              {
                locked && 
                <SpeedDialButton 
                  offset={4}
                  onClick={() => this.props.web3Store.turnOnWeb3()}
                >
                  <FontAwesomeIcon icon={faUserLock}/>
                </SpeedDialButton>
              }
          </>
        }
      </>
    )
  }
}));

const App = inject('web3Store', 'ipfsStore')(observer(
class App extends Component {

  // state = {
  //   sideNav: false,
  // }

  // closeNav = () => {
  //   this.setState({
  //     sideNav: false,
  //   })
  // }

  componentDidMount = () => {
    this.props.web3Store.initIPFS();
    this.props.web3Store.initReadonly();
  }

  render() {
    // const { sideNav } = this.state;
    // console.log(this.props)
    return (
      <Wrapper>
      
        {/* <div style={{ height: '100%', width: sideNav ? '250px':'25px', overflowX: 'hidden', zIndex: '1', position: 'fixed', top: '0', left: '0', background: 'rgba(0,0,0,0.5)', paddingTop: '60px' }}>
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
          <SideNavLink onClick={this.closeNav} to="/list">List</SideNavLink>
          <SideNavLink onClick={this.closeNav} to="/profile">Explore</SideNavLink>
          <SideNavLink onClick={this.closeNav} to="/faq">FAQ</SideNavLink>
        </div> */}

        {/* <HoveringBlockie src={this.props.web3Store.account ? makeBlockie(this.props.web3Store.account) : Lock} alt='unlock' onClick={() => this.props.web3Store.turnOnWeb3()}/> */}

        <SpeedDial web3Store={this.props.web3Store}/>

        <Route exact path='/' render={props => <Home {...props} web3Store={this.props.web3Store}/>}/>
        <Route path='/dashboard' render={props => <Dashboard {...props} web3Store={this.props.web3Store}/>}/>
        <Route path='/list' render={props => <List {...props} web3Store={this.props.web3Store}/>}/>
        <Route path='/profile/:address' render={props => <Profile {...props} web3Store={this.props.web3Store}/>}/>
        <Route path='/faq' component={FAQ}/>

      </Wrapper>
    );
  }
}));

export default withRouter(App);
