import dataUriToBuffer from 'data-uri-to-buffer';
import makeBlockie from 'ethereum-blockies-base64';
import { observer, inject } from 'mobx-react';
import React from 'react';
import { Link, Route, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { RingLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faUserAstronaut
} from '@fortawesome/free-solid-svg-icons';

import Inbox from './Inbox/Inbox';
import Subject from '../Dropzone.jsx';
// import Wallet from './Wallet/Wallet';

import { colors, shadowMixin } from '../../common';
import { any } from 'prop-types';

const DashboardContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: ${colors.CvgTealLight};
  display: flex;
  justify-content: ;
  align-items: center;
`;

// const YourAccounts = observer(styled.div`
//   max-width: 80%;
//   display: flex;
//   flex-direction: column;
// `);

const AccountLink = styled(Link)`
  display: flex;
  width: 100%;
  text-decoration: none;
  align-items: center;
  margin-bottom: 8px;
  transition: 0.2s;
  color: #FFF;
  padding: 8px 0 8px 0;
  :hover {
    color: ${colors.SoftBlue};
    background: ${colors.BgGrey};
  }
`;

const AccountLinkImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;

const AccountLinkName = styled.div`
  font-size: 20px;
  fontWeight: bold;
`;

const AccountDetails = styled.div`
  padding-left: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DashboardLeft = styled.div`
  width: 20%;
  max-width: 20%;
  height: 100vh;
  background: ${colors.CvgTealLight};
`;

// const DashboardLink = styled.div<any>`
//   cursor: pointer;
//   display: flex;
//   width: 100%;
//   text-decoration: none;
//   color: ${(props: any) => props.active ? '#FFF' : '#000'};
//   justify-content: center;
//   align-items: center;
//   height: 20%;
//   transition: 0.2s;
//   background: ${(props: any) => props.active ? '#000' : 'transparent'};
//   :hover {
//     background: ;
//     color: #FFF;
//   }
// `;

const DashboardMiddle = styled.div`
  width: 60%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const DashboardMiddleChildren = styled.div`
  height: 90%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  align-items: center;
`;

const ProfileContainer = styled.div`
  width: 100%;
  height: 100%;
  background: ;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const InputHeading = styled.div`
  font-size: 24px;
  font-weight: bold;

`;

const DashboardMidNav = styled.div`
  align-self: flex-start;
  justify-self: flex-start;
  height: 10%;
  width: 100%;
  background: ;
  display: flex;
  flex-direction: row;
`;

const DashboardMidNavItem = styled(Link)<any>`
  cursor: pointer;
  width: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${props => props.active ? '#de9360' : 'black'};
  transition: 0.3s;
  :hover {
    color: ${props => props.active ? '' : 'rgba(0,0,0,0.5)'};
  }
`;

const Circle = styled.div`
  width: 25%;
  background: black;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DisplayContainer = styled.div<any>`
  width: 80%;
  min-height: ${(props: any) => props.halfsize ? '15%' : '30%'};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: row wrap;
`;

const InputDisplay = styled.div`
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
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
  background: #E9EDF2;
  color: #000;
`;

const ServiceInputDescription = styled.input`
  display: flex;
  width: 55%;
  background: #E9EDF2;
  color: #000;
`;

const ServiceInputPrice = styled.input`
  display: flex;
  width: 5%;
  background: #E9EDF2;
  color: #000;
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
  background: #111;
  :hover {
    background: #666;
  }
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
  cursor: pointer;
  background: #111;
  :hover {
    background: #666;
  }
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
  justify-content: space-around;
  align-items: center;
  flex-flow: column;
`;

const DashboardRightBox = styled.div`
  width: 60%;
  height: 120px;
  display: flex;
  flex-flow: column;
  padding: 32px 32px 32px 32px;
  background: #FFF;
  border-radius: 40px;
  ${shadowMixin}
  margin: ;
  font-size: 16px;
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
  background: #de9360;
  border: none;
  cursor: pointer;
  transition: 0.3s;
  width: 100%;
  height: 20%;
  color: #FFF;
  :hover {
    background: ${colors.OrangeDark};
  }
`;

const Profile = withRouter(inject('ipfsStore', 'web3Store')(observer(class Profile extends React.Component<any, any> {
  state = {
    downloading: true,
    bio: '',
    location: '',
    services: [],
    serviceTitle1: '',
    serviceDescription1: '',
    servicePrice1: '',
    preview: null,
    uploading: false,
    file: '',
    serviceEdit: false,
    serviceNum: 0,
    [name]: any,
    pic: null,
  }

  componentDidMount = async () => {
    this.getData();
  }
  componentWillReceiveProps = () => {
    this.forceUpdate();
  }

  getData = async () => {
    const { web3Store } = this.props;
    const address = this.props.match.params.account;

    if (!web3Store.betaCache.has(address)) {
      setTimeout(() => this.getData(), 4000);
      return;
    }

    const { metadata } = web3Store.betaCache.get(address);

    if (!this.props.web3Store.ipfsCache.has(metadata)) {
      this.setState({
        downloading: false,
        bio: '',
        location: '',
        services: [],
      });
      return;
    }

    await this.props.web3Store.ipfsGetDataAndCache(
      this.props.web3Store.betaCache.get(
        address,
      ).metadata,
    );

    let bio, location, pic, services;
    if (web3Store.betaCache.has(address) && web3Store.ipfsCache.has(web3Store.betaCache.get(address).metadata)) {
      const data = web3Store.ipfsCache.get(web3Store.betaCache.get(address).metadata);
      // console.log(data.bio)
      bio = data.bio || '';
      location = data.location || '';
      pic = data.pic || '';
      services = data.services || [];
    }

    let preview = '';
    if (pic) {
      preview = `data:image/jpeg;base64,${Buffer.from(pic.data).toString('base64')}`;
    }

    const { curServiceIndex } = web3Store.betaCache.get(address);

    this.setState({
      downloading: false,
      bio,
      location,
      services,
      serviceTitle0: services[0] && services[0].title || '',
      serviceDescription0: services[0] && services[0].description || '',
      servicePrice0: services[0] && services[0].price || '',
      serviceTitle1: services[1] && services[1].title || '',
      serviceDescription1: services[1] && services[1].description || '',
      servicePrice1: services[1] && services[1].price || '',
      serviceTitle2: services[2] && services[2].title || '',
      serviceDescription2: services[2] && services[2].description || '',
      servicePrice2: services[2] && services[2].price || '',
      preview,
      serviceNum: curServiceIndex < 3 ? parseInt(curServiceIndex)+1 : 3,
      pic,
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
    } else if (this.state.pic) {
      imgBuf = this.state.pic;
    }

    this.setState({ uploading: true });

    let services = [];
    for (let i = 0; i < this.state.serviceNum; i++) {
      const x = i.toString();
      services.push({
        title: this.state[(`serviceTitle${x}` as any)],
        description: this.state[(`serviceDescription${x}` as any)],
        price: this.state[(`servicePrice${x}` as any)],
      });
    }

    const data = {
      bio: this.state.bio,
      location: this.state.location,
      pic: imgBuf,
      services,
    };

    const hash = await web3Store.ipfsAdd(
      JSON.stringify(data),
    );

    this.setState({ uploading: false });

    // TODO Cache it
    const b32 = ipfsStore.getBytes32(hash[0].path);
    await web3Store.updateMetadata(address, b32);

    const { curServiceIndex } = web3Store.betaCache.get(address);
    console.log(curServiceIndex)
    console.log(data.services.length)
    if (parseInt(curServiceIndex) < data.services.length) {
      for (let j = parseInt(curServiceIndex); j < data.services.length; j++) {
        await web3Store.addService(address, data.services[j].price);
      }
    }
  }

  inputUpdate = (evt: any) => {
    const { name, value } = evt.target;
    this.setState({
      [name]: value,
    });
    // evt.target.autofocus();
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

  serviceButtonClicked = () => {
    if (this.state.serviceNum > 3) {
      return;
    }
    this.setState({
      serviceNum: this.state.serviceNum + 1,
    });
  }

  render() {
    const { bio, downloading, location, serviceNum } = this.state;

    console.log(serviceNum)
    return (
      <ProfileContainer>
        {
          downloading
            ? <RingLoader />
            :
            <>
              <DisplayContainer>
                <div style={{ width: '40%' }}>
                  <Subject upload={this.upload} preview={this.state.preview} />
                </div>
                <InputDisplay>
                  <InputHeading>Your Bio:</InputHeading>
                  <BioInput
                    name="bio"
                    onChange={this.inputUpdate}
                    rows={7}
                    defaultValue={bio}
                  />
                  <InputHeading>Location:</InputHeading>
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
              <DisplayContainer halfsize style={{ marginTop: '16px' }}>
                <InputHeading>
                  What will you offer?
              </InputHeading>
                <div style={{ display: 'flex', width: '100%', marginTop: '24px', flexDirection: 'column', alignItems: 'center' }}>
                  {
                    [...Array(serviceNum).keys()].map((i: number) => {
                      return (
                        <ServiceBox key={i + 30 * (i + 1)}>
                          <ServiceInputTitle key={i + 31 * (i + 1)} name={`serviceTitle${i}`} type="text" onChange={this.inputUpdate} placeholder="title" value={(this.state[(`serviceTitle${i}` as any)] as any)} />
                          <ServiceInputDescription key={i + 32 * (i + 1)} name={`serviceDescription${i}`} type="text" onChange={this.inputUpdate} placeholder="description" value={(this.state[(`serviceDescription${i}` as any)] as any)} />
                          <ServiceInputPrice key={i + 34 * (i + 1)} name={`servicePrice${i}`} type="number" onChange={this.inputUpdate} placeholder="price" value={(this.state[(`servicePrice${i}` as any)] as any)} />
                        </ServiceBox>
                      )
                    })
                  }
                  {
                    serviceNum < 3
                    &&
                    <AddServiceButton onClick={this.serviceButtonClicked}>
                      +
                  </AddServiceButton>
                  }
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
      </ProfileContainer>
    )
  }
})));

const InteriorDashboard = inject('ipfsStore', 'web3Store')(observer(class InteriorDashboard extends React.Component<any, any> {
  state = {
    active: 1000,
  }

  componentDidMount = async () => {
    const { web3Store, match: { params: { account } } } = this.props;

    web3Store.getAccountDataAndCache(account)
    if (web3Store.betaCache.has(account)) {
      web3Store.ipfsGetDataAndCache(web3Store.betaCache.get(account).metadata);
    }

    web3Store.getBalance(account);
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

  sellTokens = (amt: string) => {
    const { web3Store, match: { params: { account } } } = this.props;
    if (!web3Store.account) {
      alert('You must be logged in to do this action!');
      return;
    }
    web3Store.sell(
      account,
      amt,
    );
  }

  render() {
    const { web3Store, match: { params: { account } } } = this.props;
    const { active } = this.state;

    const contributionsWaiting = web3Store.betaCache.has(account) ? web3Store.web3.utils.fromWei(web3Store.betaCache.get(account).contributions).slice(0, 6) : '?';
    const symbol = web3Store.betaCache.has(account) ? web3Store.betaCache.get(account).symbol : '';
    const balance = web3Store.balancesCache.has(account) ? web3Store.balancesCache.get(account) : '0';
    return (
      <>
        <DashboardMiddle>
          <DashboardMidNav>
            <DashboardMidNavItem active={active === 0} to={`/dashboard/${account}/profile`} onClick={() => this.setState({ active: 0 })}>
              {/* <Circle> */}
              <FontAwesomeIcon icon={faUserAstronaut} />
              {/* </Circle> */}
            </DashboardMidNavItem>
            <DashboardMidNavItem active={active === 1} to={`/dashboard/${account}/inbox`} onClick={() => this.setState({ active: 1 })}>
              <FontAwesomeIcon icon={faEnvelope} />
            </DashboardMidNavItem>
          </DashboardMidNav>
          <DashboardMiddleChildren>
            <Route path='/dashboard/:account/profile' onChange={() => this.forceUpdate()} render={(props: any) => <Profile {...props} address={account}/>}/>
            <Route path='/dashboard/:account/inbox' onChange={() => this.forceUpdate()} render={(props: any) => <Inbox {...props} address={account}/>}/>
          </DashboardMiddleChildren>
        </DashboardMiddle>
        <DashboardRight>
          <DashboardRightBox>
            <div style={{ width: '100%', height: '80%' }}>
              You have {contributionsWaiting} eth in contributions to withdraw.
            </div>
            <WidthdrawButton onClick={this.sendContributions}>
              Withdraw
            </WidthdrawButton>
          </DashboardRightBox>
          <DashboardRightBox>
            <div style={{ width: '100%', height: '80%' }}>
              You hold {(web3Store.web3 && web3Store.web3.utils.fromWei(balance)) || '???'} {symbol}.
            </div>
            <WidthdrawButton onClick={() => this.sellTokens(balance)}>
              Sell
            </WidthdrawButton>
          </DashboardRightBox>
          <DashboardRightBox>
            <div style={{ width: '100%', height: '80%' }}>
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
  class DashboardPage extends React.Component<any, any>{

    render() {
      const { web3Store } = this.props;

      const items = Array.from(web3Store.accountsCache).map((address: any) => {
        const blockie = makeBlockie(address);

        let tokenName = 'Token Name';
        if (web3Store.betaCache.has(address)) {
          tokenName = web3Store.betaCache.get(address).name;
        }

        return (
          <AccountLink to={`/dashboard/${address}`} key={Math.random()}>
            <AccountLinkImg src={blockie} alt={address} />
            <AccountDetails>
              <AccountLinkName>
                {tokenName}
              </AccountLinkName>
              {address}
            </AccountDetails>
          </AccountLink>
        );
      });

      return (
        <DashboardContainer>
          <Route path='/dashboard' render={() => (
            web3Store.account
              ?
              <DashboardLeft>
                {items}
              </DashboardLeft>
              :
              <h1 style={{ width: '100%', textAlign: 'center' }}>Please log in</h1>
          )} />
          {
            web3Store.account
              ?
              <Route path='/dashboard/:account' onChange={() => this.forceUpdate()} render={(props: any) => <InteriorDashboard {...props} web3Store={web3Store} />} />
              :
              ''
          }
        </DashboardContainer>
      )
    }
  }));

export default DashboardPage;
