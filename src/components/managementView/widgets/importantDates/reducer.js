import { ACTION_STRATEGIC_CONTACTS, ACTION_TACTIC_CONTACTS, ACTION_OPERATIVE_CONTACTS } from "./subTabsBirthdays/constants";
import { ACTION_IMPORTANT_DATES } from './constants';
import { get } from 'lodash';

const initialState = {
    allRecords: null,
    strategics: {
      rows: [],
      rowCount: null
    },
    tactics: {
      rows: [],
      rowCount: null
    },
    operatives: {
      rows: [],
      rowCount: null
    }
}

export default (state = initialState, action = {}) => {

  switch (action.type) {
    case ACTION_IMPORTANT_DATES:
      const records = get(action.payload, 'data.data.rows', []);

      const filteredRecords = records.filter((obj, pos, arr) => (
        arr.map(mapObj => mapObj['id']).indexOf(obj['id']) === pos
      ));

      return Object.assign(
        {}, 
        state, 
        { 
          allRecords: filteredRecords.length,
          strategics: state.strategics,
          tactics: state.tactics,
          operatives: state.operatives
        }
      );
    case ACTION_STRATEGIC_CONTACTS:
      return Object.assign(
        {}, 
        state, 
        { 
          allRecords: state.allRecords,
          strategics: {
            rows: get(action.payload, 'data.data.rows', []),
            rowCount: get(action.payload, 'data.data.rowCount', [])
          },
          tactics: state.tactics,
          operatives: state.operatives
        }
      );
    case ACTION_TACTIC_CONTACTS:
      return Object.assign(
        {}, 
        state, 
        { 
          allRecords: state.allRecords,
          strategics: state.strategics,
          tactics: {
            rows: get(action.payload, 'data.data.rows', []),
            rowCount: get(action.payload, 'data.data.rowCount', [])
          },
          operatives: state.operatives
        }
      );
    case ACTION_OPERATIVE_CONTACTS:
      return Object.assign(
        {}, 
        state, 
        { 
          allRecords: state.allRecords,
          strategics: state.strategics,
          tactics: state.tactics,
          operatives: {
            rows: get(action.payload, 'data.data.rows', []),
            rowCount: get(action.payload, 'data.data.rowCount', [])
          }
        }
      );
    default:
      return state;
  }
}