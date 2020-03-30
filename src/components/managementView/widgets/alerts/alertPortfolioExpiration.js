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

export class AlertPortfolioExpiration extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false
        }
    }

    componentDidMount() {
        this.forceUpdate();
    }

    redirectToAlertPortfolioExpiration = () => {
        const { dispatchChangeActiveItemMenu } = this.props;
        dispatchChangeActiveItemMenu("Alertas");
        redirectUrl("/dashboard/alertClientsPortfolioExpiration");
    }

    handleOnPageChange = async page => {
        const { dispatchGetAlertPortfolioExpirationDashboard } = this.props;

        this.setLoading(true);
        await dispatchGetAlertPortfolioExpirationDashboard(page);
        this.setLoading(false);
    }

    setLoading = async loading => await this.setState({ loading });

    render() {
        const { alertPortfolioExpiration, total } = this.props;

        const data = alertPortfolioExpiration.get("responseClients");

        const tableSettings = new TableBuilder(data, COLUMNS_VENCIMIENTO_CARTERA)
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
                    style={{ background: 'transparent' }}
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

const mapStateToProps = ({ alertPortfolioExpiration }) => {
    return {
        alertPortfolioExpiration
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AlertPortfolioExpiration);
