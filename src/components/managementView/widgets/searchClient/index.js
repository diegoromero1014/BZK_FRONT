import React, { Component } from "react";
import { connect } from "react-redux";
import noop from "lodash";
import SearchClient from "./searchClient";
import TableBuilder from "../../../table/TableBuilder";
import TableComponent from "../../../table";
import SweetAlert from '../../../sweetalertFocus';

import { clientsFindServer } from "../../../clients/actions";
import { TITLE_SEARCH_CLIENT, COLUMNS_SEARCH_CLIENT, MESSAGE_NO_RESULTS, MESSAGE_NO_ACCESS, STYLE_NO_RESULTS } from "./constants";
import { bindActionCreators } from "redux";
import { redirectUrl } from "../../../globalComponents/actions";

class SectionSearchClient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: "",
            data: [],
            rowCount: "",
            page: 0,
            swClient: false
        };
    }

    componentDidMount() {
        this.forceUpdate();
    }

    saveData = data => {
        const { clients, rowCount, keyword, page } = data;
        this.setState({
            keyword,
            data: clients,
            rowCount,
            page
        });
    };

    currentPage = async page => {
        const { dispatchClientsFindServer } = this.props;
        const { keyword } = this.state;
        const { payload: { data: { data: { rows } } } } = await dispatchClientsFindServer(keyword, (page - 1) * 10, 10);
        const newRows = rows.map(element => {
            if(element.prospect){
                element.prospect =  <div className="prospect" style={STYLE_ICON_PROSPECT}>P</div> 
            }else{
                element.prospect = " "
            }
            return element
        })
        this.setState({
            data: newRows
        });
    };

    handelClickClient = (element) => {
        const { id, access } = element;
        if (access) {
            window.sessionStorage.setItem('idClientSelected', id);
            redirectUrl('/dashboard/clientInformation');
        } else {
            this.setState({ swClient: true })
        }
    }

    render() {
        const { data, rowCount, swClient } = this.state;

        const tableSettings = new TableBuilder(data, COLUMNS_SEARCH_CLIENT)
            .setNoRowMessage(MESSAGE_NO_RESULTS)
            .setRecordsPerPage(10)
            .setStriped(true)
            .setOnClick(element => this.handelClickClient(element))
            .setTotalRecords(rowCount)
            .setOnPageChange(page => this.currentPage(page))
            .build();

        return (
            <div style={{ margin: "45px 0px 10px 0px" }}>
                <h4 style={{ fontSize: 16 }}>{TITLE_SEARCH_CLIENT}</h4>
                <SearchClient saveData={this.saveData} />
                {data.length !== 0 ? (
                    <TableComponent tableSettings={tableSettings} />
                ) : rowCount === 0 && data.length === 0 ?
                        <h4 style={STYLE_NO_RESULTS}>{MESSAGE_NO_RESULTS}</h4> : null
                }
                <SweetAlert
                    type="warning"
                    show={swClient}
                    title="Acceso denegado"
                    text={MESSAGE_NO_ACCESS}
                    onConfirm={() => this.setState({ swClient: false })}
                />
            </div>
        );
    }
}

const mapStateToProps = noop;

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            dispatchClientsFindServer: clientsFindServer
        },
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SectionSearchClient);
