import React from 'react';
import { Link, Route, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { any } from 'prop-types';

// import Subject from '../Dropzone.jsx';

const DashboardContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: #FFF;
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
  transition: 0.2s;
  :hover {
    color: #A3A3A3;
  }
`;

const DashboardLeft = styled.div`
  width: 20%;
  height: 100%;
  background: #005566;
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
  height: 100%;
  background: #117788;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const DisplayContainer = styled.div<any>`
  width: 80%;
  min-height: ${(props: any) => props.halfsize ? '15%' : '30%'};
`;

const BioDisplay = styled.input`
  width: 100%;
  background: #E9EDF2;
  min-height: 50%;
  color: #000;
  display: flex;
  align-items: flex-start;
`;

const CommitButton = styled.button`
  display: flex;
  cursor: pointer;
  width: 90%;
  background: transparent;
  border: solid;
  justify-content: center;
  align-items: center;
  height: 32px;
  font-size: 16px;
  transition: 0.3s;
  :hover {
    background: blue;
  }
`;

const DisplayHeading = styled.h4`
  margin-bottom: 8px;
`;

const AddButton = styled.button`
  display: flex;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  justify-content: center;
  align-items: center;
  font-weight: 900;
`;

const AddServiceButton = styled.button`
  display: flex;
  width: 64px;
  height: 32px;
  border-radius: 16px;
  justify-content: center;
  align-items: center;
  font-weight: 900;
`;

const TagContainer = styled.div`
  display: flex;
  width: 100%;
  flex-flow: row wrap;
`;

const Tag =styled.button`
  display: flex;
  width: 96px;
  height: 32px;
  font-size: 10px;
  border-radius: 16px;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
`;

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
  height: 100%;
  background: #2299AA;
`;

class InteriorDashboard extends React.Component<any,any> {
  state = {
    active: 0,
  }

  setActive = (evt: any) => {
    const { id } = evt.target;
    this.setState({
      active: parseInt(id),
    });
  }

  render() {
    const { active } = this.state;

    return (
      <>
        <DashboardLeft>
          <DashboardLink active={active === 0} id={0} onClick={this.setActive}>
            Details
          </DashboardLink>
          <DashboardLink active={active === 1} id={1} onClick={this.setActive}>
            Inbox
          </DashboardLink>
        </DashboardLeft>
        <DashboardMiddle>
          {
            active === 0 &&
              <>
              <h1>Details</h1>
              <DisplayContainer>
                <DisplayHeading>
                  Your bio:
                </DisplayHeading>
                <BioDisplay/>
              </DisplayContainer>
              <DisplayContainer halfsize>
                <DisplayHeading>
                  Your tags:
                </DisplayHeading>
                <TagContainer>
                  <Tag>blockchain</Tag>
                  <AddButton>+</AddButton>
                </TagContainer>
              </DisplayContainer>
              <DisplayContainer halfsize>
                <DisplayHeading>
                  Your services:
                </DisplayHeading>
                <AddServiceButton>
                  +
                </AddServiceButton>
              </DisplayContainer>
              <CommitButton>
                Commit to Ethereum
              </CommitButton>
              </>
            ||
            active == 1 &&
              <>
              <h1>Inbox</h1>
              <p>{this.props.match.params.account}</p>
              </>
          }
        </DashboardMiddle>
        <DashboardRight/>
      </>
    )
  }
};

const DashboardPage = withRouter(observer(
  class DashboardPage extends React.Component<any,any>{

  render() {
    const { web3Store } = this.props;

    const items = Array.from(web3Store.accountsCache).map((value: any) => {
       return <AccountLink to={`/dashboard/${value}`} key={Math.random()}>{value}</AccountLink>;
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
        <Route path='/dashboard/:account' render={(props: any) => <InteriorDashboard {...props}/>}/>
      </DashboardContainer>
    )
  }
}));

export default DashboardPage;
