import React, { Component } from 'react';
import Modal from 'react-modal';
import Carousel from '../../../carousel';
import ReportCardView from './ReportCardView';
import pipeline from '../../../../../img/reports/pipeline.png';
import visit from '../../../../../img/reports/visit.png';
import task from '../../../../../img/reports/task.png';
import previsit from '../../../../../img/reports/previsit.png';
import ModalDownloadPreVisit from '../../../previsita/downloadPrevisits/component';
import ModalDownloadVisit from '../../../visit/downloadVisits/component';
import ModalDownloadBusinessPlan from '../../../businessPlan/downloadBusinessPlan/component';
import DownloadTask from '../../../pendingTask/downloadTask/component';
import DownloadPipeline from "./../../../viewManagement/downloadPipeline/component";

import { PREVISIT_TITLE, VISIT_TITLE, BUSINESS_PLAN_TITLE, PIPELINE_TITLE, TASK_TITLE } from './constants';

class Reports extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            report: {},
            reports: [
                {
                    component: ReportCardView,
                    componentProps: {
                        title: PREVISIT_TITLE,
                        background: previsit,
                        onClick: () => this.handleOnClick(PREVISIT_TITLE),
                    },
                    onClick: () => this.handleOnClick(PREVISIT_TITLE),
                    name: PREVISIT_TITLE,
                    renderModal: ModalDownloadPreVisit
                },
                {
                    component: ReportCardView,
                    componentProps: {
                        title: VISIT_TITLE,
                        background: visit,
                        onClick: () => this.handleOnClick(VISIT_TITLE),
                    },
                    onClick: () => this.handleOnClick(VISIT_TITLE),
                    name: VISIT_TITLE,
                    renderModal: ModalDownloadVisit
                },
                {
                    component: ReportCardView,
                    componentProps: {
                        title: BUSINESS_PLAN_TITLE,
                        background: task,
                        onClick: () => this.handleOnClick(BUSINESS_PLAN_TITLE),
                    },
                    onClick: () => this.handleOnClick(BUSINESS_PLAN_TITLE),
                    name: BUSINESS_PLAN_TITLE,
                    renderModal: ModalDownloadBusinessPlan
                },
                {
                    component: ReportCardView,
                    componentProps: {
                        title: PIPELINE_TITLE,
                        background: pipeline,
                        onClick: () => this.handleOnClick(PIPELINE_TITLE),
                    },
                    onClick: () => this.handleOnClick(PIPELINE_TITLE),
                    name: PIPELINE_TITLE,
                    renderModal: DownloadPipeline
                },
                {
                    component: ReportCardView,
                    componentProps: {
                        title: TASK_TITLE,
                        background: task,
                        onClick: () => this.handleOnClick(TASK_TITLE),
                    },
                    onClick: () => this.handleOnClick(TASK_TITLE),
                    name: TASK_TITLE,
                    renderModal: DownloadTask
                },
            ]
        }
    }

    handleOnClick = async name => {
        const { reports } = this.state;

        await this.setState({
            open: true,
            report: reports.find(element => element.name === name)
        });
    }

    handleCloseModal = () => this.setState({ open: false });

    render() {
        const { reports, open, report } = this.state;

        return (
            <div>
                <Carousel
                    dots={true}
                    infinite={true}
                    data={reports}
                    slidesToShow={4}
                />

                <Modal isOpen={open} onRequestClose={this.handleCloseModal} className="modalBt4-fade modal fade contact-detail-modal in" style={{ zIndex: 100 }}>
                    <div className="modalBt4-dialog modalBt4-lg" style={{ zIndex: 100 }}>
                        <div className="modalBt4-content modal-content" style={{ zIndex: 100 }}>
                            <div className="modalBt4-header modal-header">
                                <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }} id="myModalLabel">{report.name}</h4>

                                <button type="button" onClick={this.handleCloseModal} className="close" data-dismiss="modal" role="close">
                                    <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                                    <span className="sr-only">Close</span>
                                </button>
                            </div>

                            <report.renderModal isOpen={this.handleCloseModal} />

                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default Reports;