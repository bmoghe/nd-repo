import { combineReducers } from 'redux';
//import datasheetReducer from "../components/discovery/datasheet-reducer";
import { discoveryDocReducer } from '../components/discovery';
import { headerReducer } from '../components/header';
import { dataSourceListReducer } from '../components/data-preparation';
import { sheetListReducer } from '../components/sheet-list';

const rootReducer = combineReducers(
  {
    discoveryDocReducer,
    headerReducer,
    dataSourceListReducer,
    sheetListReducer
  });

export default rootReducer;