import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

import { shadowMixin } from '../../../common';

const AboutContainer = styled.div`
  background: #FFF;
  border-radius: 60px;
  border-width: 10px;
  width: 50vw;
  height: 90vh;
  margin-top: 5vh;
  ${shadowMixin}
  @media (max-width: 450px) {
    width: 94vw;
    margin-bottom: 8%;
  }
`;

const AboutInner = styled.div`
  padding: 70px;
  display: flex;
  text-align: left;
`;

type AboutSectionProps = {
  address: string,
  web3Store: any,
}

const AboutSection = observer((props: AboutSectionProps) => (
  <AboutContainer>
    <AboutInner>
     {
       (props.web3Store.betaCache.has(props.address) && props.web3Store.ipfsCache.get(props.web3Store.betaCache.get(props.address).metadata))
       ?
         props.web3Store.ipfsCache.get(props.web3Store.betaCache.get(props.address).metadata).bio.replace(/\\n/g, '\n')
       : 'User has no description'
     }
   </AboutInner>
  </AboutContainer>
));

export default AboutSection;