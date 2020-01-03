import React from "react";
import ListaObjetos from "../../../../src/components/listaObjetos/ListaObjetos";
// import { Row, Col } from "react-flexbox-grid";
// import ToolTip from "../toolTip/toolTipComponent";
// import SweetAlert from "../sweetalertFocus";

let defaultProps = {};
let objeto = {id: "", texto: ""};
let objetos = [];

// let defaultState = {
//   objeto: {
//     id: "",
//     texto: ""
//   },
//   objetos: [],
//   campoObjeto: false,
//   campoVacio: false,
//   idObjetoEliminar: "",
//   modalEliminar: false,
//   switchGuardarEditar: false,
//   stylePlus: false
// };

// let defaultProps = {};

describe("Unit tests of the listaObjetos.js component", () => {

    it('should render component', () => {
        itRenders(<ListaObjetos {...defaultProps} />);
    });
    
    // it('should render Aun no se han adicionado ', () => {
        
    // });
    
    // it('Renders with a className equal to the variant', () => {
    //     const { container } = render(<Button variant="default" />)
    //     expect(container.firstChild) // Check for className here
    // })

});  