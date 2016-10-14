import React, {Component} from 'react';
import {Row, Col} from 'react-flexbox-grid';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {deleteProduct} from './actions';
import {getMasterDataFields} from '../../selectsComponent/actions';
import {CLIENT_TYPE_PRODUCT, FILTER_COUNTRY} from '../../selectsComponent/constants';
import * as constants from '../../../constantsGlobal';
import SweetAlert from 'sweetalert-react';
import _ from 'lodash';
import ModalProduct from './modalProduct';
import Modal from 'react-modal';

class ProductList extends Component {
    constructor(props) {
      super(props);
      this._mapProducts = this._mapProducts.bind(this);
      this.closeModal = this.closeModal.bind(this);
      this.openModal = this.openModal.bind(this);
      this._confirmDeleteProduct = this._confirmDeleteProduct.bind(this);
      this._closeDelete = this._closeDelete.bind(this);
      this._viewDetailsProduct = this._viewDetailsProduct.bind(this);
      this.state = {
        modalIsOpen: false,
        showMessage: false,
        typeMessage: '',
        titleMessage: '',
        textMessage: '',
        uidProductDelete: '',
        productDetail: null
      };
    }

    openModal(){
      this.setState({
        modalIsOpen: true,
        productDetail: null
      });
    }

    closeModal(){
      this.setState({modalIsOpen: false});
    }

    _closeDelete() {
      this.setState({showMessage: false});
      if(this.state.uidProductDelete !== '' && this.state.uidProductDelete !== null && this.state.uidProductDelete !== undefined){
        const {deleteProduct} = this.props;
        deleteProduct(this.state.uidProductDelete);
        this.setState({
          uidProductDelete: ''
        });
      }
    }

    _viewDetailsProduct(productDetail){
      this.setState({
        productDetail: productDetail,
        modalIsOpen: true
      });
    }

    _confirmDeleteProduct(idProduct){
      this.setState({
        showMessage: true,
        typeMessage: constants.MESSAGE_WARNING,
        titleMessage: "Eliminar producto",
        textMessage: "¿Señor usuario, está seguro que desea eliminar el producto?",
        uidProductDelete: idProduct
      });
    }

    _mapProducts(product, idx) {
      const {selectsReducer} = this.props;
      return <tr key={idx}>
              <td className="collapsing">
                <i className="zoom icon" title="Ver detalle"
                  onClick={() => this._viewDetailsProduct(product)}
                  style={{cursor: "pointer"}} />
              </td>
              <td>{product.name.length > 60 ? product.name.substring(0, 60) + "..." : product.name}</td>
              <td>{_.get(_.filter(selectsReducer.get(CLIENT_TYPE_PRODUCT), ['id', parseInt(product.type)]), '[0].value')}</td>
              <td>{product.number.length > 60 ? product.number.substring(0, 60) + "..." : product.number}</td>
              <td  className="collapsing">
                <i className="remove icon" title="Eliminar producto"
                  onClick={() => this._confirmDeleteProduct(product.uid)}
                  style={{cursor: "pointer"}} />
              </td>
             </tr>
    }

    componentWillMount() {
      const {getMasterDataFields} = this.props;
      getMasterDataFields([CLIENT_TYPE_PRODUCT]);
    }

    render() {
      const {error, clientProductReducer} = this.props;
      return (
        <div>
          <Row style={{padding: "0px 10px 20px 20px"}}>
            <Col xs={12} sm={12} md={12} lg={12} style={{marginTop: "-50px", paddingRight: "35px", textAlign: "right"}}>
              <button className="btn" disabled={clientProductReducer.size === 3 || clientProductReducer.size > 3 ? 'disabled' : ''} style={{margin:"12px 0px 0px 12px", fontSize : '1.5em'}} type="button" onClick={this.openModal}>
                <i className="plus icon" style={{color: "white", padding: "3px 0 0 5px"}}></i>
              </button>
              <Modal
                isOpen={this.state.modalIsOpen}
                onRequestClose={this.closeModal}
                className="modalBt4-fade modal fade contact-detail-modal in">
                <div className="modalBt4-dialog modalBt4-lg">
                  <div className="modalBt4-content modal-content">
                    <div className="modalBt4-header modal-header">
                      <h4 className="modal-title" style={{float: 'left', marginBottom: '0px'}} id="myModalLabel">Producto</h4>
                      <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                        <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                        <span className="sr-only">Close</span>
                      </button>
                    </div>
                    <ModalProduct isOpen={this.closeModal} productDetail={this.state.productDetail}/>
                  </div>
                </div>
              </Modal>
            </Col>
          </Row>
          {clientProductReducer.size > 0 ?
            <Row style={{padding: "0px 10px 20px 20px"}}>
              <Col xs>
                <table className="ui striped table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Nombre</th>
                      <th>Tipo</th>
                      <th>Número</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientProductReducer.map(this._mapProducts)}
                  </tbody>
                </table>
              </Col>
            </Row> :
            <Row style={{padding: "0px 10px 20px 20px"}}>
              <Col xs={12} md={12} lg={12}>
                <div style={{textAlign:"center", marginTop:"20px", marginBottom:"20px"}}>
                  <span className="form-item">Aún no se han adicionado productos</span>
                </div>
              </Col>
            </Row>
          }
          <SweetAlert
           type={this.state.typeMessage}
           show={this.state.showMessage}
           title={this.state.titleMessage}
           text={this.state.textMessage}
           confirmButtonColor= '#DD6B55'
           confirmButtonText= 'Sí, estoy seguro!'
           cancelButtonText = "Cancelar"
           showCancelButton= {true}
           onCancel= {() => this.setState({showMessage: false })}
           onConfirm={() => this._closeDelete()}
           />
        </div>
      );
    }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getMasterDataFields,
    deleteProduct
  }, dispatch);
}

function mapStateToProps({notes, selectsReducer, clientProductReducer}) {
  return {
    clientProductReducer,
    selectsReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
