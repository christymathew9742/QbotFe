
import {
    FETCH_USER_REQUEST,
    FETCH_USER_SUCCESS,
    FETCH_USER_FAILURE,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAILURE,
} from './actionTypes';


export interface SuccessPayload {
    user: any[];
}
export interface FailurePayload {
    error: string;
}

export interface userState {
    pending: {
      fetch: boolean;
      update: boolean;
    };
    user: any[];
    error: string | null;
}

export interface SelectorState {
    pending: {
      fetch?: boolean;
      update?: boolean;
      [key: string]: boolean | undefined;
    };
    user: any[];
    error: string | null;
    data: any; // or your specific user data type
}

export interface FetchUsertRequest {
    type: typeof FETCH_USER_REQUEST;
}
export type FetchUserSuccess = {
    type: typeof FETCH_USER_SUCCESS;
    payload: SuccessPayload;
};
export type FetchUserFailure = {
    type: typeof FETCH_USER_FAILURE;
    payload: FailurePayload;
};

// Update type
export type UpdateUserRequest = {
    type: typeof UPDATE_USER_REQUEST;
};
  
export type UpdateUserSuccess = {
    type: typeof UPDATE_USER_SUCCESS;
    payload: SuccessPayload;
};
  
export type UpdateUserFailure = {
    type: typeof UPDATE_USER_FAILURE;
    payload: FailurePayload;
};

export type userActions =
    | FetchUsertRequest
    | FetchUserSuccess
    | FetchUserFailure
    | UpdateUserRequest
    | UpdateUserSuccess
    | UpdateUserFailure;