import React, {createRef, useEffect, Component} from 'react';

class Timebar extends Component{
  constructor(props) {
      super(props);
      this.canvasRef = React.createRef();
    }

  ComponentDidMount = ()=>{
    var canvas = this.canvasRef.current;
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#616161';
    ctx.fillRect(canvas.width*0.55-5, 0, 10, 30);
  }
  componentDidUpdate() {
    var canvas = this.canvasRef.current;
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#616161';
    ctx.fillRect(canvas.width*0.55-5, 0, 10, 30);
  }
  render(){
    return (
      <>
        <canvas ref={this.canvasRef} width="400" height="30"/>
      </>
    )
  }
}




export default Timebar;
