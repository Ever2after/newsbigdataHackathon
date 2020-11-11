import React, {Component} from 'react';
import { Route, Switch, Link } from 'react-router-dom';

import Graph from './components/graph';

class App extends Component{
  render(){   //props, state 값이 변경될때마다 호출
      return (
        <div className="App">
          <Graph/>
        </div>
      );
  }
}

export default App;
