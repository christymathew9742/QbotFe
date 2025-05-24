import {
    FETCH_USER_REQUEST,
    FETCH_USER_SUCCESS,
    FETCH_USER_FAILURE,
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

// Update user
export const updateUserRequest = (payload?: any): any => ({
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