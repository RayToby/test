import { routerRedux } from 'dva/router';
import { fakeAccountLogin, loginOut } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload, callback }, { call, put }) {
      const response1 = yield call(fakeAccountLogin, payload);
      const response = response1.data;
      localStorage.setItem('realName', JSON.stringify(response.realName)); 
      localStorage.setItem('userId', JSON.stringify(response.id)); 
      yield put({
        type: 'changeLoginStatus',
        payload: response1.code == '-1' ? payload : response,
      });
      // Login successfully
      if (response.status === 'ok') {
        reloadAuthorized();
        yield put(routerRedux.push('/indexPage'));
      }
      if(callback) callback(response1);
    },
    *logout({ payload }, {call, put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        const response = yield call(loginOut, payload);
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
        localStorage.removeItem('realName'); 
        localStorage.removeItem('userId'); 
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
        currentUser: payload.realName,
      };
    },
  },
};
