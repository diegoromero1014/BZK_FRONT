import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {redirectUrl} from '../globalComponents/actions';
import {changeOwnerDraft} from '../visit/actions';
import {changeOwnerDraftPrevisit} from '../previsita/actions';
import {changeOwnerDraftPipeline} from '../pipeline/actions';
import {seletedButton,validateContactShareholder} from '../clientDetailsInfo/actions';
import {updateTitleNavBar} from '../navBar/actions';
import {consultInfoClient} from '../clientInformation/actions';
import {showLoading} from '../loading/actions';
import {BUTTON_UPDATE} from '../clientDetailsInfo/constants';
import {isUndefined,has} from 'lodash';

class ButtonDetailsRedirectComponent extends Component {

  constructor(props){
    super(props);
    this._detailVisit = this._detailVisit.bind(this);
  }

  _detailVisit(){
    const {actionsRedirect, updateTitleNavBar, validateContactShareholder,changeOwnerDraft,
        changeOwnerDraftPrevisit, changeOwnerDraftPipeline,consultInfoClient,seletedButton,showLoading } = this.props;
    if( actionsRedirect.typeClickDetail === "visita"){
      updateTitleNavBar("Informe de visita/reunión");
      changeOwnerDraft(actionsRedirect.ownerDraft);
        redirectUrl(actionsRedirect.urlRedirect + '/' + actionsRedirect.id);
    } else if( actionsRedirect.typeClickDetail === "previsita" ){
      updateTitleNavBar("Informe de previsita");
      changeOwnerDraftPrevisit(actionsRedirect.ownerDraft);
        redirectUrl(actionsRedirect.urlRedirect + '/' + actionsRedirect.id);
    } else if (actionsRedirect.typeClickDetail === "pipeline") {
      updateTitleNavBar("Informe de pipeline");
      changeOwnerDraftPipeline(actionsRedirect.ownerDraft);
        redirectUrl(actionsRedirect.urlRedirect + '/' + actionsRedirect.id);
    } else if (actionsRedirect.typeClickDetail === "businessPlan") {
      updateTitleNavBar("Informe de plan de negocio");
      changeOwnerDraftPipeline(actionsRedirect.ownerDraft);
      redirectUrl(actionsRedirect.urlRedirect + '/' + actionsRedirect.id);
    }else if (actionsRedirect.typeClickDetail === "clientEdit") {
        showLoading(true, 'Cargando cliente...');
        window.localStorage.setItem('idClientSelected',actionsRedirect.id);
        seletedButton(BUTTON_UPDATE);
        consultInfoClient().then((data)=> {
            if (has(data,'payload.data.clientInformation')) {
                showLoading(false,null);
                redirectUrl(actionsRedirect.urlRedirect);
            }
        });
        validateContactShareholder();
    }

  }

  render(){
    const iconButton = isUndefined(this.props.icon) ? "zoom icon" : this.props.icon;
    return (
      <td>
        <button className="btn btn-primary btn-sm" onClick={this._detailVisit}>
          <i className={iconButton} style={{margin:'0em', fontSize : '1.2em'}} />
        </button>
      </td>
    );
  }
}

ButtonDetailsRedirectComponent.propTypes = {
  actionsRedirect: PropTypes.object,
  icon: PropTypes.string
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateTitleNavBar,
        changeOwnerDraft,
        changeOwnerDraftPrevisit,
        changeOwnerDraftPipeline,
        seletedButton,
        consultInfoClient,
        validateContactShareholder,
        showLoading
  }, dispatch);
}

function mapStateToProps({navBar, visitReducer}, ownerProps){
  return {
    navBar,
    visitReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonDetailsRedirectComponent);
