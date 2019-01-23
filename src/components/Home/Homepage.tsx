import React from 'react';
import styled from 'styled-components';

import { colors, shadowMixin } from '../../common/index';

const HomeContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${colors.BgGrey};
`;

const LaunchButton = styled.button`
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
  ${shadowMixin}
  :hover {
    color: #FFF;
    background: #000;
    box-shadow: 0 15px 35px rgba(50,50,93,.9), 0 5px 15px rgba(0,0,0,.87);
  }
`;

class HomePage extends React.Component {
  state = {
    text: 'CONVERGENT'
  }

  mouseEnter = () => {
    this.setState({ text: '' });
    setTimeout(() => {
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
    return (
      <HomeContainer>
        <LaunchButton
          onMouseEnter={this.mouseEnter}
          onMouseLeave={this.mouseExit}
        >
          {this.state.text}
        </LaunchButton>
      </HomeContainer>
    );
  }
};

export default HomePage;