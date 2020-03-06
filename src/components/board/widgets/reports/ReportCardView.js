import React from 'react';
import '../../../../../styles/board/widgets/reports/main.scss';

const ReportCardView = ({ title, background }) => {
    return (
        <div className="report-card-view">
            <img src={background} alt={title} style={{ width: '100%', height: '100%', zIndex: -1 }} />
            <div style={{ textAlign: 'center', zIndex: 1, position: 'absolute', width: '100%', top: 0 }}>
                <h3 className="title" style={{ zIndex: 1 }}>{title}</h3>
            </div>
        </div>
    );
};

export default ReportCardView;