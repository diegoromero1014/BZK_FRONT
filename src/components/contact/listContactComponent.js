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
  }
];

const data = [
  {
    firstName: "1",
    middleName:"dfdf"
  },
  {
    firstName: "2",
    middleName:"fsfdsf"
  }
];

class ListContactComponent extends Component {

  render() {
    return ( < div className = "col-xs-12 horizontal-scroll-wrapper" >
      <GridComponent headers={headers} data={data} />
    </div>
    );
  }
}

export default ListContactComponent;
