import {
    FETCH_USER_REQUEST,
    FETCH_USER_SUCCESS,
    FETCH_USER_FAILURE,
    POST_USER_REQUEST,
    POST_USER_SUCCESS,
    POST_USER_FAILURE,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAILURE,
} from './actionTypes';

import {
    FetchUserSuccess,
    SuccessPayload,
    FetchUserFailure,
    FailurePayload
} from './types';

//fetch User
export const fetchUserRequest = (
    data:any = ''
  ): any => ({
    type: FETCH_USER_REQUEST,
    data
});

export const fetchUserSuccess = (
    payload: SuccessPayload,
  ): FetchUserSuccess => ({
    type: FETCH_USER_SUCCESS,
    payload
  });
  
export const fetchUserFailure = (
  payload: FailurePayload
): FetchUserFailure => ({
  type: FETCH_USER_FAILURE,
  payload
});

// Post ChatBot
export const postUserRequest = (payload: any = ''): any => ({
  type: POST_USER_REQUEST,
  payload,
});

export const postUserSuccess = (payload: SuccessPayload): any => ({
  type: POST_USER_SUCCESS,
  payload,
});

export const postUserFailure = (payload: FailurePayload): any => ({
  type: POST_USER_FAILURE,
  payload,
});

// Update ChatBot
export const updateUserRequest = (
  payload?: any
): any => ({
  type: UPDATE_USER_REQUEST,
  payload,
});

export const updateUserSuccess = (payload: SuccessPayload): any => ({
  type: UPDATE_USER_SUCCESS,
  payload,
});

export const updateUserFailure = (payload: FailurePayload): any => ({
  type: UPDATE_USER_FAILURE,
  payload,
});
