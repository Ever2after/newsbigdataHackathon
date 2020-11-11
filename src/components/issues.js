import React, {Component, createRef, useEffect} from 'react';
import Issue from './issue';

class Issues extends Component{
  constructor(props){
    super(props);
    this.state = {
      //
    }
  }
  render(){
    const {issues} = this.props;
    var list = [];
    issues.sort(function(a,b){
      if(a.startDate>b.startDate) return 1;
      if(a.startDate<b.startDate) return -1;
      return 0;
    })
    for(var i = 0;i<issues.length;i++){
      list.push(
        <Issue issue={issues[i]}/>
      )
    }
    return(
      <div className="issues">
        {list}
      </div>
    );
  }
}

export default Issues;
