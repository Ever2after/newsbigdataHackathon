import React, {Component} from 'react';
import { Route, Link } from 'react-router-dom';
import LineChart from './line';
import BarChart from './bar';
import DoughnutChart from './doughnut';
import Issues from './issues';
import Issue from './issue';
import Timebar from './timebar';
import './css/graph.css';
import stockList from './stocklist.json';
var request = require('request');
const moment = require('moment-timezone');


class Graph extends Component{
  constructor(props){
    super(props);
    this.state = {
      data : getData(),
      stockData : {title : '', data:[{time : '', value:''}]},
      issues : getIssues(100),
      stockObj : null,
      stock : '',
      interval : 3, // 1:3month, 2 : 6month, 3:2year
      issueNum : 0,
      newsNum : 0,
      graphType : "doughnut",
    }
  }
  componentDidMount = ()=> {

  }
  onChange = e=>{
    this.setState({
      [e.target.name] : e.target.value,
    })
  }
  onClick = e=>{
    e.preventDefault();
    this.getData2();
  }
  onClick2 = (interval)=>{
    this.setState({
      interval : interval,
    })
  }
  onClick3 = (e,issueNum)=>{
    this.setState({
      issueNum : issueNum,
      newsNum : 0,
      graphType : "doughnut",
    })
    var previous = document.getElementsByClassName('checked')[0];
    if(previous) previous.classList.remove('checked');
    e.target.classList.add('checked');
    var target = document.getElementsByClassName('open')[0];
    if(target) target.classList.remove('open');
  }
  onClick4 = (e, num)=>{
    var target = e.target.parentNode;
    if(target.classList.contains('open')) {
      target.classList.remove('open');
      this.setState({
        graphType : "doughnut",
      })
      return;
    }
    var previous = document.getElementsByClassName('open')[0];
    if(previous) previous.classList.remove('open');
    e.target.parentNode.classList.add('open');
    this.setState({
      newsNum : num,
      graphType : "line",
    })
  }
  dateToInteger = dateStr=>{
    return new Date(dateStr).getTime()/1000;
  }
  getStockObj = (stock)=>{
    stock = stock.replace(/(\s*)/g, "");
    stock = stock.toUpperCase();
    for(var i=0;i<stockList.length;i++){
      if(stock && stockList[i].symbol.includes(stock)){
        this.setState({
          stockObj : stockList[i],
        })
        return stockList[i];
      }
    }
    alert('검색 결과가 없습니다. 종목명을 다시 확인해주세요');
    return false;
  }
  getStockCode = (stockObj)=>{
    var code = stockObj.code.toString();
    var n = 6-code.length;
    for(var i=0;i<n;i++){
      code = '0'+code;
    }
    code = code+'.KS';
    return code;
  }
  getData2 = ()=>{
    const stockObj = this.getStockObj(this.state.stock);
    var symbol;
    if(stockObj) symbol = this.getStockCode(stockObj);
    else return;
    const period2 = parseInt(new Date().getTime()/1000);
    const period1 = parseInt(new Date().getTime()/1000)-24*3600*364*2;
    var options = {
      method: 'GET',
      url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-chart',
      qs: {
        period2: period2,
        period1: period1,
        region: 'US',
        interval: '1d',
        symbol: symbol,
      },
      headers: {
        'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
        'x-rapidapi-key': '9325331d5bmsh33930b2c32b6d91p198e83jsn48c057cba207',
        useQueryString: true
      }
    };

    request(options, function (error, response, body) {
    	if (error) throw new Error(error);
      body = JSON.parse(body);
      const result = body.chart.result[0];
      var data={title : 'stock', data:[]};
      for(var i=0;i<result.timestamp.length;i++){
        data.data.push({
          time : new Date(result.timestamp[i]*1000),
          value : result.indicators.quote[0].close[i]
        });
      }
      this.setState({
        stockData : data,
      })
    }.bind(this));

    fetch('/issues/company/'+stockObj.symbol)
    .then(res=>res.json())
    .then(data1=>{
      console.log(data1);
      if(data1.error) {
        alert('DB에 아직 포함되지 않은 종목입니다');
      }
      else{
        this.setState({
          issues : data1,
          issueNum : 0,
          newsNum : 0,
          graphType : "doughnut",
        })
      }
    });
  }

