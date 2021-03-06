import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { redirectUrl } from "../globalComponents/actions";
import SecurityMessageComponent from '../globalComponents/securityMessageComponent';
import Reports from './widgets/reports';
import Header from './header';
import { updateTitleNavBar } from '../navBar/actions';
import AlertSection from './widgets/alerts';
import VisitsSection from './widgets/visits';
import SectionSearchClient from './widgets/searchClient';
import SectionImportantDates from './widgets/importantDates';
import Tasks from './widgets/tasks';

export class ManagementView extends Component {

    componentWillMount() {
        if (window.localStorage.getItem('sessionTokenFront') === "") {
            redirectUrl("/login");
        } else {
            const { dispatchUpdateTitleNavBar } = this.props;
            dispatchUpdateTitleNavBar("Vista gerencial");
        }
    }

    render() {

        const { filter } = this.props;

        return (
            <div
                style={{
                    padding: '0px 50px 100px',
                    height: 'auto',
                    background: '#fff',
                    width: '100%'
                }}>
                <SecurityMessageComponent />
                <Header />
                <SectionSearchClient />

                <div style={{ marginTop: 100 }}>
                    <Reports />
                </div>

                <div style={{
                        width: '100%',
                        height: 500,
                        background: 'transparent',
                        display : `${filter ? 'none' : 'flex'}`,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 100,
                    }}
                >
                    <Tasks />
                    <SectionImportantDates />
                </div>

                <div id="alertSection" style={{ width: '100%', marginTop: 100 }}>
                    <AlertSection />
                </div>
                <div style={{ width: '100%', marginTop: 100 , display : `${filter ? 'none' : ''}` }}>
                    <VisitsSection />
                </div>
            </div >
        );
    }

}

const mapStateToProps = ({ filterDashboard }) => ({
    filter : filterDashboard.filterMode
})

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        dispatchUpdateTitleNavBar: updateTitleNavBar
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ManagementView);