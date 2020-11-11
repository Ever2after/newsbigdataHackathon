import React, {createRef, useEffect, Component} from 'react';

class Issue extends Component{
  constructor(props) {
      super(props);
      this.canvasRef = React.createRef();
    }

  ComponentDidMount = ()=>{
  }
  componentDidUpdate() {
    var canvas = this.canvasRef.current;
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#E0E0E0';
    var startPos = dateToInteger(this.props.issue.startDate, this.props.type);
    startPos = Math.max(startPos,0);
    var width = dateToInteger(this.props.issue.endDate, this.props.type)-startPos;
    width = Math.max(width, 0);
    ctx.fillRect(35+(1000-35)*startPos,0, (1000-35)*width ,30);

    var news = this.props.issue.news[this.props.newsNum];
    var newsPos = Math.max(dateToInteger(news.published_at, this.props.type),0);
    ctx.fillStyle = '#616161';
    ctx.fillRect(35+(newsPos===0 ? 0 : (1000-35)*newsPos-5), 0 , newsPos===0? 0 : 10, 30);
  }
  render(){
    return (
      <>
        <canvas ref={this.canvasRef} width="1000" height="30"/>
      </>
    )
  }
}



function dateToInteger(dateStr, type){
  var maxTime;
  if(type===1) maxTime = 91*24*3600*1000;
  else if(type===2) maxTime = 61*3*24*3600*1000;
  else maxTime = 2*364*24*3600*1000;
  return (new Date(dateStr).getTime()-new Date().getTime()+maxTime)/(maxTime);
}

export default Issue;
