/**
 * Created by ahurtado on 15/02/2016.
 */
import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import { updateTitleNavBar } from '../../navBar/actions';
import SearchGroup from './searchGroup';
import ListGroup from './listGroups';
import Pagination from './pagination';
import {NUMBER_RECORDS} from './constants';
import {clearFilterGroup} from './actions';
import {showLoading} from '../../loading/actions';
import ButtonCreateGroup from './buttonCreateGroup';

class FavoritesGroup extends Component {
    constructor(props) {
        super(props);
        this._cleanSearch = this._cleanSearch.bind(this);
    }

    componentWillMount() {
        const {updateTitleNavBar,clearFilterGroup} = this.props;
        updateTitleNavBar("Grupos de contactos favoritos");
        clearFilterGroup();
    }

    _cleanSearch() {
        const {showLoading,clearFilterGroup} = this.props;
        showLoading(true, 'Cargando...');
        clearFilterGroup().then((data) => {
            if (_.has(data, 'payload.data.data')) {
                showLoading(false, null);
            }
        });
    }


    render() {
        const {groupsFavoriteContacts} = this.props;
        const countFilter = groupsFavoriteContacts.get('totalGroupByFiltered');
        let visibleTable = "none";
        let visibleMessage = "block";
        if (_.size(groupsFavoriteContacts.get('responseGroup')) !== 0) {
            visibleTable = 'block';
            visibleMessage = 'none';
        }

        return (
            <div style={{height: "115%"}}>
                <Row style={{borderBottom: "2px solid #D9DEDF", marginTop: "15px"}}>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <SearchGroup />
                    </Col>
                    <Col xs={12} sm={12} md={2} lg={2} style={{width: '100%'}}>
                        <button className="btn btn-primary" type="button" onClick={this._cleanSearch}
                                title="Limpiar búsqueda" style={{marginLeft: "17px"}}>
                            <i className="erase icon"
                               style={{color: "white", margin: '0em', fontSize: '1.2em'}}></i>
                        </button>
                    </Col>
                    <Col xsOffset={3} lg={1}>
                        <ButtonCreateGroup/>
                    </Col>
                </Row>
                <Row>
                    <div style={{padding: "15px", fontSize: '25px', textAlign: 'center', width: '100%'}}>
                        Total: {countFilter}
                    </div>
                </Row>

                <Row>
                    <Col xs={12} md={12} lg={12}>
                        <Grid style={{display: visibleTable, width: "98%"}}>
                            <Row>
                                <Col xs>
                                    <ListGroup />
                                    <Pagination />
                                </Col>
                            </Row>
                        </Grid>
                        <Grid style={{display: visibleMessage, width: "100%"}}>
                            <Row center="xs">
                                <Col xs={12} sm={8} md={12} lg={12}>
                                    <span style={{fontWeight: 'bold', color: '#4C5360'}}>No se han encontrado resultados para la búsqueda</span>
                                </Col>
                            </Row>
                        </Grid>
                    </Col>
                </Row>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateTitleNavBar, clearFilterGroup, showLoading
    }, dispatch);
}

function mapStateToProps({groupsFavoriteContacts}, {ownerProps}) {
    return {groupsFavoriteContacts};
}

export default connect(mapStateToProps, mapDispatchToProps)(FavoritesGroup);

