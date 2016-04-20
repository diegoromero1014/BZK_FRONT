import React,{Component,PropTypes} from 'react';

class ButtonDeleteComponent extends Component{

  constructor(props){
      super(props);
  }

    render(){
      return (<td style={{padding: '10px', textAlign: 'center'}}><button className="btn btn-sm  btn-danger">
          <span className="icon icon-delete">
          </span>
        </button></td>);
    }
}


export default ButtonDeleteComponent;
