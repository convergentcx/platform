import React from 'react';
import { Link, Route } from 'react-router-dom';
import styled from 'styled-components';

// import Subject from '../Dropzone.jsx';

const DashboardContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: #FFF;
  display: flex;
  justify-content: center;
  align-items: center;
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
  color: ${(props: any) => props.active ? '#2424D0' : '#000'};
  justify-content: center;
  align-items: center;
  height: 20%;
  transition: 0.2s;
  background: ${(props: any) => props.active ? '#CCC' : '#FFF'};
  :hover {
    background: #CCC;
    color: #2424D0;
  }
`;

const DashboardMiddle = styled.div`
  width: 60%;
  height: 100%;
  background: #117788;
  justify-content: center;
  display: flex;
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

class DashboardPage extends React.Component<any,any>{
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
      <DashboardContainer>
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
              <h1>Details</h1>
            ||
            active == 1 &&
              <h1>Inbox</h1>
          }
        </DashboardMiddle>
        <DashboardRight/>
      </DashboardContainer>
    )
  }
};

export default DashboardPage;
