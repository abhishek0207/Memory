import React from 'react';
import ReactDOM from 'react-dom';
import {Table, Tr, Td, Button} from 'reactstrap';

export default function mem_start(root, channel) {
  ReactDOM.render(<Memgrid channel = {channel} />, root);
}

const exinitialState = {
  OriginalTiles:[],
  visible:[],
  open1:'',
  open1index : '',
  open2:'',
  open2index:'',
  Gap: false,
  score: 0,
  clicks : 0

}

class Memgrid extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = exinitialState;
    this.channel = props.channel;
    this.channel.join()
              .receive("ok" , this.gotView.bind(this))
              .receive("error", resp => { console.log("Unable to join", resp) })

  }

  componentDidUpdate() {
    console.log("entered update handler")
    let open1 = this.state.open1
    let open2 = this.state.open2
    let open1index = this.state.open1index
    let open2index = this.state.open2index
    let score =this.state.score

    if(open1!="" && open2!= "") {
      if(open1!=open2)
      {
        let b = document.getElementById("Board");
        b.className += " disabledc";
        this.interval = setTimeout(this.tick.bind(this), 1000);
        document.getElementById("clickStatus").innerHTML = "Try Again! :("
      }

      if(open1==open2)
      {
      document.getElementById("clickStatus").innerHTML = "Good Move!! Keep Going"
      }

      if(this.state.visible.indexOf("X") == -1) {
        document.getElementById("clickStatus").innerHTML = "Congrats!!! You are the champ!! :D :D"
      }

    }

  }


  tick(){
    let open1 = this.state.open1
    let open2 = this.state.open2
    let open1index = this.state.open1index
    let open2index = this.state.open2index
    let b = document.getElementById("Board");
    this.channel.push("handleupdates", {open1: open1, open2:open2, open1index: open1index, open2index:open2index})
                .receive("ok", this.gotView.bind(this))
                clearInterval(this.interval);
    b.classList.remove("disabledc");
   }

  gotView(view) {
    this.setState(view.newState)
  }

  clickHandler(value, index)
  {
    this.channel.push("clicked", {number: index, letter:value })
                .receive("ok", this.gotView.bind(this))
  }

  reset(){
    this.channel.push("reset", {})
                .receive("ok", this.gotView.bind(this))
    document.getElementById("clickStatus").innerHTML = "Game Started Again!!"
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
  <div className="col-sm-6">
  <div className="Board" id = "Board">
     { Tiles.map((each, i) => <Tile className = {this.getClassNames(each)} onClick = {this.clickHandler.bind(this, each, i)}  value={each} key={i}/>
  )}
  </div>
  </div>
  <div className="col-sm-6">
  <Score value = {this.state.score} onClick = {this. reset.bind(this)}  Clicks = {this.state.clicks} />
  </div>
  </div>
)
}
}

function Tile(props) {
    return <div className={props.className} onClick = {props.onClick}><div>{props.value}</div></div>;
}

function Score(props)
{
  return (<div className ="score">
  <h1> Score : {props.value}</h1><br />
  <Button className ="btn btn-primary" onClick = {props.onClick}>Reset Game </Button><br />
  <strong>Number of Clicks : {props.Clicks} </strong>
  <div id="clickStatus"></div></div>

);
}
