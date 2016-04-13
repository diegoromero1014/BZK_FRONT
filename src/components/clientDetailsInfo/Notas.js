import React, {Component, PropTypes} from 'react';

class Notas extends Component{

  constructor(props){
    super(props);
  }

  render(){
    const {typeOfNoteKey} = this.props;
    const {note} = this.props;
    const {index} = this.props;
    return(
      <div>
        <h3 className="sub-header" style={{borderBottom: "solid 1px"}}>Nota {index}</h3>
        <table style={{width: "100%"}}>
            <thead>
              <tr>
                <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Tipo de nota</span></th>
                <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Descripción de la nota</span></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{width: "25%", verticalAlign: "initial"}}>{typeOfNoteKey}</td>
                <td style={{width: "75%", verticalAlign: "initial"}}>{note}</td>
              </tr>
            </tbody>
          </table>
      </div>
    );
  }
}

Notas.PropTypes = {
  typeOfNoteKey: PropTypes.object.isRequired,
  note: PropTypes.object.isRequired,
  index: PropTypes.object.isRequired
}

export default Notas;
