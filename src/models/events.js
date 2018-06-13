import { getEventList, getEventStatus } from '../services/api';
export default {
    
    namespace: 'events',

    state: {
        data: {
            dataList: [],
            pagination: {},
        },
    },

    effects: {
        //事件管理
        *getEventList({ payload, callback }, { call, put }) {
            const response = yield call(getEventList, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            if(callback && response) callback(response);
        },
        *eventStatus({ payload, callback }, { call, put }) {
            const response = yield call(getEventStatus, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            if(callback && response) callback(response);
        }
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                data: action.payload,
            };
        },
    },
}