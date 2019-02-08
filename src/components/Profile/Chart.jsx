import React from 'react';
import { inject, observer } from 'mobx-react';
import { RingLoader } from 'react-spinners';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// import {
//   CrossHair,
//   XAxis,
//   YAxis,
//   AreaSeries,
//   PatternLines,
//   HorizontalReferenceLine,
//   XYChart,
//   Brush,
// } from '@data-ui/xy-chart';

// const data = [
//   {x: 1, buy: 4000, sell: 2400},
//   {x: 2, buy: 3000, sell: 1398},
//   {x: 3, buy: 2000, sell: 9800},
//   {x: 4, buy: 2780, sell: 3908},
//   {x: 5, buy: 1890, sell: 4800},
//   {x: 6, buy: 2390, sell: 3800},
//   {x: 7, buy: 3490, sell: 4300},
// ];

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
        return { x: val, buy: y, sell, reserved: val <= parseInt(web3Store.web3.utils.fromWei(totalSupply)) ? sell : '' };
      })
    }

    return (
      <>
        {
          data 
          ?
            <AreaChart width={600} height={400} data={data} margin={{top: 10, right: 30, left: 0, bottom: 10}} style={{ fontSize: '10px' }}>
              <CartesianGrid strokeDasharray="5 5"/>
              <XAxis dataKey="x" type={ 'number' } domain={[0, 500]} tickCount={6}/>
              <YAxis/>
              <Tooltip/>
              <Area type='monotone' dataKey='buy' stackId="1" stroke='green' fill='none' />
              <Area type='monotone' dataKey='sell' stackId="2" stroke='red' fill='none' />
              <Area type='monotone' dataKey='reserved' stackId='3' stroke='red' fill='red'/>
            </AreaChart>
          :
            <RingLoader/>
        }
      </>
    )
  }
}));

export default BondingCurve;
