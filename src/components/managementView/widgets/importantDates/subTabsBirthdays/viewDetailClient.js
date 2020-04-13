import React, { Component } from 'react';
import Modal from 'react-modal';
import { Icon } from 'semantic-ui-react';
import Table from "../../../../table";
import TableBuilder from "../../../../table/TableBuilder";
import { COLUMNS_CLIENTS, MAX_ROWS } from './constants';

class ViewDetailClient extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            name: '',
            open: false,
            clients: [],
            page: 1
        }
    }

    async componentWillMount() {
        const { data = [] } = this.props;
        const { page } = this.state;

        let clients = data.split(";;");

        if (clients.length > 1) {
            const indexOfLastPost = page * MAX_ROWS;
            const indexOfFirstPost = indexOfLastPost - MAX_ROWS;

            clients = clients.map(client => ({ name: client })).slice(indexOfFirstPost, indexOfLastPost);

            await this.setState({ visible: true, clients });
        } else {
            await this.setState({ visible: false, name: clients[0] });
        }
    }

    handleCloseModal = () => this.setState({ open: false });

    handleOnClick = () => this.setState({ open: true });

    render() {
        const { data = [] } = this.props;
        const { visible, name, open, clients } = this.state;

        return (
            <div>
                {visible ? <Icon onClick={this.handleOnClick} name='users' /> : <p>{name}</p>}

                <Modal isOpen={open} onRequestClose={this.handleCloseModal} className="modalBt4-fade modal fade contact-detail-modal in" style={{ zIndex: 100 }}>
                    <div className="modalBt4-dialog modalBt4-lg" style={{ zIndex: 100 }}>
                        <div className="modalBt4-content modal-content" style={{ zIndex: 100 }}>
                            <div className="modalBt4-header modal-header">
                                <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }} id="myModalLabel">Clientes</h4>

                                <button type="button" onClick={this.handleCloseModal} className="close" data-dismiss="modal" role="close">
                                    <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                                    <span className="sr-only">Close</span>
                                </button>
                            </div>

                            <div
                                style={{
                                    width: '100%', display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: '50px 0'
                                }}
                            >
                                <div style={{ width: '70%', }} >
                                    <Table
                                        tableSettings={
                                            new TableBuilder(clients, COLUMNS_CLIENTS)
                                                .setNoRowMessage("No existen registros.")
                                                .setRecordsPerPage(5)
                                                .setStriped(true)
                                                .setTotalRecords(clients.length)
                                                .setOnPageChange(async page => {
                                                    const indexOfLastPost = page * MAX_ROWS;
                                                    const indexOfFirstPost = indexOfLastPost - MAX_ROWS;
                                                    
                                                    const clients = data
                                                        .split(";;")
                                                        .map(client => ({ name: client }))
                                                        .slice(indexOfFirstPost, indexOfLastPost);

                                                    await this.setState({ clients });
                                                })
                                                .setMaximumVisiblePages(7)
                                                .build()
                                        }
                                    />
                                </div>
                            </div>


                            <div className="modalBt4-footer modal-footer">
                                <button type="submit" className="btn btn-primary modal-button-edit" style={{ marginRight: 15 }}>
                                    <span>Guardar</span>
                                </button>

                                <button type="button" className="btn btn-default modal-button-edit" onClick={this.handleCloseModal}>
                                    <span>Cancelar</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>

        );
    }
}

export default ViewDetailClient;