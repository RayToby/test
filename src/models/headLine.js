import { queryHeadLine, headlinePush, revokePush, queryPushing, queryPushed } from '../services/api';
export default {
    namespace: 'headLine',

    state: {
        data: {
            dataList: [],
            // pagination: {},
        },
    },

    effects: {
        //头条查询
        *queryHeadLine({ payload,callback }, { call, put}) {
            const response = yield call(queryHeadLine, payload);
            yield put({
            type: 'save',
            payload: response,
            });
            if (callback && response) callback(response);
        },
        *headlinePush({ payload,callback }, { call, put}) {
            const response = yield call(headlinePush, payload);
            yield put({
            type: 'save',
            payload: response,
            });
            if (callback && response) callback(response);
        },
        *revokePush({ payload,callback }, { call, put}) {
            const response = yield call(revokePush, payload);
            yield put({
            type: 'save',
            payload: response,
            });
            if (callback && response) callback(response);
        },
        *queryPushing({ payload,callback }, { call, put}) {
            const response = yield call(queryPushing, payload);
            yield put({
            type: 'save',
            payload: response,
            });
            if (callback && response) callback(response);
        },
        *queryPushed({ payload,callback }, { call, put}) {
            const response = yield call(queryPushed, payload);
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
