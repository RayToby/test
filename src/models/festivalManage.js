import { queryFestival, festivalUpload } from '../services/api';
export default {
    namespace: 'festivalManage',

    state: {
        data: {
            dataList: [],
            // pagination: {},
        },
    },

    effects: {
        //节日节气
        *queryFestival({ payload, callback }, { call, put }) {
            const response = yield call(queryFestival, payload);
            yield put({
            type: 'save',
            payload: response,
            });
            if (callback && response) callback(response);
        },
        *festivalUpload({ payload, callback }, { call, put }) {
            const response = yield call(festivalUpload, payload);
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
