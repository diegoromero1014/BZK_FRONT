import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NUMBER_RECORDS } from './constants';
import { redirectUrl } from '../globalComponents/actions';
import { validatePermissionsByModule } from '../../actionsGlobal';
import SearchBarContacts from './searchBarContacts';

class SearchContacts extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{width: '100%'}} >
                <Row style={{ marginTop: '15px', marginLeft: '10px' }} >
                    <SearchBarContacts />
                </Row>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({

    });
}

function mapStateToProps({ filterContactsReducer, selectsReducer, reducerGlobal }, { ownerProps }) {
    return {
        filterContactsReducer,
        selectsReducer,
        reducerGlobal
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchContacts);