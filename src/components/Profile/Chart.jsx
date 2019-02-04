import React from 'react';
import { Chart, Geom, Axis, Tooltip, Legend, Coord } from 'bizcharts';

// 数据源
// const data = [
//   { genre: 'Sports', sold: 275, income: 2300 },
//   { genre: 'Strategy', sold: 115, income: 667 },
//   { genre: 'Action', sold: 120, income: 982 },
//   { genre: 'Shooter', sold: 350, income: 5271 },
//   { genre: 'Other', sold: 150, income: 3710 }
// ];

const data = [
  { x: 1, y: 1 },
  { x: 2, y: 4 },
  { x: 3, y: 8 },
  { x: 4, y: 12},
  { x: 5, y: 6 },
  { x: 6, y: 2 },
];

const cols = {
  x: { alias: 'supply' },
  y: { alias: 'price' },
};

const MyChart = () => (
  <Chart width={600} height={380} data={data} cols={cols} padding={"auto"}>
    <Axis />
    <Legend dy={-20}/>
    <Tooltip crosshairs/>
    <Geom type="area" position="x*y" color="green" shape="smooth" />
    <Geom
      type="line"
      position="x*y"
      color="green"
      shape="smooth"
      size={2}
    />
  </Chart>
);

export default MyChart;
