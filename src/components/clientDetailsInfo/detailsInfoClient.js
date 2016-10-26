import React, {Component, PropTypes} from 'react';
import ActividadEconomica from './actividadEconomica';
import UbicationCorrespondence from './ubicationCorrespondence';
import InfoFinanciera from './infoFinanciera';
import DataComercial from './dataComercial';
import DeclarationOfOrigin from './DeclarationOfOrigin';
import InternationalOperations from './internationalOperations';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {seletedButton, validateContactShareholder, sendErrorsUpdate} from './actions';
import {BUTTON_UPDATE, BUTTON_EDIT, CONSULT} from './constants';
import Notas from './notas';
import {bindActionCreators} from 'redux';
import Products from './product';
import {connect} from 'react-redux';
import moment from 'moment';
import {redirectUrl} from '../globalComponents/actions';

class DetailsInfoClient extends Component{
  constructor(props){
    super(props);

    this._clickButtonClientEdit = this._clickButtonClientEdit.bind(this);
    this._clickButtonClientUpdate = this._clickButtonClientUpdate.bind(this);
  }

  componentWillMount(){
    const {login} = this.props;
    if( window.localStorage.getItem('sessionToken') === "" ){
      redirectUrl("/login");
    }
  }

  _mapNoteItems(item, idx){
    return <Notas
        typeOfNoteKey={item.typeOfNoteKey}
        note={item.note}
        key={idx+1}
    />
  }

  _mapProductItems(item, idx){
    return <Products
            name={item.name}
            type={item.typeKey}
            num={item.number}
            averageMontlyAmount={item.averageMontlyAmount}
            coin={item.coin}
            country={item.countryKey}
            city={item.city}
            key={idx+1}
    />
  }

  _clickButtonClientEdit(){
    const {seletedButton} = this.props;
    seletedButton(BUTTON_EDIT);
    redirectUrl("/dashboard/clientEdit");
  }

  _clickButtonClientUpdate(){
    const {seletedButton, validateContactShareholder, updateClient, sendErrorsUpdate} = this.props;
    seletedButton(BUTTON_UPDATE);
    //Valido si el cliente tiene un representante legal y accionistas
    validateContactShareholder().then( (data) => {
      if(!_.get(data, 'payload.data.validateLogin')){
        redirectUrl("/login");
      } else {
        redirectUrl("/dashboard/clientEdit");
      }
    });
  }

  render(){
    const {infoClient, menuState} = this.props;

    var actualizationDateString = "";
    if( infoClient.actualizationDate !== null && infoClient.actualizationDate !== undefined ){
      var actualizationDate = moment(infoClient.actualizationDate).locale('es');
      actualizationDateString = actualizationDate.format("DD") + " " + actualizationDate.format("MMM") + " " + actualizationDate.format("YYYY");
    }
    var {notes} = infoClient;
    if( notes === undefined || notes === null ){
      notes = [];
    }
    var {foreignProducts} = infoClient;
    if( foreignProducts === undefined || foreignProducts === null ){
      foreignProducts = [];
    }

    var paddingDivEdit = "0px";
    if(infoClient.haveAccessEdit){
      paddingDivEdit = "50px";
    }
    return(
      <div style={{width: "100%", marginTop: "10px", marginBottom: "70px"}}>
        <div style={{paddingBottom: paddingDivEdit, paddingTop: "10px"}}>
          <table style={{width: "100%"}}>
            <thead>
              <tr>
                <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Entidad/Línea de negocio</span></th>
                <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Segmento</span></th>
                <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Subsegmento</span></th>
                <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Grupo de riesgo</span></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{width: "25%", verticalAlign: "initial"}}>
                  <span style={{marginLeft: "0px"}}>{infoClient.lineOfBusinessKeys}</span>
                </td>
                <td style={{width: "25%", verticalAlign: "initial"}}>
                  <span style={{marginLeft: "0px"}}>{infoClient.segmentKey}</span>
                </td>
                <td style={{width: "25%", verticalAlign: "initial"}}>
                  <dl className="company-detail-dl">
                    <dd style={{marginLeft: "0px"}}>{infoClient.subSegmentKey}</dd>
                  </dl>
                </td>
                <td style={{width: "25%", verticalAlign: "initial"}}>
                  <span style={{marginLeft: "0px"}}>{infoClient.riskGroup}</span>
                </td>
              </tr>
            </tbody>
          </table>

          <table style={{width: "100%", marginTop: "20px", marginBottom: "30px"}}>
            <thead>
              <tr>
                <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Fecha de actualización</span></th>
                <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Estado</span></th>
                <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Estado de certificación</span></th>
                <th><span style={{fontWeight: "bold", color: "#4C5360"}}></span></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{width: "25%", verticalAlign: "initial"}}>
                  <span style={{marginLeft: "0px"}}>{actualizationDateString}</span>
                </td>
                <td style={{width: "25%", verticalAlign: "initial"}}>
                  <span style={{marginLeft: "0px"}}>{infoClient.clientStatusKey}</span>
                </td>
                <td style={{width: "25%", verticalAlign: "initial"}}>
                  <span style={{marginLeft: "0px"}}>{infoClient.certificationStatusKey}</span>
                </td>
                <td style={{width: "25%", verticalAlign: "initial"}}>
                </td>
              </tr>
            </tbody>
          </table>

