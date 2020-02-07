import Immutable from 'immutable';
import _ from 'lodash';
import { UPDATE, CREATE, DELETE, SET, CLEAR } from './constants';

const initialState = Immutable.List();

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE:
      let product = action.product;
      const indexProductToUpdate = state.findIndex(item => item.uid === product.uid);
      var productToUpdate = _.assign({}, state.get(indexProductToUpdate), {
        name: product.name,
        type: product.type,
        number: product.number,
        averageMontlyAmount: product.averageMontlyAmount,
        coin: product.coin,
        country: product.country,
        city: product.city
      });
      return state.set(indexProductToUpdate, productToUpdate);
    case CREATE:
      let productAction = action.product;
      const newProduct = _.assign({}, {
        name: productAction.name,
        type: productAction.type,
        number: productAction.number,
        averageMontlyAmount: productAction.averageMontlyAmount,
        coin: productAction.coin,
        country: productAction.country,
        city: productAction.city,
        uid: productAction.uid
      });
      return state.push(newProduct);
    case DELETE:
      const index = state.findIndex(item => item.uid === action.index);
      return state.delete(index);
    case SET:
      const products = action.products;
      return state.withMutations(list => {
        products.map(product => {
          const uid = _.uniqueId('product_');
          list.push({
            uid,
            name: product.name,
            type: product.type,
            number: product.number,
            averageMontlyAmount: product.averageMontlyAmount,
            coin: product.coin,
            country: product.country,
            city: product.city
          })
        });
      });
    case CLEAR:
      return state.clear();
    default:
      return state;
  }
}