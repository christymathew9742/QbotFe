import api from '../../../utils/axios';
import { all, call, put, takeLatest, fork, take, delay } from 'redux-saga/effects';

import { eventChannel } from 'redux-saga';
import { EventChannel } from 'redux-saga'; 
import { WebSocketMessage } from './types';
import { baseURL } from '@/utils/url';

import {
    FETCH_NOTIFICATION_REQUEST,
    UPDATE_NOTIFICATION_REQUEST,
    FETCH_REAL_TIME_NOTIFICATION,
} from './actionTypes';

import {
    fetchNotificationsSuccess,
    fetchNotificationsFailure,
    updateNotificationsSuccess,
    updateNotificationsFailure,
    webSocketConnected,
    webSocketDisconnected,
    webSocketError,
} from './actions';

const fetchNotifications = (params: any) => api.get<any[]>(`/notifications`, {params});
const updateNotifications = (id: any, body: any) => api.put<any[]>(`/notifications/${id}`, body);

function createWebSocketChannel(socketUrl: string) {
    return eventChannel<any>((emit) => {
        const socket = new WebSocket(socketUrl);
        socket.onopen = () => emit({ connected: true });
        socket.onmessage = (event) => emit({...event.data});
        socket.onerror = (event: Event) => {
            const errorEvent = event as ErrorEvent;
            emit({
              error: {
                message: errorEvent.message || 'WebSocket error',
                type: errorEvent.type,
                time: new Date().toISOString()
              }
            });
        };
        socket.onclose = () => emit({ closed: true });
        return () => socket.close();
    });
}

function* watchWebSocket() {
    // const socketUrl: string = baseURL.replace(/^http/, "ws");
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const hostname = window.location.host; 
    const socketUrl = `${protocol}//${hostname}/`;
    const channel:EventChannel<any>  = yield call(createWebSocketChannel, socketUrl);
    while (true) {
        const message:WebSocketMessage   = yield take(channel);
        if (message.connected) {
            yield put(webSocketConnected());
        } else if (message.closed) {
            yield put(webSocketDisconnected());
        } else if (message.error) {
            yield put(webSocketError({ error: message.error }));
        } else if (message.data) {
            yield put(fetchNotificationsSuccess({ notifications: message.data }));
        }
    }
}

// Fetch reyal time data
function* fetchReyalTimedataSaga(data: any): any {
    const { payload } = data;
    try {
        yield put(fetchNotificationsSuccess({ notifications: payload }));
    } catch (e: any) {
        yield put(fetchNotificationsFailure({ error: e.message }));
    }
}

//Fetch Notifications
function* fetchNotificationsSaga(data:any): any {
    const {payload} = data;
    try {
        const response: any = yield call(fetchNotifications,payload);
        yield put (fetchNotificationsSuccess({notifications: response.data }));
    } catch (e: any) 
        {yield put(fetchNotificationsFailure({error: e.message}));
    }
}

// Update Notifications
function* updateNotificationsSaga(data: any): any {
    const { id, isRead } = data?.payload;
    try {
        const response: any = yield call(updateNotifications, id, { isRead });
        yield put(updateNotificationsSuccess({ notifications: response.data }));
    } catch (e: any) {
        yield put(updateNotificationsFailure({ error: e.message }));
    }
}

function* NotificationsSaga() {
    yield fork(watchWebSocket);
    yield all([
        takeLatest(FETCH_NOTIFICATION_REQUEST, fetchNotificationsSaga),
        takeLatest(UPDATE_NOTIFICATION_REQUEST, updateNotificationsSaga),
        takeLatest(FETCH_REAL_TIME_NOTIFICATION, fetchReyalTimedataSaga),
    ]);
}

export default NotificationsSaga;







