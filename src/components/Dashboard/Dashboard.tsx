import React from 'react';
import styled from 'styled-components';

import Subject from '../Dropzone.jsx';

const DashboardContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: #2424D0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DashboardLeft = styled.div`
  width: 20%;
  height: 100%;
  background: #005566;
`;

const DashboardMiddle = styled.div`
  width: 50%;
  height: 100%;
  background: #117788;
  justify-content: center;
  display: flex;
`;

const PolaroidCard = styled.div`
  width: 400px;
  height: 500px;
  background: #444488;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const CreativeInput = styled.input`
  width: 80%;
  color: #FFF;
  height: 30px;
  margin-top: 8px;
`;

const DashboardRight = styled.div`
  width: 20%;
  height: 100%;
  background: #2299AA;
`;

const DashboardPage = () => (
  <DashboardContainer>
    <DashboardLeft/>
    <DashboardMiddle>
      <PolaroidCard>
        <Subject/>
        <CreativeInput/>
      </PolaroidCard>
    </DashboardMiddle>
    <DashboardRight/>
  </DashboardContainer>
);

export default DashboardPage;
