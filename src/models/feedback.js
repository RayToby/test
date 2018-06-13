import { queryFeedbackList } from '../services/api';
export default {
    namespace: 'feedback',

    state: {
        data: {
            dataList: [],
            pagination: {},
        },
    },

    effects: {
    //客服管理
        *queryFeedbackList({ payload, callback }, { call, put }) {
            const response = yield call(queryFeedbackList, payload);
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
