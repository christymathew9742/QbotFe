import {
    FETCH_USER_REQUEST,
    FETCH_USER_SUCCESS,
    FETCH_USER_FAILURE,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAILURE,
} from './actionTypes';

import { userActions, userState } from './types';

const initialState: userState = {
    pending: {
        fetch: false,
        update: false,
    },
    user: [],
    error: null,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action: userActions) => {
    switch (action.type) {
    //fetch categort    
    case FETCH_USER_REQUEST:
        return {
          ...state,
          pending: { ...state.pending, fetch: true },
        };
    case FETCH_USER_SUCCESS:
        return {
          ...state,
          pending: { ...state.pending, fetch: false },
          user: action.payload.user,
          error: null,
        };
    case FETCH_USER_FAILURE:
        return {
            ...state,
            pending: { ...state.pending, fetch: false },
            user: [],
            error: action.payload.error,
        };
    // Update user data
    case UPDATE_USER_REQUEST:
        return {
            ...state,
            pending: { ...state.pending, update: true },
            userResponse: null,
        };
    case UPDATE_USER_SUCCESS:
        return {
            ...state,
            pending: { ...state.pending, update: false },
            userResponse: action.payload,
            user: action.payload.user,
            error: null,
        };
    case UPDATE_USER_FAILURE:
        return {
        ...state,
        pending: { ...state.pending, update: false },
        userResponse: null,
        error: action.payload.error,
        };
    default:
        return {
          ...state,
        };
    }
};