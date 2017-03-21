/**
 * Created by Andres Hurtado on 17/03/2017.
 */
import React, {Component} from 'react';
import {Row, Col} from 'react-flexbox-grid';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {updateLinkEntity, addEntity} from './actions';
import {getMasterDataFields} from '../../../selectsComponent/actions';
import {FILTER_TYPE_LBO_ID} from '../../../selectsComponent/constants';
import LinkEntity from './entityItem';
import _ from 'lodash';
import {Button, Icon} from 'semantic-ui-react'

class LinkEntitiesClient extends Component {
    constructor(props) {
        super(props);
        this._mapLinkEntitiesItems = this._mapLinkEntitiesItems.bind(this);
        this._addEntity = this._addEntity.bind(this);
    }

    _updateValue(index, e) {
        const {updateLinkEntity} = this.props;
        updateLinkEntity(index, "traderCode", e);
    }

    _updateValueList(index, value) {
        const {updateLinkEntity} = this.props;
        updateLinkEntity(index, "entity", value);
    }

    componentWillMount() {
        const {getMasterDataFields} = this.props;
        getMasterDataFields([FILTER_TYPE_LBO_ID]);
    }

    _addEntity() {
        const {addEntity} = this.props;
        const uuid = _.uniqueId('entity_');
        addEntity(uuid);
    }

    _mapLinkEntitiesItems(entity) {
        const {selectsReducer} = this.props;
        return <LinkEntity
            index={entity.uid}
            key={entity.uid}
            traderCode={entity.traderCode}
            entity={entity.entity}
            data={selectsReducer.get(FILTER_TYPE_LBO_ID) || []}
        />
    }

    render() {
        const {linkEntitiesClient, tabReducer} = this.props;
        return (
            <Row style={{padding: "0px 10px 20px 20px"}}>
                <Col xs={12} md={12} lg={12} style={{marginTop: "-50px", paddingRight: "35px", textAlign: "right"}}>
                    <button title="Agregar entidad de vinculación" className="btn" style={{margin: "12px 0px 0px 12px"}}
                            type="button"
                            onClick={this._addEntity}
                    >
                        <i className="plus icon" style={{color: "white", padding: "3px 0 0 5px"}}/>
                    </button>
                </Col>
                <Col xs={12} md={12} lg={12} style={{marginTop: "5px", paddingRight: "35px"}}>
                    {tabReducer.get('errorEditLinkEntitiesClient') && linkEntitiesClient.size > 0 &&
                    <div>
                        <div className="ui pointing below red basic label">
                            Debe ingresar todos los campos
                        </div>
                    </div>
                    }
                    <div style={tabReducer.get('errorEditLinkEntitiesClient') && linkEntitiesClient.size > 0 ? {
                            paddingBottom: "20px",
                            border: "1px solid red",
                            borderRadius: "5px"
                        } : {}}>
                        {linkEntitiesClient.size == 0 ? <center><h4>No tiene entidades vinculadas.</h4></center>
                            :linkEntitiesClient.map(this._mapLinkEntitiesItems)
                        }
                    </div>
                </Col>
            </Row>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getMasterDataFields,
        updateLinkEntity,
        addEntity
    }, dispatch);
}

function mapStateToProps({linkEntitiesClient, selectsReducer, tabReducer}) {
    return {
        linkEntitiesClient,
        selectsReducer,
        tabReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LinkEntitiesClient);
