/**
 * Created by Andres Hurtado on 16/03/2017.
 */
import React, {Component} from 'react';
import {Row, Col} from 'react-flexbox-grid';
import ComboBox from '../../../../ui/comboBox/comboBoxComponent';
import Input from '../../../../ui/input/inputComponent';
import {bindActionCreators} from 'redux';
import {deleteLinkEntity, updateLinkEntity} from './actions';
import {updateErrorsLinkEntities} from '../../../clientDetailsInfo/actions';
import {connect} from 'react-redux';
import _ from 'lodash';
import {ENTITY_BANCOLOMBIA, ENTITY_VALORES_BANCOLOMBIA} from './constants';
import {swtShowMessage} from '../../../sweetAlertMessages/actions';

class EntityItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            traderCode: '',
            entity: '',
            isTraderVisible: false
        };
        this._updateValue = this._updateValue.bind(this);
        this._deleteLinkEntity = this._deleteLinkEntity.bind(this);
        this._onChange = this._onChange.bind(this);
        this.firstChange = false;
    }

    _updateValue(prop, value, text) {
        const {updateLinkEntity, index, linkEntitiesClient} = this.props;
        this.setState(_.set({}, prop, value));
        const self = this;
        updateLinkEntity(index, prop, value);
        if (_.isEqual('entity', prop)) {
            this.setState(_.set({}, 'entityName', text));
        }
        updateLinkEntity(index, 'entityText', text);
        linkEntitiesClient.map(linkEntity => {
            if (!_.isEmpty(text)) {
                if (_.isEqual(ENTITY_BANCOLOMBIA.toLowerCase(), text.toLowerCase())
                    || _.isEqual(ENTITY_VALORES_BANCOLOMBIA.toLowerCase(), text.toLowerCase())) {
                    self.setState(_.set({}, 'isTraderVisible', true));
                } else {
                    self.setState(_.set({}, 'isTraderVisible', false));
                    self.setState(_.set({}, 'traderCode', ''));
                }
            }
        });
    }

    _deleteLinkEntity() {
        const {index, deleteLinkEntity} = this.props;
        deleteLinkEntity(index);
    }

    componentDidMount() {
        const {entity, traderCode} = this.props;
        this.setState(_.set({}, 'entity', entity));
        this.setState(_.set({}, 'traderCode', traderCode));
    }

    _onChange(val, text) {

        const {linkEntitiesClient, swtShowMessage} = this.props;
        let exists = false;

        linkEntitiesClient.map(linkEntity => {
            if (linkEntity.entity == val) {
                exists = true;
            }
        });

        if (! exists || ! this.firstChange) {
            if (! this.firstChange) {
                this.firstChange = true;
            }
            this._updateValue('entity', val, text);
        } else {
            swtShowMessage("warning", "Error!",'El cliente ya tiene seleccionada esta linea de negocio');
            this._updateValue('entity', val, text);
        }           
    }

    render() {
        const {index, data} = this.props;
        const allowEdit = !this.state.isTraderVisible ? 'disabled' : '';
        return (
            <div>
                <Row>
                    <Col xs={12} md={6} lg={6}>
                        <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
                            <dt><span>Entidad/Línea de negocio (</span><span style={{color: "red"}}>*</span>)</dt>
                            <ComboBox
                                name={`linkEntity${index}`}
                                value={this.state.entity}
                                defaultValue={this.state.entity}
                                onChange={this._onChange}                                
                                valueProp={'id'}
                                textProp={'value'}
                                data={data}
                            />
                        </div>
                    </Col>
                    <Col xs={10} md={5} lg={5}>
                        <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
                            <dt><span>Código del comercial </span>
                                {
                                    this.state.isTraderVisible &&
                                    <span>(<span style={{color: "red"}}>*</span>)</span>
                                }
                            </dt>
                            <Input
                                type="text"
                                style={{height: "22px !important", minHeight: "26px !important", width: "100%"}}
                                value={this.state.traderCode}
                                max={255}
                                disabled={allowEdit}
                                onChange={(val) => {
                                    return this._updateValue('traderCode', val, this.state.entityName);
                                }}
                            />
                        </div>
                    </Col>
                    <Col xs={1} md={1} lg={1} style={{marginTop: "38px"}}>
                        <button onClick={this._deleteLinkEntity}
                                title="Eliminar"
                                className="btn btn-sm  btn-danger"
                                type="button">
                            <i style={{margin: '0em', fontSize: '1.2em'}} className="trash icon"/>
                        </button>
                    </Col>
                </Row>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        deleteLinkEntity,
        updateLinkEntity,
        updateErrorsLinkEntities, 
        swtShowMessage
    }, dispatch);
}


function mapStateToProps({linkEntitiesClient}) {
    return {linkEntitiesClient};
}

export default connect(mapStateToProps, mapDispatchToProps)(EntityItem);
