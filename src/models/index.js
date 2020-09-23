import dva from 'dva';
import createLoading from 'dva-loading';
import { createLogger } from 'redux-logger';
import immer from 'dva-immer';
import { createHashHistory } from 'history';
import { getContext } from '@/utils/common';
import createCallback from './plugins/dva-cb';

import { message } from 'antd';

export const history = createHashHistory();

const appOptions = {
  history,
  // eslint-disable-next-line no-unused-vars
  onError: (error, dispatch) => {
    error.preventDefault();
    message.error(error);
  },
};

if (process.env.NODE_ENV !== 'production') {
  appOptions.onAction = createLogger({});
}

const app = dva(appOptions);

const models = getContext(require.context('./', false, /\.js$/), true, './index.js');

models.forEach(model => {
  app.model(model);
});

app.use(createLoading({}));
app.use(createCallback({}));
app.use(immer());

export default app;
