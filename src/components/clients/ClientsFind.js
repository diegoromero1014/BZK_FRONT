import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import ClientListItem from './ClientListItem';
import SearchBarClient from './SearchBarClient';

const clientItems = [
    {
        name: "CLIENTE PRUEBA AYAX EN DESARROLLO 100",
        nit: "900100299",
        economicGroup: "GRUPO YAMIL SABBAGH CONSTRUCCIONES S A YSC S A/800024151",
        url: "a",
        isProspect: true
    },
    {
        name: "CLIENTE PRUEBA AYAX EN DESARROLLO 103",
        nit: "900100302",
        economicGroup: "GRUPO J A ASOCIADOS S /A 890116998",
        url: "a",
        isProspect: false
    },
    {
        name: "CLIENTE PRUEBA AYAX EN DESARROLLO 104",
        nit: "900100302",
        economicGroup: "GRUPO J A ASOCIADOS S /A 890116998",
        url: "a",
        isProspect: false
    },
    {
        name: "CLIENTE PRUEBA AYAX EN DESARROLLO 105",
        nit: "900100304",
        economicGroup: "A CONSTRUIR S A",
        url: "a",
        isProspect: true
    },
    {
        name: "CLIENTE PRUEBA AYAX EN DESARROLLO 109",
        nit: "900100308",
        economicGroup: "MANUFACTURAS REYMON S A",
        url: "a",
        isProspect: false
    },
    {
        name: "CLIENTE PRUEBA AYAX EN DESARROLLO 110",
        nit: "900100309",
        economicGroup: "GRUPO CONSULTORES DEL DESARROLLO S A CONDESA/800165708",
        url: "a",
        isProspect: true
    }
];

class ClientsFind extends Component {

  _mapClientItems(item, idx) {
      return <ClientListItem
          key={idx}
          dataName={item.name}
          dataNit={item.nit}
          dataEconomicGroup={item.economicGroup}
          dataUrl={item.url}
          dataIsProspect={item.isProspect}
      />
  }

    render() {
        return (
          <div id="page-container" className=" condensed full-height" style={{width:"100%", "backgroundColor":"#E7ECED"}}>
            <SearchBarClient />
            <div style={{margin:"0px 0px 10px 10px"}}>
              <div className="news-page content">
                <div className="">
                  <div className="team-modal">
                    {clientItems.map(this._mapClientItems)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
    }
}

export default ClientsFind;
