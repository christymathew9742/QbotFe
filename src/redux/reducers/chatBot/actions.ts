import {
  FETCH_BOT_REQUEST,
  FETCH_BOT_SUCCESS,
  FETCH_BOT_FAILURE,
  POST_BOT_REQUEST,
  POST_BOT_SUCCESS,
  POST_BOT_FAILURE,
  UPDATE_BOT_REQUEST,
  UPDATE_BOT_SUCCESS,
  UPDATE_BOT_FAILURE,
  DELETE_BOT_REQUEST,
  DELETE_BOT_SUCCESS,
  DELETE_BOT_FAILURE,
  FETCH_REYAL_TIME_BOT,
  WEBSOCKET_CONNECTED,
  WEBSOCKET_DISCONNECTED,
  WEBSOCKET_ERROR,
} from './actionTypes';

import {
  FetchBotSuccess,
  SuccessPayload,
  FetchBotFailure,
  FailurePayload,
  WebSocketErrorPayload,
  WebsoketStatus,
} from './types';

// Fetch ChatBot
export const fetchBotRequest = (
  payload: any
): any => ({
  type: FETCH_BOT_REQUEST,
  payload
});

export const fetchBotSuccess = (payload: SuccessPayload): FetchBotSuccess => ({
  type: FETCH_BOT_SUCCESS,
  payload,
});

export const fetchBotFailure = (payload: FailurePayload): FetchBotFailure => ({
  type: FETCH_BOT_FAILURE,
  payload,
});

// Post ChatBot
export const postBotRequest = (payload: any = ''): any => ({
  type: POST_BOT_REQUEST,
  payload,
});

export const postBotSuccess = (payload: SuccessPayload): any => ({
  type: POST_BOT_SUCCESS,
  payload,
});

export const postBotFailure = (payload: FailurePayload): any => ({
  type: POST_BOT_FAILURE,
  payload,
});

// Post Fetch ChatBot
export const postFetchBotRequest = (
  payload?: {
    id?: string;
    botData?: any;
  }
): any => ({
  type: FETCH_REYAL_TIME_BOT,
  payload,
});

// Update ChatBot
export const updateBotRequest = (payload?: any): any => ({
  type: UPDATE_BOT_REQUEST,
  payload,
});

export const updateBotSuccess = (payload: SuccessPayload): any => ({
  type: UPDATE_BOT_SUCCESS,
  payload,
});

export const updateBotFailure = (payload: FailurePayload): any => ({
  type: UPDATE_BOT_FAILURE,
  payload,
});

// Delete ChatBot
export const deleteBotRequest = (payload: any = ''): any => ({
  type: DELETE_BOT_REQUEST,
  payload,
});

export const deleteBotSuccess = (payload: any) => ({
  type: DELETE_BOT_SUCCESS,
  payload,
});

export const deleteBotFailure = (payload: FailurePayload) => ({
  type: DELETE_BOT_FAILURE,
  payload,
});

// WebSocket Actions
export const webSocketConnected = ():WebsoketStatus => ({
  type: WEBSOCKET_CONNECTED,
});

export const webSocketDisconnected = ():WebsoketStatus => ({
  type: WEBSOCKET_DISCONNECTED,
});

export const webSocketError = (payload: WebSocketErrorPayload): 
{ 
  type: string; 
  payload: WebSocketErrorPayload 
}  => ({
  type: WEBSOCKET_ERROR,
  payload,
});



