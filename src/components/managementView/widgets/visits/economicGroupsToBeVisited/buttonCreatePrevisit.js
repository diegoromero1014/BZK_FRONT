import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { redirectUrl } from '../../../../globalComponents/actions';
import { updateTitleNavBar } from '../../../../navBar/actions';
import { consultInfoClient } from '../../../../clientInformation/actions'; 
import { changeActiveItemMenu } from '../../../../menu/actions'; 
import { MODULE_MY_CLIENTS, TAB_PREVISITS} from "../../../../../constantsGlobal";
import { updateTabSeleted } from '../../../../clientDetailsInfo/actions';

export class ButtonCreatePrevisit extends Component {
    
    constructor(props) {
        super(props)
    }
    
    handleClick = async data => {
        const { 
            dispatchConsultInfoClient, 
            disptachUpdateTitleNavBar,
            dispatchChangeActiveItemMenu,
            dispatchUpdateTabSeleted
         } = this.props;
        dispatchChangeActiveItemMenu(MODULE_MY_CLIENTS)
        window.sessionStorage.setItem('idClientSelected', data);
        dispatchUpdateTabSeleted(TAB_PREVISITS);
        await dispatchConsultInfoClient(data);
        disptachUpdateTitleNavBar("Informe de previsita");
        redirectUrl("/dashboard/previsita");
    }

    render() {
        const { data } = this.props;
        return <button 
                    className="btn btn-primary btn-sm" 
                    type="button"
                    style={{background : "#00448C"}}
                    title="Crear Previsita"
                    onClick={() => this.handleClick(data)}
                >
                    <i 
                        className="plus icon"
                        style={{
                            color: "white",
                            marginRight: "5px",
                            fontSize: "8pt"
                        }}
                    />
                    Crear
                </button>
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    disptachUpdateTitleNavBar: updateTitleNavBar,
    dispatchConsultInfoClient: consultInfoClient,
    dispatchChangeActiveItemMenu: changeActiveItemMenu,
    dispatchUpdateTabSeleted: updateTabSeleted
}, dispatch);
  
export default connect(null, mapDispatchToProps)(ButtonCreatePrevisit);