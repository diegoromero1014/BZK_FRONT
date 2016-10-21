import * as constants from './constants';

export function updateProduct(product){
  return {
      type: constants.UPDATE,
      product
    };
}

export function deleteProduct(index){
  return {
      type: constants.DELETE,
      index
    };
}

export function addProduct(product){
  return {
      type: constants.CREATE,
      product
    };
}

export function setProducts(products){
  return {
      type: constants.SET,
      products
    };
}

export function clearProducts(){
  return {
      type: constants.CLEAR,
    };
}
