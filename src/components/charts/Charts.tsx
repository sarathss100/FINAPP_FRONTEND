import React from 'react';
import Chart from 'react-apexcharts';

const MyChart = () => {
  // Define chart options and serie
    
    const chartOptions1 = {
    chart: {
      height: 350,
      type: 'line',
    },
    stroke: {
      width: [0, 4], // Width for each series (column and line)
    },
    title: {
      text: 'Traffic Sources',
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1], // Enable data labels only for the second series (line)
    },
    labels: [
      '01 Jan 2001',
      '02 Jan 2001',
      '03 Jan 2001',
      '04 Jan 2001',
      '05 Jan 2001',
      '06 Jan 2001',
      '07 Jan 2001',
      '08 Jan 2001',
      '09 Jan 2001',
      '10 Jan 2001',
      '11 Jan 2001',
      '12 Jan 2001',
    ],
    yaxis: [
      {
        title: {
          text: 'Website Blog',
        },
      },
      {
        opposite: true, // Place this axis on the opposite side
        title: {
          text: 'Social Media',
        },
      },
    ],
  };

  const chartSeries1 = [
    {
      name: 'Website Blog',
      type: 'column', // Column chart
      data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160],
    },
    {
      name: 'Social Media',
      type: 'line', // Line chart
      data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16],
    },
  ];

  return (
    <div className="chart-container">
      <h2>ApexCharts Example</h2>
          <Chart options={chartOptions1} series={chartSeries1} type="line" width="100%" />
    </div>
  );
};

export default MyChart;
