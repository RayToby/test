import { 
    queryUserList,
    editCustomerState, 
    deleteCuster, 
    sendCheckcode, 
    bindMobile,
    unBindMobile,
    unBindByWeiXin,
} from '../services/api';
export default {
    namespace: 'userList',

    state: {
        data: {
            dataList: [],
            // pagination: {},
        },
    },

    effects: {
        //用户管理
        *queryUserList({ payload, callback }, {call, put}) {
            const response = yield call(queryUserList, payload);
            yield put({
            type: 'save',
            payload: response,
            });
            if( callback ) callback(response);
        },
        *editCustomerState({ payload, callback }, {call, put}) {
            const response = yield call(editCustomerState, payload);
            yield put({
            type: 'save',
            payload: response,
            });
            if( callback ) callback(response);
        },
        *deleteCuster({ payload, callback }, {call, put}) {
            const response = yield call(deleteCuster, payload);
            yield put({
            type: 'save',
            payload: response,
            });
            if( callback ) callback(response);
        },
        //获取验证码
        *sendCheckcode({ payload, callback }, {call, put}) {
            const response = yield call(sendCheckcode, payload);
            yield put({
            type: 'save',
            payload: response,
            });
            if( callback ) callback(response);
        },
        *bindMobile({ payload, callback }, {call, put}) {
            const response = yield call(bindMobile, payload);
            yield put({
            type: 'save',
            payload: response,
            });
            if( callback ) callback(response);
        },
        *unBindMobile({ payload, callback }, {call, put}) {
            const response = yield call(unBindMobile, payload);
            yield put({
            type: 'save',
            payload: response,
            });
            if( callback ) callback(response);
        },
        *unBindByWeiXin({ payload, callback }, {call, put}) {
            const response = yield call(unBindByWeiXin, payload);
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
