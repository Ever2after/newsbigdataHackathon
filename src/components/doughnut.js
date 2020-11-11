import React, {Component} from 'react';
var Chart = require('chart.js');

class DoughnutChart extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidUpdate() {
    this.myChart.data.labels = this.props.data.news.map(d => d.title);
    this.myChart.data.datasets[0].data = this.props.data.news.map(d => d.impact_factor);
    this.myChart.data.datasets[0].backgroundColor = this.props.colors;
    this.myChart.update();
  }

  componentDidMount() {
    this.myChart = new Chart(this.canvasRef.current, {
      type: 'doughnut',
      options: {
          maintainAspectRatio: false
      },
      data: {
        labels: this.props.data.news.map(d => d.title),
        datasets: [{
          data: this.props.data.news.map(d => d.impact_factor),
          backgroundColor: this.props.colors
        }]
      }
    });

  }


  render() {
    return <canvas ref={this.canvasRef} />;
  }
}

export default DoughnutChart;
