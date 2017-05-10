import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';
import { redirectUrl } from '../../globalComponents/actions';

class ListClientsValidations extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { customerStory } = this.props;
        console.log('1', customerStory.get('listClientsDelivery'));
        console.log('1', customerStory.get('listClientsDelivery').size);
        console.log('1', customerStory.get('listClientsDelivery').length);
        return (
            <div className="tab-content break-word" style={{ padding: '16px', borderRadius: '3px', overflow: 'initial', position: 'initial' }}>
                {customerStory.get('listClientsDelivery').length > 0 ?
                    <div style={{ marginTop: '20px' }}>
                        <Col xs={12} md={12} lg={12}>
                        </Col>
                    </div>
                    :
                    <div>
                        <Col xs={12} md={12} lg={12}>
                            <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
                                <span className="form-item">No hay clientes para entregar</span>
                            </div>
                        </Col>
                    </div>
                }
            </div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({

    }, dispatch);
}

function mapStateToProps({ customerStory }, ownerProps) {
    return {
        customerStory
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListClientsValidations);