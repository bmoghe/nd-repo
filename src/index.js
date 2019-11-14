import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import './styles/main.scss';
import './index.scss';
import Root from './components/root';
//import './config/axiosInterceptor';

//import application store
import configureStore from "./store/configureStore";

const store = configureStore();

ReactDOM.render(<AppContainer>
  <Root store={ store } />
</AppContainer>, document.getElementById('root'));
