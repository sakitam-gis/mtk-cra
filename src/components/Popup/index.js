import './index.less';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import app from '../../models';

import Test from './Test';

export function getPopupContent (Component, className, props = {}) {
  const content = document.createElement('div');
  content.className = className || 'own-popup';
  ReactDOM.render(<ConfigProvider locale={zhCN}>
    <Provider store={app._store}>
      <Component {...props} />
    </Provider>
  </ConfigProvider>, content);
  return content;
}

export default {
  Test,
  getPopupContent,
};
