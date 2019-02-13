import dataUriToBuffer from 'data-uri-to-buffer';
import makeBlockie from 'ethereum-blockies-base64';
import { observer, inject } from 'mobx-react';
import React from 'react';
import { Link, Route, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import Inbox from './Inbox/Inbox';
import Subject from '../Dropzone.jsx';
import Wallet from './Wallet/Wallet';

import { colors } from '../../common';
import { RingLoader } from 'react-spinners';

const DashboardContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: ${colors.CvgTeal};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const YourAccounts = observer(styled.div`
  max-width: 80%;
  display: flex;
  flex-direction: column;
`);

const AccountLink = styled(Link)`
  display: flex;
  width: 100%;
  text-decoration: none;
  align-items: center;
  margin-bottom: 8px;
  transition: 0.2s;
  :hover {
    color: #A3A3A3;
  }
`;

const DashboardLeft = styled.div`
  width: 20%;
  height: 100vh;
  background: ;
`;

const DashboardLink = styled.div<any>`
  cursor: pointer;
  display: flex;
  width: 100%;
  text-decoration: none;
  color: ${(props: any) => props.active ? '#FFF' : '#000'};
  justify-content: center;
  align-items: center;
  height: 20%;
  transition: 0.2s;
  background: ${(props: any) => props.active ? '#000' : 'transparent'};
  :hover {
    background: ;
    color: #FFF;
  }
`;

const DashboardMiddle = styled.div`
  width: 60%;
  height: 100vh;
  background: ;
  align-items: center;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  justify-content: center;
`;

const DisplayContainer = styled.div<any>`
  width: 80%;
  min-height: ${(props: any) => props.halfsize ? '15%' : '30%'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-flow: row wrap;
`;

const InputDisplay = styled.div`
  width: 65%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const BioInput = styled.textarea`
  width: 100%;
  background: #E9EDF2;
  height: 60%;
  color: #000;
  display: flex;
  align-items: flex-start;
`;

const LocationInput = styled.input`
  width: 100%;
  background: #E9EDF2;
  height: 10%;
  display: flex;
  color: #000;
`;

const ServiceBox = styled.div`
  display: flex;

`;

const ServiceInputTitle = styled.input`
  display: flex;
  width: 30%;
`;

const ServiceInputDescription = styled.input`
  display: flex;
  width: 55%;
`;

const ServiceInputPrice = styled.input`
  display: flex;
  width: 5%;
`;

const CommitButton = styled.button`
  display: flex;
  cursor: pointer;
  width: 90%;
  border: solid;
  justify-content: center;
  align-items: center;
  height: 32px;
  font-size: 16px;
  transition: 0.3s;
  border-radius: 32px;
  border-color: #202020;
  margin-top: 16px;
  font-weight: 900;
`;

const DisplayHeading = styled.h4`
  margin-bottom: 8px;
  width: 100%;
`;

// const AddButton = styled.button`
//   display: flex;
//   width: 32px;
//   height: 32px;
//   border-radius: 16px;
//   justify-content: center;
//   align-items: center;
//   font-weight: 900;
// `;

const AddServiceButton = styled.button`
  display: flex;
  width: 64px;
  height: 32px;
  border-radius: 16px;
  justify-content: center;
  align-items: center;
  font-weight: 900;
`;

// const TagContainer = styled.div`
//   display: flex;
//   width: 100%;
//   flex-flow: row wrap;
// `;

// const Tag =styled.button`
//   display: flex;
//   width: 96px;
//   height: 32px;
//   font-size: 10px;
//   border-radius: 16px;
//   justify-content: center;
//   align-items: center;
//   margin-right: 8px;
// `;

// const PolaroidCard = styled.div`
//   width: 400px;
//   height: 500px;
//   background: #444488;
//   display: flex;
//   align-items: center;
//   flex-direction: column;
// `;

// const CreativeInput = styled.input`
//   width: 80%;
//   color: #FFF;
//   height: 30px;
//   margin-top: 8px;
// `;

const DashboardRight = styled.div`
  width: 20%;
  height: 100vh;
  background: ;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-flow: row wrap;
`;

const DashboardRightBox = styled.div`
  width: 100%;
  height: 160px;
  display: flex;
  flex-flow: row wrap;
  padding: 16px;
  background: #CCC;
  margin: 8px;
`;

// const UpgradeButton = styled.button`
//   border: solid;
//   border-color: black;
//   background: transparent;
//   height: 80px;
//   width: 120px;
//   cursor: pointer;
//   transition: 0.2s;
//   :hover {
//     background: black;
//     color: white;
//   }
// `;

const WidthdrawButton = styled.button`
  background: #232323;
  border: none;
  cursor: pointer;
  transition: 0.3s;
  width: 100%;
  :hover {
    background: #696969
  }
`;

const Profile = inject('ipfsStore', 'web3Store')(observer(class Profile extends React.Component<any,any> {
  state = {
    downloading: true,
    bio: '',
    location: '',
    serviceTitle1: '',
    serviceDescription1: '',
    servicePrice1: '',
    preview: null,
    uploading: false,
    file: '',
    serviceEdit: false,
  }

  componentDidMount = async () => {
    this.getData();
  }

  getData = async () => {
    const { web3Store, address } = this.props;

    if (!web3Store.betaCache.has(address)) {
      setTimeout(() => this.getData(), 4000);
      return;
    }

    this.setState({ downloading: true, });
    await this.props.web3Store.ipfsGetDataAndCache(
      this.props.web3Store.betaCache.get(
        address,
      ).metadata,
    );

    let bio,location,pic,services;
    if (web3Store.betaCache.has(address) && web3Store.ipfsCache.has(web3Store.betaCache.get(address).metadata)) {
      const data = web3Store.ipfsCache.get(web3Store.betaCache.get(address).metadata);
      console.log(data.bio)
      bio = data.bio || '';
      location = data.location || '';
      pic = data.pic || '';
      services = data.services || [];
    }

    let preview = '';
    if (pic) {
      preview = `data:image/jpeg;base64,${Buffer.from(pic.data).toString('base64')}`;
    }

    this.setState({ 
      downloading: false, 
      file: pic.data,
      bio,
      location,
      serviceTitle1: services[0].title,
      serviceDescription1: services[0].description,
      servicePrice1: services[0].price,
      preview,
    });
  }

  commit = async () => {
    const { address, ipfsStore, web3Store } = this.props;

    if (!web3Store.account) {
      alert('Log in first! lol');
      // Reroute somewhere else
      return;
    }

    let imgBuf;
    if (this.state.file) {
      try {
        imgBuf = dataUriToBuffer(this.state.file)
      } catch (e) { console.error(e); }
    } 

    this.setState({ uploading: true });

    const data = {
      bio: this.state.bio,
      location: this.state.location,
      pic: imgBuf,
      services: [
        {
          title: this.state.serviceTitle1,
          description: this.state.serviceDescription1,
          price: this.state.servicePrice1,
        },
      ],
    };

    const hash = await web3Store.ipfsAdd(
      JSON.stringify(data),
    );

    this.setState({ uploading: false });

    // TODO Cache it
    const b32 = ipfsStore.getBytes32(hash[0].path);
    await web3Store.updateMetadata(address, b32);
    await web3Store.addService(address, data.services[0].price)
   
  }

  inputUpdate = (evt: any) => {
    const { name, value } = evt.target;
    this.setState({
      [name]: value,
    });
  }

  upload = (files: any) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.setState({
        file: e.target.result,
      });
    };

    reader.readAsDataURL(files[0]);
    
    this.setState({
      preview: URL.createObjectURL(files[0]),
    })
  }

  render() {
    const { bio, downloading, location, serviceTitle1, serviceDescription1, servicePrice1 } = this.state;

    return (
      <>
        {
          // downloading
          //   ? <RingLoader/>
          //   :
            <>
            <DisplayContainer>
              <Subject upload={this.upload} preview={this.state.preview}/>
              <InputDisplay>
                <h4>Your Bio:</h4>
                <BioInput
                  name="bio"
                  onChange={this.inputUpdate}
                  rows={7}
                  defaultValue={bio}
                />
                <h4>Location:</h4>
                <LocationInput
                  name="location"
                  onChange={this.inputUpdate}
                  defaultValue={location}
                />
              </InputDisplay>
            </DisplayContainer>
            {/* <DisplayContainer halfsize>
              <DisplayHeading>
                Your tags:
              </DisplayHeading>
              <TagContainer>
                <Tag>blockchain</Tag>
                <AddButton>+</AddButton>
              </TagContainer>
            </DisplayContainer> */}
            <DisplayContainer halfsize>
              <DisplayHeading>
                What will you offer?
              </DisplayHeading>
              <br/>
              <div style={{ display: 'flex', width: '100%'}}>
                {
                  this.state.serviceEdit ?
                    <ServiceBox>
                      <ServiceInputTitle name="serviceTitle1" onChange={this.inputUpdate} placeholder="title" defaultValue={serviceTitle1}/>
                      <ServiceInputDescription name="serviceDescription1" onChange={this.inputUpdate} placeholder="description" defaultValue={serviceDescription1}/>
                      <ServiceInputPrice name="servicePrice1" onChange={this.inputUpdate} placeholder="price" defaultValue={servicePrice1}/>  
                    </ServiceBox>
                    : ''
                }
                <AddServiceButton onClick={() => this.setState({ serviceEdit: true })}>
                  +
                </AddServiceButton>
              </div>
            </DisplayContainer>
            <CommitButton onClick={this.commit}>
              Commit to Ethereum
            </CommitButton>
            {
              this.state.uploading ?
              'Uploading!' : ''
            }
            </>
        }
      </>
    )
  }
}));

