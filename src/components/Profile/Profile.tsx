import React from 'react';
import { Link, Route, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faHandHoldingUsd,
  faHandshake, 
  faMapMarkerAlt, 
  faInfoCircle, 
} from '@fortawesome/free-solid-svg-icons';

import { colors, shadowMixin } from '../../common';
import { observer } from 'mobx-react';
import makeBlockie from 'ethereum-blockies-base64';

import AboutSection from './Sections/About';
import InvestSection from './Sections/Invest';
import Transact from './Sections/Transact';

const NavBox = styled.div`
  width: 12em;
  background-color: #FFF;
  position: sticky;
  margin-top: 16%;
  top: 16%;
  border-radius: 10px;
  margin-left: auto;
  margin-right: auto;
  ${shadowMixin}
  @media (max-width: 450px) {
    width: 12em;
    margin-top: 8%;
    top: 8%;
  }
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
    color: ${colors.SoftBlue};
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
`

const Left = styled.div`
  width: calc(40%);
  @media (max-width: 450px) {
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
    margin-left: 0;
    justify-content: center;
    align-items: center;
  }
`;

const RequestButton = styled.button`
  height: 32px;
  cursor: pointer;
  width: 100%;
  background: ${colors.SoftBlue};
  color: #FFF;
  border: none;
  border-radius: 0 0 10px 10px;
  transition: 0.3s;
  :hover {
    color: #FFF;
    background: ${colors.CvgPurp};
  }
`;

const TransactContainer = styled.div`
  width: 50vw;
  margin-top: 5vh;
  height: 90vh;
  @media (max-width: 450px) {
    width: 94vw;
    margin-bottom: 8%;
  }
`;
const TransactPage = observer(class TransactPage extends React.Component<any,any> {
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
    let title,description,price;
    if (betaCache.has(address) && ipfsCache.has(betaCache.get(address).metadata)) {
      const { metadata } = betaCache.get(address);
      const { services } = ipfsCache.get(metadata);
      title = services[0].title;
      description = services[0].description;
      price = services[0].price;
    }

    return (
      <TransactContainer>
        <div style={{ display: 'flex', width: '100%' }}>
          <div style={{ fontSize: '64px', width: '60%', textAlign: 'left'}}>
            {title}
          </div>
          <div style={{ fontSize: '128px', alignSelf: 'center', justifySelf: 'center', width: '50%' }}>
            {price}
          </div>
        </div>
        <div style={{ fontSize: '16px', textAlign: 'left' }}>
          {description}
        </div>
        <br/>
        <input 
          style={{ border: 'solid', borderColor: 'black', color: 'black', borderWidth: '1px', background: 'white', width: '80%'}}
          name="msg"
          onChange={(e) => this.setState({ [e.target.name]: e.target.value })}
        />
        <br/>
        <br/>
        <RequestButton
          onClick={this.request}
        >
          Request
        </RequestButton>
        <hr/>
        {/* Two
        <hr/>
        Three
        <hr/> */}
      </TransactContainer>
    )
  }
});

const ProfilePage = withRouter(observer(class ProfilePage extends React.Component<any,any> {
  componentDidMount = async () => {
    const { web3Store, match: { params: { address } } } = this.props;
    
    // Fills data for this profile
    await web3Store.getAccountDataAndCache(address);
  }
  
  render() {
    const { web3Store, match: { params: { address } } } = this.props;
    // if (web3Store.betaCache.has(address) && web3Store.ipfsCache.has(web3Store.betaCache.get(address).metadata)) {
      // console.log(Buffer.from(web3Store.ipfsCache.get(web3Store.betaCache.get(address).metadata).pic.data).toString('base64'));
    // }

    const blockie = makeBlockie(address);

    return (
      <ProfileContainer>
        <Left>
          <NavBox>
            {
              web3Store.betaCache.has(address) && web3Store.ipfsCache.has(web3Store.betaCache.get(address).metadata)
              ?
                <img
                  src={
                    `data:image/jpeg;base64,${Buffer.from(web3Store.ipfsCache.get(web3Store.betaCache.get(address).metadata).pic.data).toString('base64')}` || blockie
                  } style={{ width: '100%', height: '12em', borderRadius: '10px 10px 0 0' }}/>
              :
                <img src={blockie} alt="noneya" style={{ width: '100%', height: '12em', borderRadius: '10px 10px 0 0' }}/>
            }
            <NavName>{web3Store.betaCache.get(address) ? web3Store.betaCache.get(address).name + ` (${web3Store.betaCache.get(address).symbol}) ` : '???'}</NavName>
            <div style={{ fontSize: '10px', paddingLeft: '24px', marginTop: '-12px' }}>
              <FontAwesomeIcon icon={faMapMarkerAlt} size="sm"/>
              &nbsp;
              {
                web3Store.betaCache.has(address) && web3Store.ipfsCache.get(web3Store.betaCache.get(address).metadata)
                ?
                  web3Store.ipfsCache.get(web3Store.betaCache.get(address).metadata).location || 'No location'
                :
                  'No location'
              }
            </div>
            <NavList>
              <ListItem>
                <FontAwesomeIcon icon={faInfoCircle} size="sm"/>
                &nbsp;&nbsp;
                <ListLink to={`/profile/${address}/about`}>about</ListLink>
              </ListItem>
              {/* <ListItem>
                <FontAwesomeIcon icon={faRss} size="sm"/>
                &nbsp;&nbsp;
                <ListLink to="/profile/feed">feed</ListLink>
              </ListItem> */}
              <ListItem>
                <FontAwesomeIcon icon={faHandHoldingUsd} size="sm"/>
                &nbsp;&nbsp;
                <ListLink to={`/profile/${address}/invest`}>invest</ListLink>
              </ListItem>
              <ListItem>
                <FontAwesomeIcon icon={faHandshake} size="sm"/>
                &nbsp;&nbsp;
                <ListLink to={`/profile/${address}/transact`}>transact</ListLink>
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
          <Route path={`/profile/${address}/about`} render={() => <AboutSection address={address} web3Store={web3Store}/>}/>
          {/* <Route path='/profile/feed' component={ContentPage}/> */}
          <Route path={`/profile/${address}/invest`} render={() => <InvestSection address={address} web3Store={web3Store}/>}/>
          <Route path={`/profile/${address}/transact`} render={() => <TransactPage address={address} web3Store={web3Store}/>}/>
          {this.props.children}
        </Middle>
      </ProfileContainer>
    )
  }
}));

export default ProfilePage;
