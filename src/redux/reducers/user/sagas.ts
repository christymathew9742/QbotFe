import api from '../../../utils/axios'
import { all, call, put, takeLatest, select } from 'redux-saga/effects';

import {
    FETCH_USER_REQUEST,
    POST_USER_REQUEST,
    UPDATE_USER_REQUEST,

} from './actionTypes';

import { 
    fetchUserSuccess,
    fetchUserFailure, 
    postUserSuccess,
    postUserFailure,
    updateUserSuccess,
    updateUserFailure,
} from './actions';

//operations
const updateUserData = (body: any,) => api.put<any[]>(`/auth/update`, body);
const sendmessage = (body: any) => api.post<any[]>(`/auth/sendmessage/`, body);

//fetch user
function* fetchUserSaga(payload:any): any {
    try {
        const response: any = yield call(api.get, `/auth/user/`);
        yield put (
            fetchUserSuccess({
                user: response.data  
            })   
        );
    } catch (e: any) {
        yield put(
            fetchUserFailure({
                error: e.message
            })
        );
        console.error(e)
    }
}

// Post user message
// function* postUserSaga(data: any): any {
//     const { payload } = data;
//     console.log(data,'datadatadatadatadatadata')
//     try {
//         const response: any = yield call(sendmessage, payload);
//         yield put(postUserSuccess({ user: response.data }));
//     } catch (e: any) {
//         yield put(postUserFailure({ error: e.message }));
//     }
// }

function* postUserSaga(data: any): any {
    const { payload } = data;
    try {
        const response: any = yield call(sendmessage, payload);

        // check for API-level error
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
function* updateUserSaga(data: any): any {
    const {payload } = data;
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
        takeLatest(POST_USER_REQUEST, postUserSaga),
        takeLatest(UPDATE_USER_REQUEST, updateUserSaga),
    ]);
}

export default UserSaga;



