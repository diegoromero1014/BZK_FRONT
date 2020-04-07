import React, { Component } from "react";
import { connect } from "react-redux";
import SearchClient from "./searchClient";
import TableBuilder from "../../../table/TableBuilder";
import TableComponent from "../../../table";

import { clientsFindServer, clearClients } from "../../../clients/actions";
import { TITLE_SEARCH_CLIENT, COLUMNS_SEARCH_CLIENT, MESSAGE_NO_RESULTS, MESSAGE_NO_ACCESS } from "./constants";
import { bindActionCreators } from "redux";
import { redirectUrl } from "../../../globalComponents/actions";
import { swtShowMessage } from '../../../sweetAlertMessages/actions';
import { changeActiveItemMenu } from '../../../menu/actions';
import { MODULE_MY_CLIENTS, TAB_INFO } from "../../../../constantsGlobal";
import { updateTabSeleted } from '../../../clientDetailsInfo/actions';

export class SectionSearchClient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: "",
            page: 1,
            searched: false,
            loading : false
        };
    }

    componentWillMount() {
        const { dispatchClearClients } = this.props;
        dispatchClearClients();
    }

    setLoading = loading => this.setState({ loading})
    setKeyword = keyword => this.setState({ keyword });

    currentPage = async page => {
        const { dispatchClientsFindServer } = this.props;
        await this.setLoading(true);
        await dispatchClientsFindServer(this.state.keyword, (page - 1) * 10, 10);
        await this.setState({ page });
        await this.setLoading(false);
    };

    handelClickClient = ({ id, access }) => {
        const { dispatchSwtShowMessage, dispatchChangeActiveItemMenu, dispatchUpdateTabSeleted } = this.props;

        if (access) {
            window.sessionStorage.setItem('idClientSelected', id);
            dispatchChangeActiveItemMenu(MODULE_MY_CLIENTS);
            dispatchUpdateTabSeleted(TAB_INFO);
            redirectUrl('/dashboard/clientInformation');
        } else {
            dispatchSwtShowMessage("warning", "Acceso denegado", MESSAGE_NO_ACCESS);
        }
    }

    restartPage = () => this.setState({ page: 1 });

    handleSetSearched = searched => this.setState({ searched });

    render() {
        const { data, rowCount } = this.props;
        const { searched } = this.state;

        return (
            <div style={{ margin: "45px 30px 10px 0px" }}>
                <h4 style={{ fontSize: 16 }}>{TITLE_SEARCH_CLIENT}</h4>
                <SearchClient setKeyword={this.setKeyword} restartPage={this.restartPage} handleSetSearched={this.handleSetSearched} setLoading={this.setLoading}/>

                {searched &&
                    <TableComponent
                        tableSettings={
                            new TableBuilder(data, COLUMNS_SEARCH_CLIENT)
                                .setNoRowMessage(MESSAGE_NO_RESULTS)
                                .setRecordsPerPage(10)
                                .setStriped(true)
                                .setOnClick(this.handelClickClient)
                                .setTotalRecords(rowCount)
                                .setOnPageChange(this.currentPage)
                                .setInitialPage(this.state.page)
                                .setLoading(this.state.loading)
                                .setMaximumVisiblePages(7)
                                .build()
                        }
                    />
                }
            </div>
        );
    }
}

const mapStateToProps = ({ clientR }) => ({
    data: clientR.get('responseClients'),
    rowCount: clientR.get('countClients')
});

const mapDispatchToProps = dispatch => bindActionCreators({
    dispatchClientsFindServer: clientsFindServer,
    dispatchSwtShowMessage: swtShowMessage,
    dispatchClearClients: clearClients,
    dispatchChangeActiveItemMenu : changeActiveItemMenu,
    dispatchUpdateTabSeleted : updateTabSeleted
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SectionSearchClient);
