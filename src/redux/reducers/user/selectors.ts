import { createSelector } from 'reselect';
import { RootState } from '@/redux/store';

const getPending = (state: RootState) => state?.userReducer?.pending;
const getUsers = (state: RootState) => state.userReducer?.user;
const getWhatsAppUsers = (state: RootState) => state.userReducer?.whatsAppUsers;
const getGlobalData = (state: RootState) => state.userReducer?.globalData
const getError = (state: RootState) => state?.userReducer;

export const getUserSelector = createSelector(getUsers, (userState:any) => userState)
export const getWhatsAppUserSelector = createSelector(getWhatsAppUsers,(whatsAppUsers:any) => whatsAppUsers);
export const getWhatsAppGlobaleSelector = createSelector(getGlobalData,(globalData:any) => globalData);
export const getAllPending = createSelector(getPending,(pending:any) => pending);
export const getErrorSelector = createSelector(getError, (error:any) => error);

// Pending selectors
export const getFetchPendingSelector = createSelector(
  getPending,
  (pending) => pending?.fetch
);

export const getFetchWhatsAppUserPendingSelector = createSelector(
  getPending,
  (pending) => pending?.whatsAppUser
);

export const getFetchWhatsAppPendingSelector = createSelector(
  getPending,
  (pending) => pending?.globalData
);

export const getUpdateUserPendingSelector = createSelector(
  getPending,
  (pending) => pending?.update
);

export const getUpdateUserPostSelector = createSelector(
  getPending,
  (pending) => pending?.post
);
