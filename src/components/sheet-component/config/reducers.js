import { combineReducers } from 'redux';
import sheetData from '../components/sheet/Sheet.reducer';

const allReducer = combineReducers({
  sheetData
});

export default allReducer;
