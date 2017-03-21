/**
 * Created by Andres Hurtado on 16/03/2017.
 */
import React, {Component, PropTypes} from 'react';
import {Row, Col} from 'react-flexbox-grid';
import ComboBox from '../../../../ui/comboBox/comboBoxComponent';
import Input from '../../../../ui/input/inputComponent';
import {bindActionCreators} from 'redux';
import {deleteLinkEntity, updateLinkEntity} from './actions';
import {updateErrorsLinkEntities} from '../../../clientDetailsInfo/actions';
import {connect} from 'react-redux';
import _ from 'lodash';
import {ENTITY_BANCOLOMBIA, ENTITY_VALORES_BANCOLOMBIA} from './constants';

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
    }

    _updateValue(prop, value, text) {
        const {updateLinkEntity, index, updateErrorsLinkEntities, linkEntitiesClient} = this.props;
        this.setState(_.set({}, prop, value));
        const self = this;
        updateLinkEntity(index, prop, value);
        let entitiesArray = [];
        linkEntitiesClient.map(map => {
            const noteItem = {
                "entity": map.entity,
                "traderCode": map.traderCode
            };
            entitiesArray.push(noteItem);
        });
        updateErrorsLinkEntities(false);
        entitiesArray.forEach(function (linkEntity) {
            if (_.isEqual(linkEntity.entity, "") || _.isEqual(linkEntity.entity, null)) {
                updateErrorsLinkEntities(true);
            }
            if (!_.isEmpty(text)) {
                if (_.isEqual(ENTITY_BANCOLOMBIA.toLowerCase(), text.toLowerCase()) || _.isEqual(ENTITY_VALORES_BANCOLOMBIA.toLowerCase(), text.toLowerCase())) {
                    self.setState(_.set({}, 'isTraderVisible', true));
                    if (_.isEqual(linkEntity.traderCode, "") || _.isEqual(linkEntity.traderCode, null)) {
                        updateErrorsLinkEntities(true);
                    }
                }else{
                    self.setState(_.set({}, 'isTraderVisible', false));
                }
            }
        });
    }

    _deleteLinkEntity() {
        const {index, deleteLinkEntity} = this.props;
        deleteLinkEntity(index);
    }

    componentWillMount() {
        const {entity, traderCode} = this.props;
        this._updateValue("entity", entity);
        this._updateValue("traderCode", traderCode);
        if (_.isEqual(_.isEqual(entity, "") || _.isEqual(entity, null))) {
            updateErrorsLinkEntities(true);
        }
    }

    componentDidMount() {
        const {entity, traderCode} = this.props;
        this._updateValue("entity", entity);
        this._updateValue("traderCode", traderCode);
    }

    render() {
        const {entity, traderCode, index, _onBlurField, data} = this.props;
        return (
            <div>
                <Row>
                    <Col xs={12} md={6} lg={6} style={{marginTop: "15px"}}>
                        <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
                            <dt><span>Entidad/Línea de negocio(</span><span style={{color: "red"}}>*</span>)</dt>
                            <ComboBox
                                name={`linkEntity${index}`}
                                value={this.state.entity}
                                defaultValue={this.state.entity}
                                onChange={(val, text) => {
                                    return this._updateValue('entity', val, text);
                                }}
                                onBlur={() => console.log.bind(console)}
                                valueProp={'id'}
                                textProp={'value'}
                                data={data}
                            />
                        </div>
                    </Col>
                    <Col xs={10} md={5} lg={5} style={{marginTop: "15px"}}>
                        {
                            this.state.isTraderVisible && <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
                                <dt><span>Código del comercial(</span><span style={{color: "red"}}>*</span>)</dt>
                                <Input
                                    type="text"
                                    style={{height: "22px !important", minHeight: "26px !important", width: "100%"}}
                                    value={this.state.traderCode}
                                    max={600}
                                    onChange={this._updateValue.bind(this, 'traderCode')}
                                    onBlur={() => console.log}
                                />
                            </div>
                        }
                    </Col>
                    <Col xs={1} md={1} lg={1} style={{marginTop: "37px"}}>
                        <button onClick={this._deleteLinkEntity}
                                title="Eliminar"
                                className="btn btn-sm  btn-danger"
                                type="button">
                            <i style={{margin: '0em', fontSize: '1.2em'}} className="trash outline icon"/>
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
        updateErrorsLinkEntities
    }, dispatch);
}


function mapStateToProps({linkEntitiesClient}) {
    return {linkEntitiesClient};
}

export default connect(mapStateToProps, mapDispatchToProps)(EntityItem);
