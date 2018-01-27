import React from 'react';
import ReactDOM from 'react-dom';
import {Table, Tr, Td, Button} from 'reactstrap';

export default function mem_start(root) {
  ReactDOM.render(<Memgrid />, root);
}

function loadTiles() {
  let tiles = ['A','B','C','D','E','F','G','H','A','B','C','D','E','F','G','H'];
  let index = tiles.length;
   for (let i = index - 1; i > 0; i--)
  {
    let randomIndex = Math.floor(Math.random()*i+1);
    let temp_var = tiles[i];
    tiles[i] = tiles[randomIndex];
    tiles[randomIndex] = temp_var;
  }
  return tiles;
}

const initialState = {
  OriginalTiles:loadTiles(),
  visible:['X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X'],
  open1:'',
  open1index : '',
  open2:'',
  open2index:'',
  Gap: false,
  score: 0
}

class Memgrid extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = initialState;
  }

  updateState(val, id){
    let arr =this.state.visible;
    //alert('clicked');
    let originalArr = this.state.OriginalTiles;
    console.log("before" + this.state.visible[id]);

    //this.setState({});
    console.log(this.state.visible[id]);
    if(this.state.open1 == '' || this.state.open2 == '')
    {
    if(this.state.visible[id] == 'X')
    {
      arr[id] = originalArr[id];
      console.log("entered");
    this.setState({visible: arr});
    if(this.state.open1=='' )
    {
      this.setState({open1:arr[id]});
      this.setState({open1index:id});
      this.setState({Gap:false});
    }
    else {
    if(this.state.open2=='')
    {
      this.setState({open2:arr[id]});
      this.setState({open2index:id});
      this.setState({Gap:true});
    }
  }
  }
}
}

  resetStateforOpen()
  {
    let count = this.state.score + 2
    this.setState({open1: '', open2: '', score:count});

  }
  resetState()
  {
    let arr = this.state.visible;
    let count = this.state.score - 1;

    console.log("before visible is");
    console.log(this.state.visible);
    arr[this.state.open1index] = 'X';
    arr[this.state.open2index] = 'X';
    this.setState({open1:'', open2: '', open1index:'',open2index:'', score: count, visible : arr, Gap:false});
    //this.state.Gap = false;
  }

  reset(){
    this.setState(initialState);
    this.setState({visible:['X','X','X','X','X','X','X','X','X','X','X','X','X','X','X','X']});
  }

  componentDidUpdate() {
    let open1  = this.state.open1;
    let open2 =  this.state.open2;
    if (open != '' && open2!='')
    {
      if(open1!=open2)
      {
        let b = document.getElementById("Board");
        b.className += " disabledc";
        this.interval = setTimeout(this.tick.bind(this), 1000);
        b.classList.remove("disabledc");
      }
      else {
        this.resetStateforOpen();
        alert('congo you got it, detective!!');
      }

    }

  }

  tick(){
    if(this.state.open1!='' && this.state.open2!='')
    {
    //console.log(b.className);
    this.resetState();
    console.log("i am back");

   clearInterval(this.interval);

   }

  }

  getClassNames(value){

    if(value=='X')
    {
      return "TileLayout unopened";
    }
    else
    {
      return "TileLayout opened";
    }

  }

  render()
  {
    let open1 = this.state.open1;
    let open2 = this.state.open2;
    let Tiles = this.state.visible;
    return(
  <div className="row">
  <div className="col-6">
  <div className="Board" id = "Board">
     { Tiles.map((each, i) => <Tile className = {this.getClassNames(each)} onClick={()=>{this.updateState(each, i)}} value={each} key={i}/>
  )}
  </div>
  </div>
  <div className="col-6">
  <Score value = {this.state.score} onClick = {() => {this.reset()}} />
  </div>
  </div>
)
}
}

function Tile(props) {
    return <div className={props.className} onClick = {props.onClick}><div>{props.value}</div></div>;
}
$(loadTiles);

function Score(props)
{
  return (<div className ="score">
  <h1> Score : {props.value}</h1><br />
  <Button className ="btn btn-primary" onClick = {props.onClick}>Reset Game </Button></div>

);
}
