import Immutable from 'immutable';
import {UPDATE, CREATE, DELETE, SET, CLEAR} from './constants';
import _ from 'lodash';

const initialState = Immutable.List();

export default (state = initialState, action) => {
    switch (action.type) {
    case UPDATE:
      const product = action.product;
      const indexProductToUpdate = state.findIndex(item => item.uid === product.uid);
      var productToUpdate =  _.assign({}, state.get(indexProductToUpdate), {
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
      var product = action.product;
        const newProduct = _.assign({}, {
          name: product.name,
          type: product.type,
          number: product.number,
          averageMontlyAmount: product.averageMontlyAmount,
          coin: product.coin,
          country: product.country,
          city: product.city,
          uid: product.uid
        });
        return state.push(newProduct);
    case DELETE:
        const index = state.findIndex(item => item.uid === action.index);
        return state.delete(index);
    case SET:
        const notes = action.notes;
        return state.withMutations(list => {
          notes.map(item => {
            const uid = _.uniqueId('product_');
            list.push({
                uid,
                body: item.note,
                combo: String(item.typeOfNote)
              })
          });
      });
    case CLEAR:
        return state.clear();
    default:
        return state;
    }
}
