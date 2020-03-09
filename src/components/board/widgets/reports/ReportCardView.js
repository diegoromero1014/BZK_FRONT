import React from 'react';
import '../../../../../styles/board/widgets/reports/main.scss';
import { Icon } from 'semantic-ui-react'

const ReportCardView = (props) => {
    return (
        <div className="report-card-view" {...props}>
            <img src={props.background} alt={props.title} style={{ width: '100%', height: '100%', zIndex: -1 }} />
            <div style={{ textAlign: 'center', zIndex: 1, position: 'absolute', width: '100%', top: 0 }}>
                <h3 className="title" style={{ zIndex: 1 }}>{props.title}</h3>
            </div>

            <div style={{ textAlign: 'center', zIndex: 1, position: 'absolute', width: '100%', bottom: 0 }}>
                <Icon name='download' style={{ zIndex: 1 }} />
            </div>

        </div>
    );
};

export default ReportCardView;