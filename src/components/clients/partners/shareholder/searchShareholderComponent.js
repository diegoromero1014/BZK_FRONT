import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    shareholdersByClientFindServer,
    changeKeywordShareholder,
    clearShareholderPaginator,
    clearShareholderOrder
} from './actions';
import { NUMBER_RECORDS } from './constants';

let v1 = "";
let v2 = "";

export class SearchShareholderComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keywordShareholder: '',
            errorKeyword: null
        };
        this.handleShareholderByClientsFind = this.handleShareholderByClientsFind.bind(this);
        this.handleChangeKeyword = this.handleChangeKeyword.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if ((v1 !== nextProps.value1) || (v2 !== nextProps.value2)) {
            v1 = nextProps.value1;
            v2 = nextProps.value2;
            const { dispatchClearShareholderOrder } = this.props;
            dispatchClearShareholderOrder();
            this.handleShareholderByClientsFind();
        }
    }

    handleChangeKeyword = e => {
        if (e.keyCode === 13 || e.which === 13) {
            this.handleShareholderByClientsFind();
        } else {
            this.setState({
                keywordShareholder: e.target.value
            });
            const { dispatchChangeKeywordShareholder } = this.props;
            dispatchChangeKeywordShareholder(e.target.value);
        }
    }

    handleShareholderByClientsFind = () => {
        const { dispatchShareholdersByClientFindServer, dispatchClearShareholderPaginator, dispatchClearShareholderOrder } = this.props;
        dispatchClearShareholderPaginator();
        dispatchClearShareholderOrder();

        let _keywordShareholder = this.state.keywordShareholder ? this.state.keywordShareholder : "";
        dispatchShareholdersByClientFindServer(0, window.sessionStorage.getItem('idClientSelected'), NUMBER_RECORDS, "sh.sharePercentage", 1, _keywordShareholder, v1, v2);
    }

    render() {
        const { disabled } = this.props;
        return (
            <div>

                <div className="InputAddOn">
                    <input
                        style={{ padding: '0px 11px !important' }}
                        disabled={disabled}
                        id="searchExpression"
                        onKeyPress={this.handleChangeKeyword}
                        type="text"
                        placeholder="Búsqueda por número, nombre"
                        value={this.state.keywordShareholder}
                        onChange={this.handleChangeKeyword}
                        className="input InputAddOn-field"
                    />
                    <button onClick={this.handleShareholderByClientsFind} disabled={disabled} className="button InputAddOn-item">
                        <i className="search icon" />
                    </button>
                </div>

                {this.state.errorKeyword &&
                    <div>
                        <div className="ui pointing red basic label">
                            {this.state.errorKeyword}
                        </div>
                    </div>
                }

            </div>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    dispatchShareholdersByClientFindServer: shareholdersByClientFindServer,
    dispatchChangeKeywordShareholder: changeKeywordShareholder,
    dispatchClearShareholderPaginator: clearShareholderPaginator,
    dispatchClearShareholderOrder: clearShareholderOrder
}, dispatch);

const mapStateToProps = ({ shareholdersReducer }) => ({ shareholdersReducer });

export default connect(mapStateToProps, mapDispatchToProps)(SearchShareholderComponent);
