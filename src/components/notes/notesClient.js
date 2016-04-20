import React, {Component} from 'react';

class NotesClient extends Component{
  render(){
    return(
      {notes.map((note, index) =>
        <Col xs={12} md={12} lg={12} style={{marginLeft: "10px"}}>
          <h3 className="sub-header" style={{borderBottom: "solid 1px"}}>Dirección sede principal</h3>
        </Col>
        <Col xs={12} md={3} lg={3} style={{marginTop: "15px"}}>
          <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
            <dt><span>Tipo de notesAdd(</span><span style={{color: "red"}}>*</span>)</dt>
            <input
              type="text"
              style={{height: "22px !important", minHeight: "26px !important", width: "100%"}}
            />
          </div>
        </Col>
        <Col xs={12} md={9} lg={9} style={{marginTop: "15px"}}>
          <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
            <dt><span>Descripción de la nota(</span><span style={{color: "red"}}>*</span>)</dt>
            <input
              type="text"
              style={{height: "22px !important", minHeight: "26px !important", width: "100%"}}
            />
          </div>
        </Col>
        //<Note
          //updateValue={this.updateValue.bind(this, index, 'body')}
          //body={note.body}
          //combo={note.combo}
          //key={index}
          //index={index}
          ///>)
      }
    );
  }
}

export default NotesClient;