          <ActividadEconomica infoClient={infoClient}/>
          <UbicationCorrespondence infoClient={infoClient}/>
          <InfoFinanciera infoClient={infoClient}/>
          <DataComercial infoClient={infoClient}/>
          <div className="tab-content-row" style={{marginTop: "30px",borderTop: "1px dotted #cea70b"}}>
            <table>
              <tbody>
                <tr>
                  <td>
                    <dl style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "0px"}}>
                      <i className="file outline icon" style={{fontSize: "25px"}}></i>
                      <span className="title-middle"> Notas</span>
                    </dl>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {notes.map(this._mapNoteItems)}
          <DeclarationOfOrigin infoClient={infoClient}/>
          <InternationalOperations infoClient={infoClient}/>
          <div className="tab-content-row" style={{marginTop: "30px",borderTop: "1px dotted #cea70b"}}>
            <table>
              <tbody>
                <tr>
                  <td>
                    <dl style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "0px"}}>
                      <i className="payment icon" style={{fontSize: "25px"}}></i>
                      <span className="title-middle"> Productos</span>
                    </dl>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {foreignProducts.map(this._mapProductItems)}
        </div>
        {infoClient.haveAccessEdit &&
          <div className="" style={{marginLeft: "-20px", position: "fixed", border: "1px solid #C2C2C2", bottom: "0px", width:"100%", marginBottom: "0px", backgroundColor: "#F8F8F8", height:"50px", background: "rgba(255,255,255,0.75)"}}>
            <div style={{width: "400px", height: "100%", position: "fixed", right: "0px"}}>
              <a style={{float:"right", margin:"15px 0px 0px 110px", position:"fixed", cursor: "pointer",textDecoration: "underline"}} onClick={this._clickButtonClientEdit}>
                <span>Editar/Modificar</span>
              </a>
              <button className="btn" style={{float:"right", margin:"8px 0px 0px 240px", position:"fixed"}} onClick={this._clickButtonClientUpdate}>
                <span style={{color: "#FFFFFF", padding:"10px"}}>Actualizar</span>
              </button>
            </div>
          </div>
        }
      </div>
    );
  }
}

DetailsInfoClient.PropTypes = {
  infoClient: PropTypes.object.isRequired
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    seletedButton,
    validateContactShareholder,
    sendErrorsUpdate
  }, dispatch);
}

function mapStateToProps({navBar}){
  return {
    menuState: navBar.get('status')
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailsInfoClient);
