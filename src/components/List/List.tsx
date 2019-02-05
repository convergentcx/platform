import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import makeBlockie from 'ethereum-blockies-base64';

import { RingLoader } from 'react-spinners';

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
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #FFF;
  width: 400px;
  transition: 0.4s;
  :hover {
    background: rgba(00,44,255, 0.3);
  }
`;

const Blockie = styled.img`
  height: 45px;
  width: 45px;
`;

const List = (props: any) => {
  let items = [];
  if (props.web3Store.cbAccounts) { 

    for (const [account, obj] of props.web3Store.cbAccounts) {
      const block = makeBlockie(account);

      let MC = '???'
      let name = '???'
      if (props.web3Store.betaCache.has(account)) {
        MC = props.web3Store.web3.utils.fromWei(Math.floor(props.web3Store.betaCache.get(account).marketCap).toString()).slice(0,5);
        name = props.web3Store.betaCache.get(account).name;
      }

      items.push(
        <ListItem to={`/profile/${account}`} key={Math.random()}>
          <Blockie src={block} alt="blockie"/>
          {/* <br/>
          Creator: {obj.creator} */}
          <div>{name}</div>
          <div>{MC}</div>
          {obj.blockNumber}
        </ListItem>
      )
    }
  }

  return (
    <ListContainer>
      {
        items.length > 0 ? items : <RingLoader/>
      }
    </ListContainer>
  );
};

export default observer(List);
