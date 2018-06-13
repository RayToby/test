import { queryAdList, addAdvert, modifyState, removeAdvert, modifyAdvert } from '../services/api';
export default {
    namespace: 'advertise',

    state: {
        data: {
            dataList: [],
            // pagination: {},
        },
    },

    effects: {
        //广告管理
        *queryAdList({ payload, callback }, {call, put}) {
            const response = yield call(queryAdList, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            if( callback ) callback(response);
        },
        *addAdvert({ payload, callback }, {call, put}) {
            const response = yield call(addAdvert, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            if( callback ) callback(response);
        },
        *modifyState({ payload, callback }, {call, put}) {
            const response = yield call(modifyState, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            if( callback ) callback(response);
        },
        *removeAdvert({ payload, callback }, {call, put}) {
            const response = yield call(removeAdvert, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            if( callback ) callback(response);
        },
        *modifyAdvert({ payload, callback }, {call, put}) {
            const response = yield call(modifyAdvert, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            if( callback ) callback(response);
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
