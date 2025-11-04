import api from '../../../utils/axios';
import { isQueryParamString } from '@/utils/utils';
import { all, call, put, takeLatest, fork, take, delay } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { EventChannel } from 'redux-saga'; 
import { WebSocketMessage } from './types';
import { baseURL } from '@/utils/url';

import {
    FETCH_BOT_REQUEST,
    POST_BOT_REQUEST,
    UPDATE_BOT_REQUEST,
    DELETE_BOT_REQUEST,
    FETCH_REAL_TIME_BOT,
} from './actionTypes';

import {
    fetchBotSuccess,
    fetchBotFailure,
    postBotSuccess,
    postBotFailure,
    updateBotSuccess,
    updateBotFailure,
    deleteBotSuccess,
    deleteBotFailure,
    webSocketConnected,
    webSocketDisconnected,
    webSocketError,
} from './actions';
import { toast } from 'react-toastify';

const createChatBot = (body: any) => api.post<any[]>(`/createbots/`, body);
const fetchChatBot = (params: any) => api.get<any[]>(`/createbots${params}`);
const updateChatBot = (body: any, id: any) => api.put<any[]>(`/createbots/${id}`, body);
const deleteBot = (id: any) => api.delete<any[]>(`/createbots/${id}`);

function createWebSocketChannel(socketUrl: string) {
    return eventChannel<any>((emit) => {
        const socket = new WebSocket(socketUrl);
        socket.onopen = () => emit({ connected: true });
        socket.onmessage = (event) => emit({...event.data});
        // socket.onerror = (error) => emit({ error });
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
    //const socketUrl: string = `${baseURL}`;
    const socketUrl: string = baseURL.replace(/^http/, "ws");
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
            yield put(fetchBotSuccess({ bot: message.data }));
        }
    }
}

// Fetch reyal time data
function* fetchReyalTimedataSaga(data: any): any {
    const { payload } = data;
    try {
        yield put(fetchBotSuccess({ bot: payload }));
    } catch (e: any) {
        yield put(fetchBotFailure({ error: e.message }));
    }
}

//Fetch ChatBot
function* fetchBotSaga(data:any): any {
    const {payload} = data;
    const params = isQueryParamString(payload)?`?${payload}`:`/${payload}`;
    try {
        const response: any = yield call(fetchChatBot,params);
        yield put (fetchBotSuccess({bot: response.data }));
    } catch (e: any) 
        {yield put(fetchBotFailure({error: e.message}));
    }
}

// Post ChatBot
function* postBotSaga(data: any): any {
    const { payload } = data;
    try {
        const response: any = yield call(createChatBot, payload);
        yield put(postBotSuccess({ bot: response.data }));
        yield call(fetchReyalTimedataSaga, { payload: response.data });
        toast.success(response?.data?.message)
    } catch (e: any) {
        yield put(postBotFailure({ error: e.message }));
        const errorMessage:any =
            e.response?.data?.error || e.error || 'Something went wrong';
            yield put(postBotFailure({ error: errorMessage }));
            toast.error(errorMessage)
    }
}

// Update ChatBot
function* updateChatBotSaga(data: any): any {
    const { id, payload } = data.payload;
    try {
        const response: any = yield call(updateChatBot, payload, id);
        yield put(updateBotSuccess({ bot: response.data }));
        yield call(fetchReyalTimedataSaga, { payload });
        toast.success(response?.data?.message)
    } catch (e: any) {
        yield put(updateBotFailure({ error: e.message }));
    }
}

// Delete ChatBot
function* deleteChatBot(data: any): any {
    const { payload } = data;
    try {
        const response: any = yield call(deleteBot, payload);
        yield put(deleteBotSuccess({ bot: response.data }));
    } catch (e: any) {
        yield put(deleteBotFailure({ error: e.message }));
    }
}

function* BotSaga() {
    yield fork(watchWebSocket);
    yield all([
        takeLatest(FETCH_BOT_REQUEST, fetchBotSaga),
        takeLatest(POST_BOT_REQUEST, postBotSaga),
        takeLatest(UPDATE_BOT_REQUEST, updateChatBotSaga),
        takeLatest(DELETE_BOT_REQUEST, deleteChatBot),
        takeLatest(FETCH_REAL_TIME_BOT, fetchReyalTimedataSaga),
    ]);
}

export default BotSaga;







