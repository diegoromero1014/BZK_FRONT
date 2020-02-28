import React, { Component } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from "react-flexbox-grid";
import { Icon } from 'semantic-ui-react';
import ItemList from "../elements/itemList";
import Tooltip from '../toolTip/toolTipComponent';
import ElementsComponent from "../elements";
import { addToList, linkedRecords, resetRecords } from '../elements/actions';
import { schemaoOportunitiesWeaknesses } from "./schema";
import {
  OPPORTUNITIES,
  WEAKNESSES,
  TITLE_OPPORTUNITIES,
  TITLE_WEAKNESSES,
  OPPORTUNITIES_PLACEHOLDER,
  WEAKNESSES_PLACEHOLDER,
  SINGULAR_TITLE_OPPORTUNITIES,
  SINGULAR_TITLE_WEAKNESSES,
  MSG_HELP_OPPORTUNITIES,
  MSG_HELP_WEAKNESSES,
  ICON_OPPORTUNITIES,
  ICON_WEAKNESSES
} from './constants';
import Modal from 'react-modal';
import ModalContentComponent from "./ModalContentComponent";
import Message from '../message';
import { swtShowMessage } from '../sweetAlertMessages/actions';

class SelectOpportunitiesWeaknesses extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      name: '',
      singularTitle: '',
      title: '',
      placeholder: '',
      elements: null,
    }
  }


  handleCloseModal = () => this.setState({ open: false, elements: null });

  handleCancel = elements => {
    this.handleOnReset(elements);
    this.setState({ open: false, elements: null });
  };

  handleOnReset = elements => {
    const { dispatchResetRecords, dispatchLinkedRecords } = this.props;
    const { name } = this.state;

    dispatchResetRecords({ name, elements });
    dispatchLinkedRecords(name);
  }

  handleOnSelect = (name, element, associated, singularTitle) => {
    const { dispatchAddToList, dispatchLinkedRecords, dispatchSwtShowMessage } = this.props;

    if (!associated) {
      dispatchSwtShowMessage(
        'warning',
        "Guardar información",
        `¿Señor usuario, está seguro que desea desasociar la ${singularTitle}?`,
        {
          onConfirmCallback: () => {
            dispatchAddToList({ name, data: Object.assign({}, element, { associated }), old: element });
            dispatchLinkedRecords(name);
          },
          onCancelCallback: () => { }
        },
        {
          "confirmButtonColor": '#DD6B55',
          "confirmButtonText": 'Sí, estoy seguro!',
          "cancelButtonText": "Cancelar",
          "showCancelButton": true,
        }
      );
    } else {
      dispatchAddToList({ name, data: Object.assign({}, element, { associated }), old: element });
      dispatchLinkedRecords(name);
    }




  }

  render() {
    const { opportunities, weaknesses, isEditable, linkedWeaknesses, linkedOpportunities, elementsReducer, dispatchLinkedRecords } = this.props;
    const { open, name, singularTitle, title, placeholder } = this.state;

    return (
      <div>
        <Row className='title-section' style={{ padding: "0px 10px 10px 0px" }}>
          <Col xs={12} md={12} lg={12}>
            <div className="header-component">
              <div className="line-topComponent" />
              <i className="lightbulb icon" style={{ fontSize: "25px" }} />
              <span className="title-middle">Oportunidades y Debilidades<span style={{ fontSize: "20px" }}>(<span style={{ color: "red" }}>*</span>)</span></span>
            </div>
          </Col>
        </Row>


        <Row style={{ width: '100%', marginTop: 15 }}>
          <Col xs={6}>
            <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
              <div className="tab-content-row" style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
              <i className={ICON_OPPORTUNITIES} style={{ fontSize: "20px", marginLeft: "25px" }} />
              <span style={{ fontSize: "20px" }}>{TITLE_OPPORTUNITIES}</span>
              <Tooltip text={MSG_HELP_OPPORTUNITIES}>
                <i className="help circle icon blue" style={{ fontSize: "16px", cursor: "pointer", marginLeft: "10px" }} />
              </Tooltip>
            </div>
            {!opportunities.length ?
              <ElementsComponent
                schema={schemaoOportunitiesWeaknesses}
                placeholder={OPPORTUNITIES_PLACEHOLDER}
                messageButton={`Crear ${SINGULAR_TITLE_OPPORTUNITIES}`}
                name={OPPORTUNITIES}
                max={5}
                title={TITLE_OPPORTUNITIES}
                isEditable={!isEditable}
                singularTitle={`la ${SINGULAR_TITLE_OPPORTUNITIES}`}
                showCheck={true}
                executeFunction={() => dispatchLinkedRecords(OPPORTUNITIES)}
                idButton={'Oportunidades'}
              />
              :
              <div>
                <Row style={{ padding: "10px 10px 20px 20px", marginBottom: 30, display: 'flex', flexDirection: 'row' }} end="xs">
                  <Col xs={1} md={1} lg={1} style={{ justifySelf: 'end' }}>
                    <Icon
                      className='icon-message-elements'
                      size='huge'
                      name={'add square'}
                      style={{ color: '#16498b', fontSize: '34pt !important', margin: '0px 20px 10px 20px', cursor: 'pointer' }}
                      onClick={() => {
                        if (!this.state.elements) {
                          this.setState({ elements: Object.assign([], elementsReducer[OPPORTUNITIES].elements) });
                        }

                        this.setState({
                          open: true,
                          name: OPPORTUNITIES,
                          singularTitle: SINGULAR_TITLE_OPPORTUNITIES,
                          title: TITLE_OPPORTUNITIES,
                          placeholder: OPPORTUNITIES_PLACEHOLDER
                        });
                      }}
                    />
                  </Col>
                </Row>
                <Row style={{ padding: "10px 10px 20px 30px", marginBottom: 70, width: '99%' }} end="xs">
                  <ItemList
                    data={linkedOpportunities}
                    handleDelete={undefined}
                    handleEdit={undefined}
                    handleOnSelect={(element, { target: { checked } }) => this.handleOnSelect(OPPORTUNITIES, element, checked, singularTitle)}
                    showCheck={true}
                    title={TITLE_OPPORTUNITIES}
                    isEditable={!isEditable}
                    show={false}
                  />
                </Row>
              </div>
            }
          </Col>

          <Col xs={6}>
            <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
              <div className="tab-content-row" style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
              <i className={ICON_WEAKNESSES} style={{ fontSize: "20px", marginLeft: "25px" }} />
              <span style={{ fontSize: "20px" }}>{TITLE_WEAKNESSES}</span>
              <Tooltip text={MSG_HELP_WEAKNESSES}>
                <i className="help circle icon blue" style={{ fontSize: "16px", cursor: "pointer", marginLeft: "10px" }} />
              </Tooltip>
            </div>
            {!weaknesses.length ?
              <ElementsComponent
                schema={schemaoOportunitiesWeaknesses}
                placeholder={WEAKNESSES_PLACEHOLDER}
                messageButton={`Crear ${SINGULAR_TITLE_WEAKNESSES}`}
                name={WEAKNESSES}
                max={5}
                title={TITLE_WEAKNESSES}
                isEditable={!isEditable}
                singularTitle={`la ${SINGULAR_TITLE_WEAKNESSES}`}
                showCheck={true}
                executeFunction={() => dispatchLinkedRecords(WEAKNESSES)}
                idButton={'Debilidades'}
              />

              :

              <div>
                <Row style={{ padding: "10px 10px 20px 20px", marginBottom: 30, display: 'flex', flexDirection: 'row' }} end="xs">
                  <Col xs={1} md={1} lg={1} style={{ justifySelf: 'end' }}>
                    <Icon
                      className='icon-message-elements'
                      size='huge'
                      name={'add square'}
                      style={{ color: '#16498b', fontSize: '34pt !important', margin: '0px 20px 10px 20px', cursor: 'pointer' }}
                      onClick={() => {
                        if (!this.state.elements) {
                          this.setState({ elements: Object.assign([], elementsReducer[WEAKNESSES].elements) });
                        }

                        this.setState({
                          open: true,
                          name: WEAKNESSES,
                          singularTitle: SINGULAR_TITLE_WEAKNESSES,
                          title: TITLE_WEAKNESSES,
                          placeholder: WEAKNESSES_PLACEHOLDER
                        });
                      }}
                    />
                  </Col>
                </Row>
                <Row style={{ padding: "10px 10px 20px 30px", marginBottom: 70, width: '99%' }} end="xs">
                  <ItemList
                    data={linkedWeaknesses}
                    handleDelete={undefined}
                    handleEdit={undefined}
                    handleOnSelect={(element, { target: { checked } }) => this.handleOnSelect(WEAKNESSES, element, checked, singularTitle)}
                    showCheck={true}
                    title={TITLE_WEAKNESSES}
                    isEditable={!isEditable}
                    show={false}
                  />
                </Row>
              </div>
            }
          </Col>
        </Row>

        <Modal isOpen={open} onRequestClose={() => this.handleCancel(this.state.elements)} className="modalBt4-fade modal fade contact-detail-modal in" style={{ zIndex: 100 }}>
          <div className="modalBt4-dialog modalBt4-lg" style={{ zIndex: 100 }}>
            <div className="modalBt4-content modal-content" style={{ zIndex: 100 }}>
              <div className="modalBt4-header modal-header">
                <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }} id="myModalLabel">{title}</h4>

                <button type="button" onClick={() => this.handleCancel(this.state.elements)} className="close" data-dismiss="modal" role="close">
                  <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                  <span className="sr-only">Close</span>
                </button>
              </div>

              {name &&
                <div>
                  <Message message={"Señor usurario, Los cambios realizados se verán reflejados en la información del cliente"} show={true} icon={'exclamation'} />
                  <ModalContentComponent
                    name={name}
                    singularTitle={singularTitle}
                    title={title}
                    placeholder={placeholder}
                    isEditable={!isEditable}
                    handleCloseModal={this.handleCloseModal}
                    handleCancel={this.handleCancel}
                  />
                </div>
              }
            </div>
          </div>
        </Modal>
      </div >
    );
  }
}

const mapStateToProps = ({ elementsReducer }) => ({
  elementsReducer,
  weaknesses: elementsReducer[WEAKNESSES].elements || [],
  opportunities: elementsReducer[OPPORTUNITIES].elements || [],
  linkedWeaknesses: elementsReducer[WEAKNESSES].linkedRecords || [],
  linkedOpportunities: elementsReducer[OPPORTUNITIES].linkedRecords || [],
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    dispatchAddToList: addToList,
    dispatchResetRecords: resetRecords,
    dispatchLinkedRecords: linkedRecords,
    dispatchSwtShowMessage: swtShowMessage
  }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectOpportunitiesWeaknesses);
