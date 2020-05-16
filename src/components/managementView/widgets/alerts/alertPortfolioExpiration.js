import React, { Component } from "react";
import { connect } from "react-redux";
import Table from "../../../table";
import { COLUMNS_VENCIMIENTO_CARTERA } from './constants';
import TableBuilder from "../../../table/TableBuilder";
import { bindActionCreators } from 'redux';
import { getAlertPortfolioExpirationDashboard } from '../../../alertPortfolioExpirtation/actions';
import { Button } from 'semantic-ui-react'
import { redirectUrl } from "../../../globalComponents/actions";
import { changeActiveItemMenu } from '../../../menu/actions';
import { mapDataGrid } from "../../../alertPortfolioExpirtation/clientPortfolioExpirationUtilities";

export class AlertPortfolioExpiration extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false
        }
    }

    // componentDidMount() {
    //     this.forceUpdate();
    // }

    componentDidMount() {
        this.forceUpdate();
    }
   
    componentDidUpdate(prevProps) {
        console.log('aquifuera');
        console.log('pre', prevProps);
        console.log('pos', this.props);
        if (prevProps.idFilter !== this.props.idFilter) {
            console.log('aquidentro');
            this.handleOnPageChange(1);
        }
    }

    redirectToAlertPortfolioExpiration = () => {
        const { dispatchChangeActiveItemMenu } = this.props;
        dispatchChangeActiveItemMenu("Alertas");
        redirectUrl("/dashboard/alertClientsPortfolioExpiration");
    }

    handleOnPageChange = async page => {
        const { dispatchGetAlertPortfolioExpirationDashboard, idFilter, filterType } = this.props;
        const filterClient = filterType == "CLIENTE" ? idFilter : null;
        const filterEconomicGroup = filterType == "GRUPO_ECONOMICO" ? idFilter : null;
        this.setLoading(true);
        await dispatchGetAlertPortfolioExpirationDashboard(page, filterClient, filterEconomicGroup);
        this.setLoading(false);
    }

    setLoading = async loading => await this.setState({ loading });

    render() {
        const { total, data } = this.props;

        const tableSettings = new TableBuilder(mapDataGrid(data), COLUMNS_VENCIMIENTO_CARTERA)
            .setNoRowMessage("No existen registros.")
            .setRecordsPerPage(5)
            .setStriped(true)
            .setTotalRecords(total)
            .setOnPageChange(this.handleOnPageChange)
            .setLoading(this.state.loading)
            .setMaximumVisiblePages(7)
            .build();

        return (
            <div>
                <Table tableSettings={tableSettings} />
                <Button
                    fluid
                    style={{ background: 'transparent', color: '#00448c', fontSize: '16px' }}
                    onClick={this.redirectToAlertPortfolioExpiration}
                >
                    Ver detalle
                </Button>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        dispatchGetAlertPortfolioExpirationDashboard: getAlertPortfolioExpirationDashboard,
        dispatchChangeActiveItemMenu: changeActiveItemMenu
    }, dispatch)
};

const mapStateToProps = ({ alertPortfolioExpiration, filterDashboard: { id, criterio } }) => {
    return {
        alertPortfolioExpiration,
        data: alertPortfolioExpiration.get('responseClients'),
        idFilter: id,
        filterType: criterio
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AlertPortfolioExpiration);
