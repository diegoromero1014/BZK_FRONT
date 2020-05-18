import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { covenantsAlerts, covenantsFilter } from '../../../alertCovenants/actions';
import Table from "../../../table";
import TableBuilder from "../../../table/TableBuilder";
import { COLUMNS_COVENANTS_ALERTS, MAX_ROWS } from './constants';
import Modal from 'react-modal';
import ModaltrackingCovenant  from '../../../risksManagement/covenants/createTracking/modalTrackingCovenant';
import {mapDataGrid} from '../../../alertCovenants/alertCovenantsUtilities';
import { NAME_FILTER_CLIENTS, NAME_FILTER_RELATION } from "../searchClient/constants";

export class CovenantsAlertsComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            idCovenant: null,
            loading: false
        }
    }

    handleOnPageChange = async page => {
        const { dispatchCovenantsAlerts, dispatchCovenantsFilter, idFilter, filterType } = this.props;
        const filterClient = filterType == NAME_FILTER_CLIENTS ? idFilter : null;
        const filterEconomicGroup = filterType == NAME_FILTER_RELATION ? idFilter : null;
        await this.setState({ loading: true });
        await dispatchCovenantsAlerts(page, MAX_ROWS);
        await dispatchCovenantsFilter(page, MAX_ROWS, filterClient, filterEconomicGroup);
        await this.setState({ loading: false });
    }

    handleOnClick = async ({ idCovenant }) => await this.setState({ open: true, idCovenant });


    handleOnCloseModal = () => this.setState({ open: false, idCovenant: null });

    render() {
        const { data, total } = this.props;
        const { open, idCovenant, loading } = this.state;
       
        return (
            <div>
                <Table
                    tableSettings={
                        new TableBuilder(mapDataGrid(data), COLUMNS_COVENANTS_ALERTS)
                            .setNoRowMessage("No existen registros.")
                            .setRecordsPerPage(MAX_ROWS)
                            .setStriped(false)
                            .setSelectable(true)
                            .setTotalRecords(total)
                            .setOnPageChange(this.handleOnPageChange)
                            .setLoading(loading)
                            .setOnClick(this.handleOnClick)
                            .setMaximumVisiblePages(7)
                            .build()
                    }
                />

                <Modal isOpen={open} onRequestClose={this.handleOnCloseModal} className="modalBt4-fade modal fade contact-detail-modal in" style={{ zIndex: 100 }}>
                    <div className="modalBt4-dialog modalBt4-lg" style={{ zIndex: 100 }}>
                        <div className="modalBt4-content modal-content" style={{ zIndex: 100 }}>
                            <div className="modalBt4-header modal-header">
                                <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }} id="myModalLabel">Creación de seguimientos</h4>

                                <button type="button" onClick={this.handleOnCloseModal} className="close" data-dismiss="modal" role="close">
                                    <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                                    <span className="sr-only">Close</span>
                                </button>
                            </div>
                            <ModaltrackingCovenant covenantId={idCovenant} isOpen={this.handleOnCloseModal} />
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = ({ alertCovenant, filterDashboard: { id, criterio } }) => ({
    alertCovenant,
    data: alertCovenant.get('responseCovenants'),
    total: alertCovenant.get('totalCovenantsByFiltered'),
    idFilter: id,
    filterType: criterio
});

const mapDispatchToProps = dispatch => bindActionCreators({
    dispatchCovenantsAlerts: covenantsAlerts,
    dispatchCovenantsFilter: covenantsFilter
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CovenantsAlertsComponent);