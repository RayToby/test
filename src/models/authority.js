import { getAllPermission } from '../services/api';
export default {
    namespace: 'authority',

    state: {
        data: {
            dataList: [],
            pagination: {},
        },
    },

    effects: {
        //获取所有权限
        *getAllPermission({ payload, callback }, { call, put }) {
            const response = yield call(getAllPermission, payload);
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
