/**
 * Created by ahurtado on 11/28/2016.
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {groupFindServer} from './actions';
import GridComponent from '../../grid/component';
import {mapDataGrid} from './groupsFavoriteContactsUtilities';
import {NUMBER_RECORDS,MODAL_TITLE_EMAILS} from './constants';

class ListGroups extends Component {

    constructor(props) {
        super(props);
        this._renderHeaders = this._renderHeaders.bind(this);
    }


    _renderHeaders() {

        const headersTable = [
            {
                title: "",
                key: "actions"
            },
            {
                title: "Nombre grupo",
                key: "modalNameLink",
                showLink: true
            },
            {
                title: "Cantidad de contactos",
                key: "countContact"
            },
            {
                title: "",
                key: "delete"
            }
        ];

        return headersTable;
    }

    _renderCellView(data) {
        return mapDataGrid(data);
    }

    render() {
        const {groupsFavoriteContacts} = this.props;
        const data = groupsFavoriteContacts.get('responseGroup');
        return (
            <div className="horizontal-scroll-wrapper" style={{overflow: 'scroll', background: '#fff'}}>
                <GridComponent headers={this._renderHeaders} data={this._renderCellView(data)} modalTitle={MODAL_TITLE_EMAILS}/>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        groupFindServer
    }, dispatch);
}

function mapStateToProps({groupsFavoriteContacts}, ownerProps) {
    return {
        groupsFavoriteContacts
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListGroups);

