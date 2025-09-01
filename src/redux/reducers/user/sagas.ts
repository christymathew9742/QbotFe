import api from '../../../utils/axios'
import { all, call, put, takeLatest } from 'redux-saga/effects';
import {
    FETCH_USER_REQUEST,
    POST_USER_REQUEST,
    UPDATE_USER_REQUEST,
    FETCH_WHATSAPP_USER_REQUEST,
    FETCH_WHATSAPP_REQUEST
} from './actionTypes';

import {
    fetchUserSuccess,
    fetchUserFailure,
    postUserSuccess,
    postUserFailure,
    updateUserSuccess,
    updateUserFailure,
    fetchWhatsAppUserSuccess,
    fetchWhatsAppUserFailure,
    fetchWhatsAppSuccess,
    fetchWhatsAppFailure,
} from './actions';
import { isQueryParamString } from '@/utils/utils';

//operations
const updateUserData = (body: any) => api.put(`/auth/update`, body);
const sendMessage = (body: any) => api.post(`/auth/sendmessage/`, body);

//fetch user
function* fetchUserSaga(): any {
    try {
        const response: any = yield call(api.get, `/auth/user/`);
        yield put(fetchUserSuccess({ user: response?.data }));
    } catch (e: any) {
        yield put(fetchUserFailure({ error: e.message }));
    }
}

//fetch whatsapp user
function* fetchWhatsAppUserSaga(action: any): any {
    const { data } = action
    const params = isQueryParamString(data) ? `?${data}` : `/${data}`;
    try {
        const response: any = yield call(api.get, `/auth/whatsapp${params}`);
        yield put(fetchWhatsAppUserSuccess({ whatsAppUsers: response.data }));
    } catch (e: any) {
        yield put(fetchWhatsAppUserFailure({ error: e.message }));
    }
}

//fetch global data 
function* fetchWhatsAppGlobalSaga(action: any): any {
    const { data } = action
    const params = isQueryParamString(data) ? `?${data}` : `/${data}`;
    try {
        const response: any = yield call(api.get, `/auth/globaldata${params}`);
        yield put(fetchWhatsAppSuccess({ globalData: response.data }));
    } catch (e: any) {
        yield put(fetchWhatsAppFailure({ error: e.message }));
    }
}

// Post user
function* postUserSaga(action: any): any {
    const { payload } = action;
    try {
        const response: any = yield call(sendMessage, payload);

        if (response.data?.success) {
            yield put(postUserSuccess({ user: response.data }));
        } else {
            yield put(postUserFailure({
                error: response.data?.error || 'Unknown API error',
                log: response.data?.log || null
            }));
        }
    } catch (e: any) {
        const backendError = e?.response?.data;
        yield put(postUserFailure({
            error: backendError?.error || 'Something went wrong',
            log: backendError?.log || null
        }));
    }
}

// Update User data
function* updateUserSaga(action: any): any {
    const { payload } = action;
    try {
        const response: any = yield call(updateUserData, payload);
        yield put(updateUserSuccess({ user: response.data }));
    } catch (e: any) {
        yield put(updateUserFailure({ error: e.message }));
    }
}

function* UserSaga() {
    yield all([
        takeLatest(FETCH_USER_REQUEST, fetchUserSaga),
        takeLatest(FETCH_WHATSAPP_USER_REQUEST, fetchWhatsAppUserSaga),
        takeLatest(FETCH_WHATSAPP_REQUEST, fetchWhatsAppGlobalSaga),
        takeLatest(POST_USER_REQUEST, postUserSaga),
        takeLatest(UPDATE_USER_REQUEST, updateUserSaga),
    ]);
}

export default UserSaga;




