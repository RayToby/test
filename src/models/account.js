import { queryUser, addUser, removeUser, resetPwd, editUser, editUserState, queryRole } from '../services/api';
export default {
    namespace: 'account',

    state: {
        data: {
            dataList: [],
            pagination: {},
        },
    },

    effects: {
        *fetch({ payload, callback }, { call, put }) {
            const response = yield call(queryUser, payload);
            yield put({
              type: 'save',
              payload: response,
            });
            if (callback && response) callback(response);
        },
        *add({ payload, callback }, { call, put }) {
          const response = yield call(addUser, payload);
          yield put({
            type: 'save',
            payload: response,
          });
          if (callback && response) callback(response);
        },
        *remove({ payload, callback }, { call, put }) {
          const response = yield call(removeUser, payload);
          yield put({
            type: 'save',
            payload: response,
          });
          if (callback && response) callback(response);
        },
        *reset({ payload, callback }, { call, put }) {
          const response = yield call(resetPwd, payload);
          yield put({
            type: 'save',
            payload: response,
          });
          if (callback && response) callback(response);
        },
        *edit({ payload, callback }, { call, put }) {
          const response = yield call(editUser, payload);
          yield put({
            type: 'save',
            payload: response,
          });
          if (callback && response) callback(response);
        },
        *editState({ payload, callback }, { call, put }) {
          const response = yield call(editUserState, payload);
          yield put({
            type: 'save',
            payload: response,
          });
          if (callback && response) callback(response);
        },
        *allRole({ payload, callback }, { call, put }) {
          const response = yield call(queryRole, payload);
          yield put({
            type: 'save',
            payload: response,
          });
          if (callback && response) callback(response);
        },
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                data: action.payload,
            };
        },
    },
};
