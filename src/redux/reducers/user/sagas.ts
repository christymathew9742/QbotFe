import api from '../../../utils/axios'
import { all, call, put, takeLatest, select } from 'redux-saga/effects';

import {
    FETCH_USER_REQUEST,
    UPDATE_USER_REQUEST,

} from './actionTypes';

import { 
    fetchUserSuccess,
    fetchUserFailure, 
    updateUserSuccess,
    updateUserFailure,
} from './actions';

//operations
const updateUserData = (body: any,) => api.put<any[]>(`/auth/update`, body);

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
    yield all([takeLatest(FETCH_USER_REQUEST, fetchUserSaga)]);
    yield all([takeLatest(UPDATE_USER_REQUEST, updateUserSaga)]);
}

export default UserSaga;



