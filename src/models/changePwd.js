import { revisePwd } from '../services/api';
export default {
    namespace: 'changePwd',

    state: {
        data: {
            // dataList: [],
            // pagination: {},
        },
    },

    effects: {
         //修改密码
        *ChangePwd({ payload, callback }, { call, put }) {
            const response = yield call(revisePwd, payload);
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
