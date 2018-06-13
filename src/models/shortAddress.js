import { 
    addShortUrlGroup,
    deleteShortUrlGroup, 
    updateShortUrlGroup, 
    queryShortUrlGroup, 
    addShortUrl, 
    deleteShortUrl, 
    updateShortUrl, 
    queryShortUrl,
    queryGroup,  
} from '../services/api';

export default {
    
    namespace: 'shortAddress',

    state: {
        data: {
            dataList: [],
            pagination: {},
        },
    },

    effects: {
        //短地址分组
        *queryShortUrlGroup({ payload,callback }, { call, put}) {
            const response = yield call(queryShortUrlGroup, payload);
            yield put({
            type: 'save',
            payload: response,
            });
            if (callback && response) callback(response);
        },
        *addShortUrlGroup({ payload,callback }, { call, put}) {
            const response = yield call(addShortUrlGroup, payload);
            yield put({
            type: 'save',
            payload: response,
            });
            if (callback && response) callback(response);
        },
        *deleteShortUrlGroup({ payload,callback }, { call, put}) {
            const response = yield call(deleteShortUrlGroup, payload);
            yield put({
            type: 'save',
            payload: response,
            });
            if (callback && response) callback(response);
        },
        *updateShortUrlGroup({ payload,callback }, { call, put}) {
            const response = yield call(updateShortUrlGroup, payload);
            yield put({
            type: 'save',
            payload: response,
            });
            if (callback && response) callback(response);
        },
        //短地址管理
        *queryShortUrl({ payload,callback }, { call, put}) {
            const response = yield call(queryShortUrl, payload);
            yield put({
            type: 'save',
            payload: response,
            });
            if (callback && response) callback(response);
        },
        *deleteShortUrl({ payload,callback }, { call, put}) {
            const response = yield call(deleteShortUrl, payload);
            yield put({
            type: 'save',
            payload: response,
            });
            if (callback && response) callback(response);
        },
        *queryGroup({ payload,callback }, { call, put}) {
            const response = yield call(queryGroup, payload);
            yield put({
            type: 'save',
            payload: response,
            });
            if (callback && response) callback(response);
        },
        *addShortUrl({ payload,callback }, { call, put}) {
            const response = yield call(addShortUrl, payload);
            yield put({
            type: 'save',
            payload: response,
            });
            if (callback && response) callback(response);
        },
        *updateShortUrl({ payload,callback }, { call, put}) {
            const response = yield call(updateShortUrl, payload);
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
