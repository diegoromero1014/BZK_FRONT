import React, {
  Component
} from 'react';
import GridComponent from '../grid/component';

const headers = [
  {
      title: "Nombre",
      key: "firstName"
  },
  {
    title: "Telefono",
    key:"middleName"
  },
  {
    title: "Celular",
    key:"firstName"
  },
  {
    title: "Correo",
    key:"firstName"
  },
  {
    title: "Ciudad",
    key:"firstName"
  },
  {
    title: "Tipo Contacto",
    key:"firstName"
  },
  {
    title: "Cargo",
    key:"firstName"
  },
  {
    title: "",
    key:"actions"
  }
];

const data = [
  {
    firstName: "1",
    middleName:"dfdf",
    actions: {
      actionView: true,
      id: 1,
      urlServer: "./component",
      component : "VIEW_CONTACT"
    }
  },
  {
    firstName: "2",
    middleName:"fsfdsf",
    actions: {
      actionView: true,
      id: 2,
      urlServer: "ddgfgf",
      component: "component",
    }
  }
];

class ListContactComponent extends Component {

  render() {
    const modalTitle = 'Contacto Detalle';
    return (
      <div className="col-xs-12 horizontal-scroll-wrapper">
        <GridComponent headers={headers} data={data} modalTitle={modalTitle} />
      </div>
    );
  }
}

export default ListContactComponent;
