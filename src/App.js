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
  faCamera, 
  faArrowRight, 
  faArrowLeft, 
  faCoins, 
} from '@fortawesome/free-solid-svg-icons';

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
    // console.log(this.props)
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
          <SideNavLink onClick={this.closeNav} to="/list">List</SideNavLink>
          <SideNavLink onClick={this.closeNav} to="/profile">Explore</SideNavLink>
          <SideNavLink onClick={this.closeNav} to="/faq">FAQ</SideNavLink>
        </div>

        <HoveringBlockie src={this.props.web3Store.account ? makeBlockie(this.props.web3Store.account) : Logan} alt='logan' onClick={() => this.props.web3Store.turnOnWeb3()}/>

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
