import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';
import { Icon } from 'semantic-ui-react';

import { updateTitleNavBar } from '../navBar/actions';

import { MESSAGE_CONFIDENTIAl } from './constants';

export class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  componentWillMount() {
    const { dispatchUpdateTitleNavBar } = this.props;
    dispatchUpdateTitleNavBar("Dashboard");
  }

  render() {
    const name = "Nombre Ejemplo";

    return (
        <div className="ui segment" style={{ marginTop: '-2px' }}>  
            <div style={{ textAlign: "center", padding: "1.2em 2em 0 2em", color: "#7f7f7f" }}>
                <span style={{ fontStyle: "italic" }}>{MESSAGE_CONFIDENTIAl}</span>
            </div>
            <Row>
                <Col md={3}>
                    <div style={{ marginLeft: '50px', marginTop: 30, fontSize: 20 }}>
                        Bienvenido {name}
                    </div>
                </Col>
                <Col mdOffset={7} md={2} >
                  <Icon name={'cog'} />
                </Col>
            </Row>
        </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    dispatchUpdateTitleNavBar: updateTitleNavBar
  }, dispatch);
}

function mapStateToProps({ }, ownerProps) {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
