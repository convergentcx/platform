import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { observer, inject } from 'mobx-react';
import makeBlockie from 'ethereum-blockies-base64';

import { RingLoader } from 'react-spinners';

import { colors } from '../../common';

const ListContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: ;
  align-items: center;
  flex-direction: column;
  background: ${colors.BgGrey};
`;

const ListHeader = styled.div`
  width: 80%;
  margin-top: 16px;
  margin-bottom: 16px;
  justify-content: space-between;
  align-items: center;
  display: flex;

`;

const ListItem = styled(Link)<any>`
  width: 80%;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #FFF;
  transition: 0.4s;
  :hover {
    background: rgba(00,44,255, 0.3);
  }
`;

const HeaderItem = styled.div`
  display: flex;
  width: 20%;
  justify-content: center;
  align-items: center;
`;


const HeaderItemClick = styled.div`
  display: flex;
  width: 20%;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 0.4s;
  :hover {
    color: ${colors.SoftBlue};
  }
`;

const BContainer = styled.div`
  display: flex;
  width: 20%;
  justify-content: ;
  align-items: ;
`;

const Blockie = styled.img`
  height: 45px;
  width: 45px;
  
`;

const List = inject('web3Store')(observer(class List extends React.Component<any,any> {
  state = {
    byPrice: null,
    chrono: false,
  }

  reverseChronologic = () => {
    this.setState({
      byPrice: null,
      chrono: !this.state.chrono,
    })
  }

  render() {
    let items = [];
    if (this.props.web3Store.cbAccounts) { 

      for (const [account, obj] of this.props.web3Store.cbAccounts) {
        const block = makeBlockie(account);

        let MC = '???'
        let name = '???'
        let curPrice = '???'
        if (this.props.web3Store.betaCache.has(account)) {
          MC = this.props.web3Store.web3.utils.fromWei(
            Math.floor(this.props.web3Store.betaCache.get(account).marketCap).toString()
          ).slice(0,5);
          curPrice = this.props.web3Store.web3.utils.fromWei(this.props.web3Store.betaCache.get(account).curPrice).slice(0,5)
          name = this.props.web3Store.betaCache.get(account).name;
        }

        items.push(
          <ListItem to={`/profile/${account}`} key={Math.random()} curprice={curPrice}>
            <BContainer>
              <Blockie src={block} alt="blockie"/>
            </BContainer>
            <HeaderItem>{name}</HeaderItem>
            <HeaderItem>{curPrice}</HeaderItem>
            <HeaderItem>{MC}</HeaderItem>
            <HeaderItem>{obj.blockNumber}</HeaderItem>
          </ListItem>
        )
      }
    }

    if (this.state.chrono) {
      items.reverse()
    }

    if (this.state.byPrice) {
      items = items.sort((a: any, b: any) => {
        const { toWei, toBN } = this.props.web3Store.web3.utils;
        console.log(a)
        a = toBN(toWei(a.props.curprice));
        b = toBN(toWei(b.props.curprice));
        if (a.gt(b)) return -1;
        else return 1;
      })
    } 
    if (this.state.byPrice === false) {
      items = items.sort((a: any, b: any) => {
        const { toWei, toBN } = this.props.web3Store.web3.utils;
        console.log(a)
        a = toBN(toWei(a.props.curprice));
        b = toBN(toWei(b.props.curprice));
        if (a.gt(b)) return 1;
        else return -1;
      })
    } 

    return (
      <ListContainer>
        <ListHeader>
          <HeaderItem/>
          <HeaderItem>NAME</HeaderItem>
          <HeaderItemClick onClick={() => this.setState({ byPrice: !this.state.byPrice })}>PRICE</HeaderItemClick>
          <HeaderItem>MARKET CAP</HeaderItem>
          <HeaderItemClick onClick={this.reverseChronologic}>CREATION</HeaderItemClick>
        </ListHeader>
        {
          items.length > 0 ? items : <RingLoader/>
        }
      </ListContainer>
    );
  }
}));

export default List;
