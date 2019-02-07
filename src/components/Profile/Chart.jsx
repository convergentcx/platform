import React from 'react';
import { Chart, Geom, Axis, Tooltip, Legend, Coord } from 'bizcharts';
import { inject, observer } from 'mobx-react';
import { RingLoader } from 'react-spinners';

import { toDecimal } from '../../lib/util';

const cols = {
  x: { alias: 'supply' },
  y: { alias: 'price' },
};

const BondingCurve = inject('web3Store')(observer(class BondingCurve extends React.Component {
  render() {
    const { address, web3Store } = this.props;

    let data = null;
    if (web3Store.betaCache.has(address)) {
      const { poly, price, supply } = web3Store.betaCache.get(address);
      const { utils } = web3Store.web3;
      console.log(price)
      data = [...Array(10).keys()].map((key) => {
        return { x: key.toString(), y: utils.fromWei(poly.y(toDecimal(utils.toWei(key.toString()))).toString()) };
      })
    }

    return (
      <>
        {
          data 
          ?
            <Chart width={600} height={380} data={data} cols={cols} padding={"auto"}>
              <Axis />
              <Legend dy={-20}/>
              <Tooltip/>
              <Geom type="area" position="x*y" color="green" shape="smooth" />
              <Geom
                type="line"
                position="x*y"
                color="green"
                shape="smooth"
                size={2}
              />
            </Chart>
          :
            <RingLoader/>
        }
      </>
    )
  }
}));

export default BondingCurve;
