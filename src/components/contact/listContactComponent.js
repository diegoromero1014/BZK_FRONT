import React, {
  Component,
  PropTypes
} from 'react';
import GridComponent from '../grid/component';

const headers = [
  {
    title: "",
    key:"actions"
  },
  {
      title: "Nombre",
      key: "nameComplet"
  },
  {
    title: "Teléfono",
    key:"telephoneNumber"
  },
  {
    title: "Celular",
    key:"mobileNumber"
  },
  {
    title: "Correo",
    key:"emailAddress"
  },
  {
    title: "Ciudad",
    key:"city"
  },
  {
    title: "Tipo de Contacto",
    key:"typeOfContact"
  },
  {
    title: "Cargo",
    key:"title"
  }
];

class ListContactComponent extends Component {

  constructor(props){
      super(props);
      this._renderCellView = this._renderCellView.bind(this);
  }
  _renderCellView(data){
    return  _.forOwn(data, function(value, key) {
          _.set(value, 'actions',  {
            actionView: true,
            id: value.contactIdentityNumber,
            urlServer: "./component",
            component : "VIEW_CONTACT"
          });
      });
  }
  render() {
    const data = this.props.data;
    const modalTitle = 'Contacto Detalle';
    return ( < div className = "horizontal-scroll-wrapper" >
      <GridComponent headers={headers} data={this._renderCellView(data)} modalTitle={modalTitle}/>
    </div>
    );
  }
}

ListContactComponent.propTypes = {
   data: PropTypes.array
};


export default ListContactComponent;
