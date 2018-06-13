import { queryCard, changeCard } from '../services/api';
export default {
    namespace: 'cardManage',

    state: {
        data: {
            dataList: [],
            // pagination: {},
        },
    },

    effects: {
         //卡片管理
        *queryCard({ payload, callback }, { call, put }) {
            const response = yield call(queryCard, payload);
            yield put({
            type: 'save',
            payload: response,
            });
            if (callback && response) callback(response);
        },
        *changeCard({ payload, callback }, { call, put }) {
            const response = yield call(changeCard, payload);
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