  render(){
    var issues=[];
    var _issues = this.state.issues;
    _issues.sort(function(a,b){
      if(a.endDate>b.endDate) return -1;
      if(a.endDate<b.endDate) return 1;
      return 0;
    })
    for(var i=0;i<_issues.length;i++){
      const num = i;
      issues.push(<div className="issue" onClick={(e)=>this.onClick3(e, num)}>{_issues[i].keywords}</div>);
    }

    var newsList = [];
    const issue = _issues[this.state.issueNum];
    issue.news.sort(function(a,b){
      if(a.published_at>b.published_at) return -1;
      if(a.published_at<b.published_at) return 1;
      return 0;
    })
    for(var i=0;i<issue.news.length;i++){
      var time = moment.tz(issue.news[i].published_at, 'Asia/Seoul').format('YYYY-MM-DD');
      const num = i;
      newsList.push(
        <div className="newsblock">
          <p onClick={(e)=>this.onClick4(e,num)} className="newstitle">{issue.news[i].title} | {time}</p>
          <p className="newshilight">{issue.news[i].hilight}</p>
        </div>
      )
    }

    var stockDatas = [[],[],[]];
    var stockData = [];
    var intervals = [];
    intervals.push(24*3600*91*1000); //3m
    intervals.push(24*3600*61*3*1000);  //6m
    var cnt=0;
    var _stockData = this.state.stockData.data.slice();

    for(var i=_stockData.length-1;i>-1 && _stockData[i]!==undefined;i--){
        if(_stockData[i].time< new Date(new Date().getTime()-intervals[cnt])){
          stockDatas[cnt] = _stockData.slice(i,_stockData.length-1);
          cnt+=1;
          if(cnt==2) stockDatas[cnt] = _stockData.slice();
        }
    }

    var interval = this.state.interval;
    stockData = interval==1 ? stockDatas[0] : (interval==2 ? stockDatas[1] : stockDatas[2]);

    return(
      <div className="App">

        <label className="mainlabel">StockLife</label>
        <div className="interface1">
          <label>종목 명</label>
          <input type="text" onChange={this.onChange} name="stock"/>
          <button type="submit" onClick={this.getData2}>검색</button>
        </div>

        <div className="info1">
        {this.state.stockObj ? <>
          <div className="info1_main">
            <label>{this.state.stockObj.symbol} ({this.getStockCode(this.state.stockObj)})</label>

          </div>
          <div className="info1_sub">
            <label>{comma(this.state.stockData.data[this.state.stockData.data.length-1].value)}(KRW)</label>
            <span> | </span>
            <label>{this.state.stockObj.area}</label>
          </div>
          </> : <></>}
        </div>

        <div className="interface2">
          <button onClick={()=>this.onClick2(1)}>최근 3개월</button>
          <button onClick={()=>this.onClick2(2)}>최근 6개월</button>
          <button onClick={()=>this.onClick2(3)}>최근 2년</button>
        </div>

        <div className='main'>
          <LineChart
              data={stockData}
              title={this.state.stockData.title}
              color="#3E517A"
              type="main"
          />
          <div className="issues">
            {issues}
          </div>
        </div>

        <div className="sub">
          <div className="sub1">
          {this.state.issues[0]!==undefined ?
          <Issue issue={issue} newsNum={this.state.newsNum} type={this.state.interval} />
           : <></>}
            <div className="newslist">
              {newsList}
            </div>
          </div>

          <div className="sub2">
          {this.state.graphType==="doughnut" ?
            <DoughnutChart
              data={this.state.issues[this.state.issueNum]}
              title={this.state.stockData.title}
              colors={getRandomColorSets(this.state.issues[this.state.issueNum].news.length, 0.2)}
            /> :
            <><LineChart
              data = {this.state.stockData.data}
              title={this.state.stockData.title}
              color="#3E517A"
              type="sub"
              news={issue.news[this.state.newsNum]}
              /></>
             }
          </div>
        </div>

      </div>
    )
  }
}

