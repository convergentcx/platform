import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { observer } from 'mobx-react';

import { colors } from '../../common';

const ListContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: ${colors.BgGrey};
`;

const ListItem = styled(Link)`
  max-width: 80%;
  margin-bottom: 16px;
`;

const List = (props: any) => {
  let items = [];
  if (props.web3Store.cbAccounts) { 
    console.log('filling')
    items = props.web3Store.cbAccounts.map((account: any) => (
      <ListItem to={`/profile/${account.returnValues.account}`} key={Math.random().toString()}>
        {account.returnValues.account}
      </ListItem>
    ));
  }

  return (
    <ListContainer>
      {
        items.length > 0 ? items : <h1>Please log in</h1>
      }
    </ListContainer>
  );
};

export default observer(List);
