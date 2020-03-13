import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { get } from 'lodash';
import Carousel from '../../../carousel';
import ReportCardView from './ReportCardView';
import pipeline from '../../../../../img/reports/pipeline.png';
import visit from '../../../../../img/reports/visit.png';
import task from '../../../../../img/reports/task.png';
import previsit from '../../../../../img/reports/previsit.png';
import business from '../../../../../img/reports/business.png';

import ModalDownloadPreVisit from '../../../previsita/downloadPrevisits/component';
import ModalDownloadVisit from '../../../visit/downloadVisits/component';
import ModalDownloadBusinessPlan from '../../../businessPlan/downloadBusinessPlan/component';
import DownloadTask from '../../../pendingTask/downloadTask/component';
import DownloadPipeline from "./../../../viewManagement/downloadPipeline/component";
import { validatePermissionsByModule } from '../../../../actionsGlobal';
import { PREVISIT_TITLE, VISIT_TITLE, BUSINESS_PLAN_TITLE, PIPELINE_TITLE, TASK_TITLE } from './constants';
import { MODULE_MANAGERIAL_VIEW, DOWNLOAD_TASK, DESCARGAR } from '../../../../constantsGlobal';
import { swtShowMessage } from '../../../sweetAlertMessages/actions';
import { TAB_PREVISIT, TAB_VISIT, TAB_BUSINESS, TAB_PIPELINE, TAB_TASKS } from '../../constants';

export class Reports extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            report: {},
            reports: []
        }
    }

    async componentDidMount() {
        const isEditable = await this.validatePermissions(DESCARGAR);

        const reports = [
            {
                component: ReportCardView,
                componentProps: {
                    title: PREVISIT_TITLE,
                    background: previsit,
                    renderModal: ModalDownloadPreVisit,
                    itemSeletedModal: TAB_PREVISIT,
                    editable: isEditable,
                },
                visualize: true,
            },
            {
                component: ReportCardView,
                componentProps: {
                    title: VISIT_TITLE,
                    background: visit,
                    renderModal: ModalDownloadVisit,
                    itemSeletedModal: TAB_VISIT,
                    editable: isEditable,
                },
                visualize: true,
            },
            {
                component: ReportCardView,
                componentProps: {
                    title: BUSINESS_PLAN_TITLE,
                    background: business,
                    renderModal: ModalDownloadBusinessPlan,
                    itemSeletedModal: TAB_BUSINESS,
                    editable: isEditable,
                },
                visualize: true,
            },
            {
                component: ReportCardView,
                componentProps: {
                    title: PIPELINE_TITLE,
                    background: pipeline,
                    renderModal: DownloadPipeline,
                    itemSeletedModal: TAB_PIPELINE,
                    editable: isEditable,
                },
                visualize: true,
            },
            {
                component: ReportCardView,
                componentProps: {
                    title: TASK_TITLE,
                    background: task,
                    renderModal: DownloadTask,
                    itemSeletedModal: TAB_TASKS,
                    editable: isEditable,
                },
                visualize: await this.validatePermissions(DOWNLOAD_TASK),
            },
        ]

        await this.setState({ reports });
    }


    validatePermissions = async permission => {
        const { dispatchValidate } = this.props;

        let hasPermissions = false;

        await dispatchValidate(MODULE_MANAGERIAL_VIEW).then(data => {
            const permissionList = get(data, 'payload.data.data.permissions') || [];

            if (permissionList.find(element => element === permission)) {
                hasPermissions = true;
            }
        });

        return hasPermissions;
    }

    render() {
        const { reports } = this.state;

        const elements = reports.filter(r => r.visualize);

        return (
            <div>
                <Carousel
                    dots={true}
                    infinite={true}
                    data={elements}
                    slidesToShow={elements.length - 1}
                />
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        dispatchValidate: validatePermissionsByModule,
        dispatchShowMessage: swtShowMessage
    }, dispatch)
};

export default connect(null, mapDispatchToProps)(Reports);