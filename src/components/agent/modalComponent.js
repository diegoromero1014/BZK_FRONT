import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid';
import { bindActionCreators } from 'redux';
import { changeValueActiveLog, consultValueActiveLog } from '../../actionsGlobal';
import _ from 'lodash';
import $ from 'jquery';

class ModalComponentAgent extends Component{
  constructor(props){
    super(props);
    this.state = {
      modalIsOpen: false,
      valueCheck: false
    };
    this._changeValueActiveTrazas = this._changeValueActiveTrazas.bind(this);
    this._clickButtonDownloadTraza = this._clickButtonDownloadTraza.bind(this);
  }

  componentWillMount(){
    const {consultValueActiveLog} = this.props;
    consultValueActiveLog().then((data) => {
      if( data ){
        $('.logs.checkbox').checkbox('set checked');
      }
      this.setState({
        valueCheck: data
      });
    });
  }

  _changeValueActiveTrazas(){
    const {changeValueActiveLog} = this.props;
    if( this.state.valueCheck ){
      $('.logs.checkbox').checkbox('set unchecked');
      changeValueActiveLog(false);
      this.setState({
        valueCheck: false
      });
    } else {
      changeValueActiveLog(true);
      this.setState({
        valueCheck: true
      });
    }
  }

  _clickButtonDownloadTraza(){
  }

  render(){
    return (
        <div className="modalBt4-body modal-body business-content editable-form-content clearfix" style={{overflowX:"hidden", marginBottom: '15px'}}>
          <Row style={{padding: "40px 20px 20px 20px"}}>
            <Col xs={12} md={12} lg={12} style={{textAlign: 'center'}}>
              <a className="item">
              <div className="ui logs toggle checkbox"
                ref={checkbox => {
                  $(checkbox).checkbox({
                    onChange: () => this._changeValueActiveTrazas()
                  });
                }}
              >
              <input type="checkbox" name="frequency"/>
                <label>Activar agentes</label>
              </div>
              </a>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={12} lg={12} style={{textAlign: 'center'}}>
              <button className="btn" type="submit" onClick={this._clickButtonDownloadTraza}>
                <span style={{color: "#FFFFFF", padding:"10px"}}>Descargar traza</span>
              </button>
            </Col>
          </Row>
        </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    changeValueActiveLog,
    consultValueActiveLog
  }, dispatch);
}

function mapStateToProps({clientInformacion}, ownerProps) {
  return {
    clientInformacion
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalComponentAgent);
