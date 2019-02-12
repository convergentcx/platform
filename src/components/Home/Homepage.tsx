import React from 'react';
import styled from 'styled-components';

import { colors, shadowMixin } from '../../common/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faRocket } from '@fortawesome/free-solid-svg-icons';

const HomeContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${colors.BgGrey};
`;

const LaunchButton = styled.button`
  cursor: pointer;
  width: 40vw;
  height: 40vw;
  border-radius: 20vw;
  font-size: 48px;
  background: #FFF;
  color: #000;
  border: solid;
  border-color: #000;
  border-width: 16px;
  transition: 1s;
  font-style: italic;
  font-weight: 900;
  ${shadowMixin}
  :hover {
    color: #FFF;
    background: ${colors.OrangeDark};
    box-shadow: 0 15px 35px rgba(50,50,93,.9), 0 5px 15px rgba(0,0,0,.87);
  }
  @media (max-width: 1000px) {
    font-size: 32px;
  }
  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const UserInput = styled.input`
  margin-bottom: 8px;
  background: #EEE;
  color: black;
`;

const DeployButton = styled.button`
  cursor: pointer;
  margin-top: 16px;
  height: 32px;
  background: ${colors.SoftBlue};
  color: #FFF;
  cursor: pointer;
  font-style: italic;
  font-weight: 600;
  transition: 0.2s;
  border: none;
  :hover {
    color: #FFF;
    background: ${colors.CvgPurp};
  }
`;

type HomePageState = {
  accountName: string|null,
  accountTicker: string|null,
  launching: boolean,
  text: string,
  [x: number]: any,
  mobile: boolean,
};

class HomePage extends React.Component<{web3Store: any}, HomePageState> {
  state = {
    accountName: null,
    accountTicker: null,
    launching: false,
    text: 'CONVERGENT',
    mobile: false,
    premint: "0",
  }

  componentDidMount = () => {
    this.setState({ mobile: innerWidth <= 480 });
  }

  deploy = async () => {
    const { web3Store } = this.props; 
    if (!web3Store) {
      alert('Log in first!');
    }
    const randBytes32 = web3Store.web3.utils.randomHex(32);
    const tx = await web3Store.convergentBeta.methods.newAccount(
      "0x0000000000000000000000000000000000000000", // reserve asset
      "1", // slopeN
      "1000", // slopeD
      "1",  //exponent
      "60", // spreadN
      "100",  // spreadD
      this.state.premint.toString(),  // premint
      randBytes32,  //metadata
      this.state.accountName, //_name
      this.state.accountTicker, // _symbol
    ).send({ from: this.props.web3Store.account });
    // console.log(tx);
    if (tx.status === true) {
      console.log('success');
      console.log('tx hash: ', tx.transactionHash);
      console.log('account: ', tx.events.NewAccount.returnValues.account);
    }
  }

  inputUpdate = (evt: any) => {
    const { name, value } = evt.target;
    this.setState({
      [name]: value,
    });
  }

  mouseClick = () => {
    // alert('Please contribute for early access.');
    if (this.props.web3Store.readonly) {
      alert('Log in first!');
      return;
    }
    this.setState({ launching: true });
  }

  mouseEnter = () => {
    this.setState({ text: '' });
    setTimeout(() => {
      // this.setState({ text: 'LOCKED' })
      this.setState({ text: 'LAUNCH' })
    }, 600);
  }

  mouseExit = () => {
    this.setState({ text: '' });
    setTimeout(() => {
      this.setState({ text: 'CONVERGENT' })
    }, 300);
  }

  render() {
    // console.log(this.state);
    return (
      <HomeContainer>
        {
          this.state.launching
          ?
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              Your name:
              <UserInput
                name="accountName"
                onChange={this.inputUpdate}
              />
              Your ticker symbol:
              <UserInput
                name="accountTicker"
                onChange={this.inputUpdate}
              />
              Pre-mint:
              <UserInput
                name="premint"
                onChange={this.inputUpdate}
              />
              What do you want to tokenize:
              <UserInput
                name="service"
                onChange={this.inputUpdate}
              />
              <DeployButton
                onClick={this.deploy}
              >
                Deploy
              </DeployButton>
            </div>
          :
            <LaunchButton
              onClick={this.mouseClick}
              onMouseEnter={this.mouseEnter}
              onMouseLeave={this.mouseExit}
            >
              {
                this.state.mobile
                ?
                  <FontAwesomeIcon icon={faRocket} style={{ color: 'white', fontSize: '40px'}}/> 
                :
                  this.state.text
              }
            </LaunchButton>
        }
      </HomeContainer>
    );
  }
};

export default HomePage;
