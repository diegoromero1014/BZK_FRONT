import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Row, Col} from 'react-flexbox-grid';
import { bindActionCreators } from 'redux';
import { Menu, Segment } from 'semantic-ui-react';
import { TAB_STORY, TAB_CUSTOMER_DELIVERY } from './constants';
import { updateTabSeletedCS } from './actions';
import ComponentCustomerDelivery from './customerDelivery/componentCustomerDelivery';

class ComponentCustomerStory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            viewStory: true,
            viewCustomerDelivery: false
        };
    }

    _handleItemClick(module) {
        const { updateTabSeletedCS } = this.props;
        updateTabSeletedCS(module);
    }

    render() {
        const { clientInformacion, customerStory, infoClient } = this.props;
        const { deleveryClient, expectedCelulaId, expectedCelulaName } = clientInformacion.get("responseClientInfo");
        var tabActive = customerStory.get('tabSelected');
        if (tabActive === null || tabActive === undefined || tabActive === "") {
            tabActive = TAB_STORY;
        }
        return (
            <div>
                {!_.isNull(expectedCelulaId) && !_.isUndefined(expectedCelulaId) &&
                    <Row  style={{ marginTop: '9px', paddingTop: '15px' }}>
                        <Col xs={12} md={6} lg={4}>
                            <span style={{ fontWeight: 'bold', color: '#EB984E' }}>Cliente pendiente de aprobación para la célula {expectedCelulaName}</span>
                        </Col>
                        { deleveryClient &&
                            < Col xs={12} md={6} lg={4} >
                                <span style={{ fontWeight: 'bold', color: '#EB984E' }}>ComboBox</span>
                            </Col>
                        }
                    </Row>
                }
                <div className="tab-pane quickZoomIn animated"
                    style={{ width: "100%", marginTop: "10px", marginBottom: "70px" }}>
                    <Menu pointing secondary>
                        <Menu.Item name="Historial" active={tabActive === TAB_STORY} onClick={this._handleItemClick.bind(this, TAB_STORY)} />
                        <Menu.Item name="Entrega clientes" active={tabActive === TAB_CUSTOMER_DELIVERY} onClick={this._handleItemClick.bind(this, TAB_CUSTOMER_DELIVERY)} />
                    </Menu>
                    <Segment>
                        {tabActive === TAB_STORY && <span>Holaaaaaaaaaa 1</span>}
                        {tabActive === TAB_CUSTOMER_DELIVERY && <ComponentCustomerDelivery />}
                    </Segment>
                </div>
            </div >
        );
    }

}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateTabSeletedCS
    }, dispatch);
}

function mapStateToProps({ navBar, customerStory, clientInformacion }, ownerProps) {
    return {
        navBar,
        customerStory,
        clientInformacion
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentCustomerStory);