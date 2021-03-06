import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { observer, inject } from 'mobx-react';
import { withToastManager } from 'react-toast-notifications';
import Floater from 'react-floater';

/// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  // faCamera, 
  faCog,
  // faCoins,
  faUserLock,
  faGlobeEurope,
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

import { colors, shadowMixin } from './common';

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
// const shadowMixin = 'box-shadow: 0 15px 35px rgba(50,50,93,.1), 0 5px 15px rgba(0,0,0,.07);'

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
  background: #000;
  min-height: 100vh;
`;

// const ContentBox = styled.div`
//   background: #FFF;
//   border-radius: 10px;
//   width: 50vw;
//   height: 500px;
//   margin-top: 50px;
//   margin-left: 0;
// `;

// const ContentDate = styled.div`
//   font-size: 11px;
//   color: #999;
//   padding-right: 12px;
//   padding-bottom: 4px;
//   display: flex;
//   justify-content: flex-end;
//   align-items: center;
// `;

// const ContentHashes = styled.div`
//   font-size: 11px;
//   color: #999;
//   padding-left: 8px;
//   width: 50%;
//   text-align: left;
//   height: 100%;
//   margin-top: 0;
//   display: flex;
//   flex-flow: row wrap;
// `;

// const ContentHash = styled.a`
//   transition: 0.3s;
//   margin-left: 12px;
//   cursor: pointer;
//   :hover {
//     color: #555;
//   }
// `;

// const SideNavLink = styled(Link)`
//   padding: 8px 8px 8px 32px;
//   text-decoration: none;
//   font-size: 25px;
//   color: #AAA;
//   display: block;
//   transition: 0.3s;
//   :hover {
//     color: #000;
//   }
// `;

// const SideNavClose = styled.a`
//   position: absolute;
//   top: 0;
//   right: 25px;
//   margin-left: 50px;
//   text-decoration: none;
//   color: #AAA;
//   display: block;
//   transition: 0.3s;
//   :hover {
//     color: #000;
//   }
// `;

// const SideNavOpen = styled.a`
//   position: absolute;
//   top: 0;
//   right: 0;
//   text-decoration: none;
//   color: #AAA;
//   display: flex;
//   background: white;
//   width: 25px;
//   text-align: center;
//   transition: 0.3s;
//   :hover {
//     color: #000;
//   }
// `;

// const ContentImage = styled.img`
//   width: calc(100% - 16px);
//   height: 420px;
//   padding-top: 8px;
//   border-radius: 16px 16px 0 0;
// `;

// const HoveringBlockie = styled.img`
//   position: fixed;
//   width: 64px;
//   height: 64px;
//   bottom: 2%;
//   right: 2%;
//   border-radius: 50px;
//   ${shadowMixin}
// `;

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
  color: ${props => props.locked ? (props.readonly ? colors.OrangeDark : 'red') : colors.SoftGreenDark};
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.3s;
  font-size: 24px;
  font-weight: 900;
  z-index: 10;
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
  background: ${props => props.alt ? '#de9360' : colors.SoftBlue};
  color: #FFF;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.3s;
  :hover {
    background: ${props => props.alt ? colors.OrangeDark : colors.CvgTeal};
    color: #FFF;
  }
`;

const SpeedFloater = styled.div`
  height: 50px;
  width: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
  background: #FFF;
  border-radius: 5px;
