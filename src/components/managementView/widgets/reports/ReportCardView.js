import React, { Component } from 'react';
import '../../../../../styles/board/widgets/reports/main.scss';
import download from '../../../../../img/icon/descargar.png';
import Modal from 'react-modal';

class ReportCardView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        }
    }

    handleCloseModal = () => this.setState({ open: false });

    render() {
        const { open } = this.state;
        const { title, editable, background } = this.props;

        return (
            <div className={`report-card-view ${editable ? '' : 'disabled'} `} onClick={() => editable && this.setState({ open: true })}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: -1, width: '100%', height: '100%' }}>
                    <img src={background} />
                </div>
                <div style={{ textAlign: 'center', zIndex: 1, position: 'absolute', width: '100%', top: 0 }}>
                    <h3 className="title" style={{ zIndex: 1 }}>{title}</h3>
                </div>

                {editable &&
                    <div style={{
                        textAlign: 'center',
                        zIndex: 1,
                        position: 'absolute',
                        width: '100%',
                        bottom: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 6
                    }}>
                        <img src={download} alt="download" />
                    </div>
                }
                <Modal
                    isOpen={open}
                    onRequestClose={this.handleCloseModal}
                    contentLabel="Reportes"
                    className="modalBt4-fade modal fade contact-detail-modal in"
                    style={{ width: 640 }}
                >
                    <div className="modalBt4-dialog modalBt4-lg" style={{ width: 640 }}>
                        <div className="modalBt4-content modal-content">
                            <div className="modalBt4-header modal-header">
                                <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }} id="myModalLabel">{title}</h4>

                                <button type="button" onClick={this.handleCloseModal} className="close" data-dismiss="modal" role="close">
                                    <span className="modal-title" aria-hidden="true" role="close">
                                        <i className="remove icon modal-icon-close" role="close"></i>
                                    </span>
                                    <span className="sr-only">Close</span>
                                </button>
                            </div>

                            {this.props.renderModal &&
                                <this.props.renderModal isOpen={this.handleCloseModal} itemSelectedModal={this.props.itemSelectedModal} />
                            }
                        </div>
                    </div>
                </Modal>
            </div >
        );
    }
}

export default ReportCardView;