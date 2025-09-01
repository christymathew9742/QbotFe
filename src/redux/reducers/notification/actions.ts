import {
  FETCH_NOTIFICATION_REQUEST,
  FETCH_NOTIFICATION_SUCCESS,
  FETCH_NOTIFICATION_FAILURE,
  UPDATE_NOTIFICATION_REQUEST,
  UPDATE_NOTIFICATION_SUCCESS,
  UPDATE_NOTIFICATION_FAILURE,
  WEBSOCKET_CONNECTED_NOTIFICATION,
  WEBSOCKET_DISCONNECTED_NOTIFICATION,
  WEBSOCKET_ERROR_NOTIFICATION,
} from './actionTypes';

import {
  FetchNotificationsSuccess,
  SuccessPayload,
  FetchNotificationsFailure,
  FailurePayload,
  WebSocketErrorPayload,
  WebsoketStatus,
} from './types';

// Fetch Notifications
export const fetchNotificationsRequest = (
  payload: any = ''
): any => ({
  type: FETCH_NOTIFICATION_REQUEST,
  payload,
});

export const fetchNotificationsSuccess = (payload: SuccessPayload): FetchNotificationsSuccess => ({
  type: FETCH_NOTIFICATION_SUCCESS,
  payload,
});

export const fetchNotificationsFailure = (payload: FailurePayload): FetchNotificationsFailure => ({
  type: FETCH_NOTIFICATION_FAILURE,
  payload,
});

// Update Notifications
export const updateNotificationsRequest = (payload?: any): any => ({
  type: UPDATE_NOTIFICATION_REQUEST,
  payload,
});

export const updateNotificationsSuccess = (payload: SuccessPayload): any => ({
  type: UPDATE_NOTIFICATION_SUCCESS,
  payload,
});

export const updateNotificationsFailure = (payload: FailurePayload): any => ({
  type: UPDATE_NOTIFICATION_FAILURE,
  payload,
});

// WebSocket Actions
export const webSocketConnected = ():WebsoketStatus => ({
  type: WEBSOCKET_CONNECTED_NOTIFICATION,
});

export const webSocketDisconnected = ():WebsoketStatus => ({
  type: WEBSOCKET_DISCONNECTED_NOTIFICATION,
});

export const webSocketError = (payload: WebSocketErrorPayload): 
{ 
  type: string; 
  payload: WebSocketErrorPayload 
}  => ({
  type: WEBSOCKET_ERROR_NOTIFICATION,
  payload,
});