function getRandomColorSets(n, factor){
  var set = [];
  var main1 = factor/2+Math.random()*(1-factor);
  var main2 = factor/2+Math.random()*(1-factor);
  var main3 = factor/2+Math.random()*(1-factor);
  for(var i=0;i<n;i++){
    set.push(getRandomColor(main1, main2, main3, factor));
  }
  return set;
}

function getRandomColor(main1, main2, main3, factor) {
  var color = '#';
  var sub1 = main1+factor*(0.5-Math.random())
  var sub2 = main2+factor*(0.5-Math.random())
  var sub3 = main3+factor*(0.5-Math.random())
  color+= (sub1*0xFF<<0).toString(16);
  color+= (sub2*0xFF<<0).toString(16);
  color+= (sub3*0xFF<<0).toString(16);
  return color;
}

function comma(num){
    var len, point, str;

    num = num + "";
    point = num.length % 3 ;
    len = num.length;

    str = num.substring(0, point);
    while (point < len) {
        if (str != "") str += ",";
        str += num.substring(point, point + 3);
        point += 3;
    }
    return str;
}

function getIssues(n) {
  var issues = [];
  for(var i=0;i<n;i++){
    issues.push(getIssue());
  }
  return issues;
}

function getIssue(){
  var issue={
    keywords : "",
    news : [],
    startDate : null,
    endDate : null,
  }

  issue.keywords=(getRandomString(Math.floor(Math.random()*5+3)));

  var startDate = getRandomDate('2018-10-10', '2020-10-10');
  var endDate = getRandomDate('2018-10-10', '2020-10-10');
  if(startDate>endDate) {
    var temp = startDate;
    startDate = endDate;
    endDate = temp;
  }
  for(var i=0;i<Math.floor(Math.random()*10+5);i++){
    issue.news.push(getNews(startDate, endDate));
  }
  issue.startDate = startDate;
  issue.endDate = endDate;
  return issue;
}

function getNews(start, end){
  var news = {
    title : getRandomString(Math.floor(Math.random()*20)),
    hilight : getRandomString(Math.floor(Math.random()*300)),
    published_at : new Date(getRandomDate(start, end)),
    impact_factor : Math.floor(Math.random()*5),
  }
  return news;
}

function getRandomDate(start, end){
  const time = new Date(start).getTime()+Math.floor((new Date(end).getTime()-new Date(start).getTime())*Math.random());
  return new Date(time);
}

function getRandomString(n){
  var result='';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ';
  for(var i=0;i<n;i++){
    result+=characters.charAt(Math.floor(Math.random()*characters.length));
  }
  return result;
}

//--------------------------------------

function getData() {
  let data = [];

  data.push({
    title: 'Stocks',
    data: getRandomDateArray(150)
  });

  data.push({
    title: 'Categories',
    data: getRandomArray(20)
  });

  data.push({
    title: 'Categories',
    data: getRandomArray(10)
  });

  data.push({
    title: 'Data 4',
    data: getRandomArray(6)
  });

  return data;
}

// Data generation
function getRandomArray(numItems) {
  // Create random array of objects
  let names = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let data = [];
  for(var i = 0; i < numItems; i++) {
    data.push({
      label: names[i],
      value: Math.round(20 + 80 * Math.random())
    });
  }
  return data;
}

function getRandomDateArray(numItems) {
  // Create random array of objects (with date)
  let data = [];
  let baseTime = new Date('2018-05-01T00:00:00').getTime();
  let dayMs = 2 * 60 * 60 * 1000; //ms기준 24h
  for(var i = 0; i < numItems; i++) {
    data.push({
      time: new Date(baseTime + i * dayMs),
      value: Math.round(20 + 80 * Math.random())
    });
  }
  return data;
}

export default Graph;
