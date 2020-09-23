import 'sanitize.css/sanitize.css';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import * as React from 'react';
import * as serviceWorker from './serviceWorker';
import { ConfigProvider } from 'antd';

import app from './models';
import GlobalStyle from '@/styles/global-styles';

import RouterWrapper from './routes';

const ConnectedApp = () => (
  <ConfigProvider>
    <RouterWrapper />
    <GlobalStyle />
  </ConfigProvider>
);

const render = () => {
  app.router(ConnectedApp);

  app.start('#app');
};

render();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
