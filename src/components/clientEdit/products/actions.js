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

export function setProducts(product){
  return {
      type: constants.SET,
      product
    };
}

export function clearProducts(){
  return {
      type: constants.CLEAR,
    };
}
