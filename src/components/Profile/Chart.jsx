import React from 'react';
import { inject, observer } from 'mobx-react';
import { RingLoader } from 'react-spinners';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { colors } from '../../common';

const BondingCurve = inject('web3Store')(observer(class BondingCurve extends React.Component {
  render() {
    const { address, web3Store } = this.props;

    let data;
    if (web3Store.betaCache.has(address)) {
      const getY = (slopeN, slopeD, exponent, X) => {
        return parseInt(slopeN) * X ** parseInt(exponent) / parseInt(slopeD);
      }

      const getSell = (slopeN, slopeD, exponent, spreadN, spreadD, X) => {
        return parseInt(spreadN) * parseInt(slopeN) * X ** parseInt(exponent) / parseInt(slopeD) / parseInt(spreadD);
      }
   
      const range = [...Array(500).keys()];

      data = range.map((val) => {
        const { slopeN, slopeD, exponent, spreadN, spreadD, totalSupply } = web3Store.betaCache.get(address);
        const y = getY(slopeN, slopeD, exponent, val);
        const sell = getSell(slopeN, slopeD, exponent, spreadN, spreadD, val)
        if (val <= parseInt(web3Store.web3.utils.fromWei(totalSupply))) {
          return { x: val, buy: y, sell, reserved: sell };
        } 
        return { x: val, buy: y, sell };
      })
    }

    return (
      <>
        {
          data 
          ?
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{top: 20, right: 30, left: -10, bottom: 10 }} style={{ fontSize: '10px', color: 'black' }}>
                <CartesianGrid strokeDasharray="5 5" stroke="grey"/>
                <XAxis dataKey="x" type={ 'number' } domain={[0, 500]} tickCount={6}/>
                <YAxis/>
                <Tooltip/>
                <Area type='monotone' dataKey='buy' stackId="1" stroke={colors.SoftGreen} fill='none' />
                <Area type='monotone' dataKey='sell' stackId="2" stroke={colors.SoftBlue} fill='none' />
                <Area type='monotone' dataKey='reserved' stackId='3' stroke='none' fill={colors.SoftBlue}/>
              </AreaChart>
            </ResponsiveContainer>
          :
            <RingLoader/>
        }
      </>
    )
  }
}));

export default BondingCurve;
