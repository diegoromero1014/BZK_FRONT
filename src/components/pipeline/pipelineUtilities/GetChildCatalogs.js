/**
 * Funcion para setear los catálogos hijos correspondientes al campo
 * 
 * @param {number} parentId: Id del catalogo padre.
 * @callback dispatcher: Promise que consulta en servidor los catalogos hijos correspondeintes al campo padre.
 * @callback componentState: Funcion que setea los valores en el state del componente.
 */
export default async function GetChildCatalogs(parentId, dispatcher, componentState){
    //Se resuelve la promesa y se hace destructuring
    const {payload:{data:{data}}} = await dispatcher(parentId);
    //Filtra los datos por campo Familia de productos
    let productsFamily = data.filter((p) => p.field === "productFamily");
    if (productsFamily.length > 0) {
      componentState({productsFamily});
    }
    //Filtra los datos por campo Productos
    let products = data.filter((p) => p.field === "products");
    if(products.length > 0){
        componentState({products});
    }
    //Filtra los datos por campo Categoria del negocio y Categoria del negocio 2
    let businessCategories = data.filter((p) => p.field === "businessCategory");
    if (businessCategories.length > 0) {
      componentState({businessCategories, businessCategories2: businessCategories});
    }

    let pipelineJustification = data.filter((p) => p.field === "pipelineJustification");
    if (pipelineJustification.length > 0) {
      componentState({ pipelineJustification });
    }
}