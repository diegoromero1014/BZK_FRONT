import React, { Component } from "react";
import { connect } from "react-redux";
import Table from "../../../table";
import TableBuilder from "../../../table/TableBuilder";
import { bindActionCreators } from 'redux';
import { getImportantDates } from '../../../managementView/actions';
import { Button } from 'semantic-ui-react'
// import { redirectUrl } from "../../../globalComponents/actions";
// import { changeActiveItemMenu } from '../../../menu/actions';
import { COLUMNS_CONTACTS } from '../importantDates/constants';

class StrategicSection extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false
        }
    }

    async componentDidMount() {
        await Promise.all([
            this.handleGetImportantDates()
        ])
    }

    handleGetImportantDates = () => {

    }

    // redirectToAlertPortfolioExpiration = () => {
    //     const { dispatchChangeActiveItemMenu } = this.props;
    //     dispatchChangeActiveItemMenu("Alertas");
    //     redirectUrl("/dashboard/alertClientsPortfolioExpiration");
    // }
    handleOnPageChange = () => {}
    // handleOnPageChange = async page => {
    //     const { dispatchGetAlertPortfolioExpirationDashboard } = this.props;

    //     this.setLoading(true);
    //     await dispatchGetAlertPortfolioExpirationDashboard(page);
    //     this.setLoading(false);
    // }

    setLoading = async loading => await this.setState({ loading });

    render() {
        const { data , totalRecords } = this.props
 
        const tableSettings = new TableBuilder(data, COLUMNS_CONTACTS)
            .setNoRowMessage("No existen registros.")
            .setRecordsPerPage(5)
            .setStriped(true)
            .setTotalRecords(totalRecords)
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
                    // onClick={this.redirectToAlertPortfolioExpiration}
                >
                    Ver detalle
                </Button>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    dispatchGetImportantDates : getImportantDates
},dispatch);

const mapStateToProps = ({ importantDates }) => ({
    totalRecords : importantDates.rowCount,
    data : importantDates.rows.filter(elem => elem.contactType === 'Estratégico')
})


export default connect(mapStateToProps, mapDispatchToProps)(StrategicSection);
