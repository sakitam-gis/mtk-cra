import { message } from 'antd';
import { delay } from 'dva/saga';

import { actionLogin } from '@/service';

const MapModel = {
  namespace: 'map',
  state: {
    style: {},
    mapLoaded: false,
    globalHistory: {},
    userData: {},
  },

  effects: {
    *login({ callback, payload }, { call, put }) {
      const data = yield call(actionLogin, payload);
      message.success('success！');

      yield call(delay, 100);
      yield put({
        type: 'updateUserData',
        payload: data,
      });
      // eslint-disable-next-line no-unused-expressions
      callback && callback(true);

      // router.replace(redirect);
    },

    *updateMapConfig({ callback, payload }, { put }) {
      yield put({
        type: 'updateMapStyle',
        payload: payload.style,
      });
      callback(payload.style);
    },

    *updateMapStatus({ callback, payload }, { put }) {
      yield put({
        type: 'updateMapState',
        payload: payload,
      });
      callback && callback(payload);
    },

    *actionGlobalHistory({ payload }, { put }) {
      if (payload) {
        yield put({
          type: 'updateGlobalHistory',
          payload,
        });
      }
    }
  },

  reducers: {
    updateMapState (state, action) {
      state.mapLoaded = action.payload;
    },
    updateMapStyle (state, action) {
      state.style = action.payload;
    },
    updateGlobalHistory (state, action) {
      state.globalHistory = action.payload;
    },
    updateUserData (state, action) {
      state.userData = action.payload;
    },
  },

  subscriptions: {
    setup ({ history, dispatch }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen((args) => {
        dispatch({
          type: 'actionGlobalHistory',
          payload: args,
        });
      });
    },
  },
};

export default MapModel;
