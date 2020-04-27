import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid';
import { bindActionCreators } from 'redux';
import { changeValueActiveLog, consultValueActiveLog } from '../../actionsGlobal';
import $ from 'jquery';

export class ModalComponentAgent extends Component{
  constructor(props){
    super(props);
    this.state = {
      modalIsOpen: false,
      valueCheck: false
    };
    this.changeValueActiveTrazas = this.changeValueActiveTrazas.bind(this);
    this.clickButtonDownloadTraza = this.clickButtonDownloadTraza.bind(this);
  }

  componentWillMount(){
    const { dispatchConsultValueActiveLog } = this.props;
    dispatchConsultValueActiveLog().then((data) => {
      if( data ){
        $('.logs.checkbox').checkbox('set checked');
      }
      this.setState({
        valueCheck: data
      });
    });
  }

  changeValueActiveTrazas = () => {
    const { dispatchChangeValueActiveLog } = this.props;
    if( this.state.valueCheck ){
      $('.logs.checkbox').checkbox('set unchecked');
      dispatchChangeValueActiveLog(false);
      this.setState({
        valueCheck: false
      });
    } else {
      dispatchChangeValueActiveLog(true);
      this.setState({
        valueCheck: true
      });
    }
  }

  clickButtonDownloadTraza = () => {
    // Noop
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
                    onChange: () => this.changeValueActiveTrazas()
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
              <button className="btn" type="submit" onClick={this.clickButtonDownloadTraza}>
                <span style={{color: "#FFFFFF", padding:"10px"}}>Descargar traza</span>
              </button>
            </Col>
          </Row>
        </div>
    )
  };
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    dispatchChangeValueActiveLog: changeValueActiveLog,
    dispatchConsultValueActiveLog: consultValueActiveLog
  }, dispatch);
}

const mapStateToProps = ({clientInformacion}) => {
  return {
    clientInformacion
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalComponentAgent);
