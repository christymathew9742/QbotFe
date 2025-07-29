import api from '../../../utils/axios';
import { isQueryParamString } from '@/utils/utils';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import {
    FETCH_APPOINTMENT_REQUEST,
    UPDATE_APPOINTMENT_REQUEST,
    DELETE_APPOINTMENT_REQUEST,
} from './actionTypes';

import {
    fetchAppointmentSuccess,
    fetchAppointmentFailure,
    updateAppointmentSuccess,
    updateAppointmentFailure,
    deleteAppointmentSuccess,
    deleteAppointmentFailure,
} from './actions';

const fetchAppointment = (params: any) => api.get<any[]>(`/appointments${params}`);
const updateAppointment = (body: any, id: any) => api.put<any[]>(`/appointments/${id}`, body);
const deleteAppointment = (id: any) => api.delete<any[]>(`/appointments/${id}`);



//Fetch appointment
function* fetchAppointmentSaga(data:any): any {
    const {payload} = data;
    const params = isQueryParamString(payload)?`?${payload}`:`/${payload}`;
    try {
        const response: any = yield call(fetchAppointment,params);
        yield put (fetchAppointmentSuccess({appointment: response.data }));
    } catch (e: any) 
        {yield put(fetchAppointmentFailure({error: e.message}));
    }
}


// Update appointment
function* updateAppointmentSaga(data: any): any {
    const { id, payload } = data.payload;
    try {
        const response: any = yield call(updateAppointment, payload, id);
        yield put(updateAppointmentSuccess({ appointment: response.data }));
    } catch (e: any) {
        yield put(updateAppointmentFailure({ error: e.message }));
    }
}

// Delete appointment
function* deleteAppointmentSaga(data: any): any {
    const { payload } = data;
    try {
        const response: any = yield call(deleteAppointment, payload);
        yield put(deleteAppointmentSuccess({ bot: response.data }));
    } catch (e: any) {
        yield put(deleteAppointmentFailure({ error: e.message }));
    }
}

function* AppointmentSaga() {
    yield all([
        takeLatest(FETCH_APPOINTMENT_REQUEST, fetchAppointmentSaga),
        takeLatest(UPDATE_APPOINTMENT_REQUEST, updateAppointmentSaga),
        takeLatest(DELETE_APPOINTMENT_REQUEST, deleteAppointmentSaga),
    ]);
}

export default AppointmentSaga;