`;

// class HoverableContent extends Component {
//   state = {
//     hovering: false,
//   }

//   render() {
//     return (
//       <div 
//         onMouseEnter={() => this.setState({ hovering: true })} 
//         onMouseLeave={() => this.setState({ hovering: false })}
//         style={{ background: '', height: '436px' }}
//       >
//         <ContentImage src={Reptile} alt="ronja"/>
//         {
//           this.state.hovering &&
//           <div style={{ background: 'rgba(0,0,0,0.6)', position: 'relative', top: '-425px', height: '420px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#FFF', margin: '0 8px 8px 8px', padding: '0', transition: '0.5s', borderRadius: '12px 12px 0 0' }}>
//             {(this.props.text && this.props.text.toLowerCase()) || 'no input text with this image'}
//           </div>
//         }
//       </div>
//     );
//   }
// };

// const ContentPage = () => (
//   <div style={{ paddingBottom: '50px' }}>
//     <ContentBox>
//       <HoverableContent text="these are my statues"/>
//       <div style={{ height: '44px', display: 'flex' }}>
//         <ContentHashes>
//           <ContentHash>#Classical</ContentHash>
//           <ContentHash>#Art</ContentHash>
//           <ContentHash>#Statue</ContentHash>
//           <ContentHash>#Atlas</ContentHash>
//           <ContentHash>#Painting</ContentHash>
//         </ContentHashes>
//         <div style={{ width: '50%', display: 'flex', justifyContent: 'flex-end', color: '#888' }}>
//           <div style={{ alignSelf: 'flex-start', alignItems: 'center', paddingRight: '12px', display: 'flex' }}>
//             <div style={{ fontSize: '11px' }}>
//               23
//             </div>
//             &nbsp;
//             <FontAwesomeIcon icon={faCoins} size="xs"/>
//           </div>
//         </div>
//       </div>
//       <ContentDate>
//         <FontAwesomeIcon icon={faCamera} size="sm"/>
//         &nbsp;
//         January 20, 2019
//       </ContentDate>
//     </ContentBox>

//     <ContentBox>
//       <HoverableContent text="these are my statues"/>
//       <div style={{ height: '44px', display: 'flex' }}>
//         <ContentHashes>
//           <ContentHash>#Classical</ContentHash>
//           <ContentHash>#Art</ContentHash>
//           <ContentHash>#Statue</ContentHash>
//           <ContentHash>#Atlas</ContentHash>
//           <ContentHash>#Painting</ContentHash>
//         </ContentHashes>
//         <div style={{ width: '50%', display: 'flex', justifyContent: 'flex-end', color: '#888' }}>
//           <div style={{ alignSelf: 'flex-start', alignItems: 'center', paddingRight: '12px', display: 'flex' }}>
//             <div style={{ fontSize: '11px' }}>
//               23
//             </div>
//             &nbsp;
//             <FontAwesomeIcon icon={faCoins} size="xs"/>
//           </div>
//         </div>
//       </div>
//       <ContentDate>
//         <FontAwesomeIcon icon={faCamera} size="sm"/>
//         &nbsp;
//         January 20, 2019
//       </ContentDate>
//     </ContentBox>

//     <ContentBox>
//       <HoverableContent text="these are my statues"/>
//       <div style={{ height: '44px', display: 'flex' }}>
//         <ContentHashes>
//           <ContentHash>#Classical</ContentHash>
//           <ContentHash>#Art</ContentHash>
//           <ContentHash>#Statue</ContentHash>
//           <ContentHash>#Atlas</ContentHash>
//           <ContentHash>#Painting</ContentHash>
//         </ContentHashes>
//         <div style={{ width: '50%', display: 'flex', justifyContent: 'flex-end', color: '#888' }}>
//           <div style={{ alignSelf: 'flex-start', alignItems: 'center', paddingRight: '12px', display: 'flex' }}>
//             <div style={{ fontSize: '11px' }}>
//               23
//             </div>
//             &nbsp;
//             <FontAwesomeIcon icon={faCoins} size="xs"/>
//           </div>
//         </div>
//       </div>
//       <ContentDate>
//         <FontAwesomeIcon icon={faCamera} size="sm"/>
//         &nbsp;
//         January 20, 2019
//       </ContentDate>
//     </ContentBox>

//   </div>
// );

const SpeedDial = withRouter(observer(class SpeedDial extends React.Component {
  state = {
    hovering: 0,
    open: false,
  }

  click = (destination) => {
    this.setState({
      open: false,
    });
    this.props.history.push(destination);
  }

  render() {
    const locked = !this.props.web3Store.account;

    return (
      <>
        <SpeedDialAnchor locked={locked} readonly ={this.props.web3Store.readonly} open={this.state.open} onClick={() => this.setState({open: !this.state.open})}>
          <FontAwesomeIcon icon={faEthereum}/>
        </SpeedDialAnchor>
        {this.state.open &&
          <>
              <Floater component={<SpeedFloater>explore</SpeedFloater>} placement="left" event="hover" eventDelay={0}>
                <SpeedDialButton 
                  offset={0}
                  onClick={() => this.click('/list')}
                >
                  <FontAwesomeIcon icon={faGlobeEurope}/>
                </SpeedDialButton>
              </Floater>
              <Floater component={<SpeedFloater>dashboard</SpeedFloater>} placement="left" event="hover" eventDelay={0}>
                <SpeedDialButton 
                  offset={1}
                  onClick={() => this.click('/dashboard')}
                >
                  <FontAwesomeIcon icon={faCog}/>
                </SpeedDialButton>
              </Floater>
              <Floater component={<SpeedFloater>launch</SpeedFloater>} placement="left" event="hover" eventDelay={0}>
                <SpeedDialButton 
                  offset={2}
                  onClick={() => this.click('/')}
                >
                  <FontAwesomeIcon icon={faRocket}/>
                </SpeedDialButton>
              </Floater>
              <Floater component={<SpeedFloater>faq</SpeedFloater>} placement="left" event="hover" eventDelay={0}>
                <SpeedDialButton 
                  offset={3}
                  onClick={() => this.click('/faq')}
                >
                  <FontAwesomeIcon icon={faQuestion}/>
                </SpeedDialButton>
              </Floater>
              {
                locked && 
                <Floater component={<SpeedFloater>log in</SpeedFloater>} placement="top" event="hover" eventDelay={0}>
                  <SpeedDialButton 
                    alt="true"
                    offset={4}
                    onClick={() => {
                      this.setState({ open: false });
                      this.props.web3Store.turnOnWeb3();
                    }}
                  >
                    <FontAwesomeIcon icon={faUserLock}/>
                  </SpeedDialButton>
                </Floater>
              }
          </>
        }
      </>
    )
  }
}));

const App = inject('web3Store', 'ipfsStore')(observer(
class App extends Component {

  componentDidMount = () => {
    this.props.web3Store.initToastMgmt(this.props.toastManager);
    this.props.web3Store.initIPFS();
    this.props.web3Store.initReadonly();
  }

  render() {
    return (
      <Wrapper>
        <SpeedDial web3Store={this.props.web3Store} toastManager={this.props.toastManager}/>

        <Route exact path='/' render={props => <Home {...props} web3Store={this.props.web3Store}/>}/>
        <Route path='/dashboard' render={props => <Dashboard {...props} web3Store={this.props.web3Store}/>}/>
        <Route path='/list' render={props => <List {...props} web3Store={this.props.web3Store}/>}/>
        <Route path='/profile/:address' render={props => <Profile {...props} web3Store={this.props.web3Store}/>}/>
        <Route path='/faq' component={FAQ}/>
      </Wrapper>
    );
  }
}));

export default withToastManager(withRouter(App));
