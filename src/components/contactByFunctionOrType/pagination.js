/**
 * Created by ahurtado on 12/06/2016.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showLoading} from '../loading/actions';
import {contactsByFunctionOrTypeFindServer , changePage} from './actions';
import {NUMBER_RECORDS} from './constants';
import {has} from 'lodash';

class Pagination extends Component{

    _handlePagination(page){
        const {contactsByFunctionOrTypeFindServer,changePage,contactsByFunctionOrType,showLoading} = this.props;
        changePage(page);
        const idFunction = contactsByFunctionOrType.get('idFunction');
        const idTypeContact = contactsByFunctionOrType.get('idType');
        const idPosition = contactsByFunctionOrType.get('idPosition');
        const idDependency = contactsByFunctionOrType.get('idDependency');
        const order = contactsByFunctionOrType.get('order');
        const columnOrder = contactsByFunctionOrType.get('columnOrder');

        showLoading(true, 'Cargando..');
        contactsByFunctionOrTypeFindServer(idFunction, idTypeContact, idPosition, idDependency, page, NUMBER_RECORDS, order, columnOrder).then((data) => {
            if (has(data, 'payload.data')) {
                showLoading(false, null);
            }
        });
    }

    render(){
        const {contactsByFunctionOrType} = this.props;
        var page = contactsByFunctionOrType.get('pageNum');
        var firstPage = 1;
        if(page > 7){
            firstPage = page - 6;
        }
        var countContacts = contactsByFunctionOrType.get('totalContactsFiltered');
        var lastPage = Math.ceil(countContacts / NUMBER_RECORDS);
        return (
            <div>
                {countContacts > NUMBER_RECORDS ?
                    <div style={{borderTop:"2px solid #D9DEDF", width:"100%", paddingTop: "15px", paddingBottom:"15px", backgroundColor: '#FFF'}}>
                        <div style={{textAlign:"center"}} >
                            <ul className="pagination">
                                {page !== 1 ? <li onClick={() => {this._handlePagination(page - 1)}}><a>«</a></li> :"" }
                                {firstPage <= lastPage ?
                                    <li><a className={page === firstPage ? "active" :"" } onClick={() => {this._handlePagination(firstPage)}}>{firstPage}</a></li>
                                    : ''}
                                {firstPage + 1 <= lastPage ?
                                    <li><a className={page === firstPage + 1 ? "active" :"" } onClick={() => {this._handlePagination(firstPage + 1)}}>{firstPage + 1}</a></li>
                                    : ''}
                                {firstPage + 2 <= lastPage ?
                                    <li><a className={page === firstPage + 2 ? "active" :"" } onClick={() => {this._handlePagination(firstPage + 2 )}}>{firstPage + 2}</a></li>
                                    : ''}
                                {firstPage + 3 <= lastPage ?
                                    <li><a className={page === firstPage + 3 ? "active" :"" } onClick={() => {this._handlePagination(firstPage + 3)}}>{firstPage + 3}</a></li>
                                    : ''}
                                {firstPage + 4 <= lastPage ?
                                    <li><a className={page === firstPage + 4 ? "active" :"" } onClick={() => {this._handlePagination(firstPage + 4)}}>{firstPage + 4}</a></li>
                                    : ''}
                                {firstPage + 5 <= lastPage ?
                                    <li><a className={page === firstPage + 5 ? "active" :"" } onClick={() => {this._handlePagination(firstPage + 5)}}>{firstPage + 5}</a></li>
                                    : ''}
                                {firstPage + 6 <= lastPage ?
                                    <li><a className={page === firstPage + 6 ? "active" :"" } onClick={() => {this._handlePagination(firstPage + 6)}}>{firstPage + 6}</a></li>
                                    : ''}
                                {page !== lastPage ?
                                    <li onClick={() => {this._handlePagination(page + 1)}}><a>»</a></li>
                                    : ''}
                            </ul>
                        </div>
                    </div>
                    : <div></div>}
            </div>
        )
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        contactsByFunctionOrTypeFindServer,
        changePage,
        showLoading
    }, dispatch);
}

function mapStateToProps({contactsByFunctionOrType}, ownerProps){
    return {
        contactsByFunctionOrType
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Pagination);
