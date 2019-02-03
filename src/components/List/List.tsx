import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { observer } from 'mobx-react';

const ListContainer = styled.div`
  width: 100%;
  min-height: 50vh;
  padding-top: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ListItem = styled(Link)`
  max-width: 80%;
  margin-bottom: 16px;
  background: yellow;
`;

const List = (props: any) => {
  let items = 'Please log in';
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
      {items}
    </ListContainer>
  );
};

export default observer(List);
