import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {clearArea} from './actions';
import ListArea from './listArea';

class AreaBusiness extends Component{

  constructor(props) {
    super(props);
  }

  componentWillMount(){
    const{clearArea} = this.props;
    clearArea();
  }

  render(){
    const {areas,disabled} = this.props;
    return(
      <div className="my-custom-tab"
        style={{backgroundColor: "#FFFFFF",  width: "100%"}}>
        <Row style={{padding: "20px 23px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"100%", marginBottom:"10px"}}/>
                <i className="tasks icon" style={{fontSize: "18px"}}/>
              <span style={{fontSize: "20px"}}>Áreas internas aliadas </span>
            </div>
          </Col>
        </Row>
        <Row style={{padding: "0px 23px 10px 20px"}}>
          <Col xs>
         <ListArea disabled={disabled}/>
          </Col>
        </Row>
      </div>
    );
  }

}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    clearArea
  }, dispatch);
}

function mapStateToProps({areas}, ownerProps){
    return {
      areas
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AreaBusiness);
