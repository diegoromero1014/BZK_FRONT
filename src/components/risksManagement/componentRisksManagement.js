/**
 * Created by IAS-ASUS on 2/1/2017.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Menu, Segment} from 'semantic-ui-react';
import {MODULE_COVENANTS} from '../../constantsGlobal';
import {consultModulesAccess} from '../navBar/actions';
import ListCovenant from './covenants/listCovenants';

class RisksManagementComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openMessagePermissions: false,
            value1: "",
            activeItem: MODULE_COVENANTS,
            viewCovenants:true
        };
    }


    _handleItemClick(name){
        if(name == MODULE_COVENANTS){
            this.setState({viewCovenants:true})
        }else{
            this.setState({viewCovenants:false})
        }
        this.setState({activeItem: name});
    }


    componentWillMount() {
        const {consultModulesAccess} = this.props;
        consultModulesAccess();
    }

    render() {
        const {navBar} = this.props;
        const {activeItem,viewCovenants} = this.state;

        return (
            <div className="tab-pane quickZoomIn animated"
                 style={{width: "100%", marginTop: "10px", marginBottom: "70px", paddingTop: "20px"}}>
                <Menu pointing secondary>
                    {_.get(navBar.get('mapModulesAccess'), MODULE_COVENANTS) &&
                        <Menu.Item name={MODULE_COVENANTS} active={activeItem === MODULE_COVENANTS} onClick={this._handleItemClick.bind(this,MODULE_COVENANTS)}/>
                    }
                </Menu>
                <Segment>
                    {_.get(navBar.get('mapModulesAccess'), MODULE_COVENANTS) && viewCovenants && <ListCovenant/>}
                </Segment>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({consultModulesAccess}, dispatch);
}

function mapStateToProps({navBar}, ownerProps) {
    return {
        navBar
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(RisksManagementComponent);
