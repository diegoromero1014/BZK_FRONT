import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { redirectUrl } from "../globalComponents/actions";
import SecurityMessageComponent from '../globalComponents/securityMessageComponent';
import Reports from './widgets/reports';
import Header from './header';
import { updateTitleNavBar } from '../navBar/actions';
import AlertSection from './widgets/alerts';
import VisitComponent from './widgets/visits';
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

                <div
                    style={{
                        width: '100%',
                        height: 550,
                        background: 'transparent',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 100
                    }}
                >
                    <Tasks />
                    <SectionImportantDates />
                </div>
                <div style={{ width: '100%', marginTop: 100 }}>
                    <AlertSection />
                </div>
                <div style={{ width: '100%', marginTop: 170 }}>
                    <VisitComponent />
                </div>
            </div>
        );
    }

}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        dispatchUpdateTitleNavBar: updateTitleNavBar,
    }, dispatch);
}

export default connect(null, mapDispatchToProps)(ManagementView);