const InteriorDashboard = inject('ipfsStore', 'web3Store')(observer(class InteriorDashboard extends React.Component<any,any> {
  state = {
    active: 0,
  }

  componentDidMount = async () => {
    const { web3Store, match: { params: { account } } } = this.props;

    web3Store.getAccountDataAndCache(account)
    if (web3Store.betaCache.has(account)) {
      web3Store.ipfsGetDataAndCache(web3Store.betaCache.get(account).metadata);
    }
  }

  setActive = (evt: any) => {
    const { id } = evt.target;
    this.setState({
      active: parseInt(id),
    });
  }

  // TODO check implementation of this account on log in and post a comment if an upgrade is needed
  upgrade = () => {
    this.props.web3Store.upgrade(this.props.match.params.account)
  }

  sendContributions = () => {
    const { web3Store, match: { params: { account } } } = this.props;
    if (!web3Store.account) {
      alert('You must be logged in to do this action!');
      return;
    }
    web3Store.sendContribution(account);
  }

  render() {
    const { web3Store, match: { params: { account } } } = this.props;
    const { active } = this.state;

    const contributionsWaiting = web3Store.betaCache.has(account) ? web3Store.web3.utils.fromWei(web3Store.betaCache.get(account).contributions).slice(0,6) : '?';

    return (
      <>
        <DashboardLeft>
          <DashboardLink active={active === 0} id={0} onClick={this.setActive}>
            Profile
          </DashboardLink>
          <DashboardLink active={active === 1} id={1} onClick={this.setActive}>
            Inbox
          </DashboardLink>
          {/* <DashboardLink active={active === 2} id={2} onClick={this.setActive}>
            Wallet
          </DashboardLink> */}
        </DashboardLeft>
        <DashboardMiddle>
          {
            active === 0 &&
              <Profile address={account}/>
            ||
            active == 1 &&
              <Inbox address={account}/>
            ||
            active == 2 &&
              <Wallet address={account}/>
          }
        </DashboardMiddle>
        <DashboardRight>
          <DashboardRightBox>
            <div style={{ width: '100%' }}>
              You have {contributionsWaiting} eth in contributions to withdraw.
            </div>
            <WidthdrawButton onClick={this.sendContributions}>
              Withdraw
            </WidthdrawButton>
          </DashboardRightBox>
          <DashboardRightBox>
            <div style={{ width: '100%' }}>
              You are on the current release.
            </div>
            <WidthdrawButton onClick={this.upgrade}>
              Upgrade
            </WidthdrawButton>
          </DashboardRightBox>
          
        </DashboardRight>
      </>
    )
  }
}));

const DashboardPage = withRouter(observer(
  class DashboardPage extends React.Component<any,any>{

  render() {
    const { web3Store } = this.props;

    const items = Array.from(web3Store.accountsCache).map((address: any) => {
      const blockie = makeBlockie(address);
       return (
        <AccountLink to={`/dashboard/${address}`} key={Math.random()}>
          <img src={blockie} style={{ width: '50px', height: '50px', borderRadius: '25px' }} alt={address}/>
          {address}
        </AccountLink>
       );
    });

    return (
      <DashboardContainer>
        <Route path='/dashboard' exact render={() => (
          web3Store.account
            ?
              <YourAccounts>
                {items}
              </YourAccounts>
            :
              <h1>Please log in</h1>
        )}/>
        <Route path='/dashboard/:account' render={(props: any) => <InteriorDashboard {...props} web3Store={web3Store}/>}/>
      </DashboardContainer>
    )
  }
}));

export default DashboardPage;
