import React, {Component} from 'react';
var Chart = require('chart.js');

class LineChart extends Component {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
  }
  update = ()=>{
    if(this.props.type==="sub"&& this.props.news){
      var data = this.props.data.slice();
      var data4map = [];

      var startDate = new Date(this.props.news.published_at).getTime()-7*24*3600*1000;
      startDate = new Date(startDate);
      var endDate = new Date(this.props.news.published_at).getTime()+7*24*3600*1000;
      endDate = new Date(endDate);

      for(var i=0;i<data.length;i++){
        if(data[i].time <endDate && startDate<data[i].time){
          data4map.push(data[i]);
        }
      }
      this.myChart.data.labels = data4map.map(d => d.time);
      this.myChart.data.datasets[0].data = data4map.map(d => d.value);
    }else{
      this.myChart.data.labels = this.props.data.map(d => d.time);
      this.myChart.data.datasets[0].data = this.props.data.map(d => d.value);
    }
  }
  componentDidUpdate() {
    this.update();

    this.myChart.update();
  }

  componentDidMount() {
    var data4map = [];
    if(this.props.type==="sub"&& this.props.news){
      var data = this.props.data.slice();

      var startDate = new Date(this.props.news.published_at).getTime()-7*24*3600*1000;
      startDate = new Date(startDate);
      var endDate = new Date(this.props.news.published_at).getTime()+7*24*3600*1000;
      endDate = new Date(endDate);
      for(var i=0;i<data.length;i++){
        if(data[i].time<endDate && startDate<data[i].time){
          data4map.push(data[i]);
        }
      }
    }else{
      data4map = this.props.data.slice();
    }

    this.myChart = new Chart(this.chartRef.current, {
      type: 'line',
      options: {
        maintainAspectRatio : false,
        scales: {
          xAxes: [{
              type: 'time',
              time: {
                unit: this.props.type==='main' ? 'month' : 'day'  //hour, day, week, month
              }
            }],
          yAxes: [{
              ticks: {
              }
            }]
        },
      },
      data: {
        labels: data4map.map(d => d.time),
        datasets: [{
          label: this.props.title,
          data: data4map.map(d => d.value),
          fill: 'none',
          backgroundColor: this.props.color,
          pointRadius: this.props.type==='main' ? 0 : 2,
          borderColor: this.props.color,
          borderWidth: 2,
          lineTension: 0
        }]
      }
    });
  }

  render() {
    return <canvas ref={this.chartRef} />;
  }
}

export default LineChart;
