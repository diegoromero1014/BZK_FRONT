import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { redirectUrl } from '../globalComponents/actions';
import { ComponentClientInformationURL } from '../../constantsAnalytics';
import HeaderPrevisita from './headerPrevisita';
import PrevisitFormComponent from './previsitFormComponent'
import { detailPrevisit } from "./actions";

export class PrevisitPage extends Component {

    state = {
        previsitData: {}
    };

    componentWillMount() {
        const {params: { id }, clientInformacion } = this.props;
        const infoClient = clientInformacion.get('responseClientInfo');
        
        if(_.isEmpty(infoClient)) {
            redirectUrl(ComponentClientInformationURL)
        }
        
        if(!id) {
            this.getPrevisitData(id);
        }

        this.getPrevisitData(5848809);
     }

    getPrevisitData = id => {
        const { detailPrevisit } = this.props;        
        detailPrevisit(id);
    }

    render() {        
        return (
            <div>
                <HeaderPrevisita />
                <PrevisitFormComponent />
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        detailPrevisit
    }, dispatch);
  }
  
  function mapStateToProps({ clientInformacion }) {
    return {
      clientInformacion
    };
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(PrevisitPage);