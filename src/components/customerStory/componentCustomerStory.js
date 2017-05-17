import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Menu, Segment } from 'semantic-ui-react';
import { TAB_STORY, TAB_CUSTOMER_DELIVERY } from './constants';
import { updateTabSeletedCS } from './actions';
import ComponentCustomerDelivery from './customerDelivery/componentCustomerDelivery';
import StructuredDelivery from './structuredDelivery/componentStructuredDelivery';

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
        const { customerStory } = this.props;
        var tabActive = customerStory.get('tabSelected');
        if (tabActive === null || tabActive === undefined || tabActive === "") {
            tabActive = TAB_STORY;
        }
        return (
            <div className="tab-pane quickZoomIn animated"
                style={{ width: "100%", marginTop: "10px", marginBottom: "70px", paddingTop: "20px" }}>
                <Menu pointing secondary>
                    <Menu.Item name="Historial" active={tabActive === TAB_STORY} onClick={this._handleItemClick.bind(this, TAB_STORY)} />
                    <Menu.Item name="Entrega clientes" active={tabActive === TAB_CUSTOMER_DELIVERY} onClick={this._handleItemClick.bind(this, TAB_CUSTOMER_DELIVERY)} />
                </Menu>
                <Segment>
                    {tabActive === TAB_STORY && <StructuredDelivery />}
                    {tabActive === TAB_CUSTOMER_DELIVERY && <ComponentCustomerDelivery />}
                </Segment>
            </div>
        );
    }

}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateTabSeletedCS
    }, dispatch);
}

function mapStateToProps({ navBar, customerStory }, ownerProps) {
    return {
        navBar,
        customerStory
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentCustomerStory);