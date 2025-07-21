import { createSelector } from 'reselect';
import { RootState } from '@/redux/store';

const getPending = (state: RootState) => state?.userReducer?.pending;
const getUser = (state: RootState) => state?.userReducer;
const getError = (state: RootState) => state?.userReducer;

export const getUserSelector = createSelector(getUser, (user:any) => user)
export const getAllPending = createSelector(getPending,(pending:any) => pending);
export const getErrorSelector = createSelector(getError, (error:any) => error);

// New selectors for each pending flag
export const getFetchPendingSelector = createSelector(
  getPending,
  (pending:any)  => pending?.fetch
);

export const getUpdateUserPendingSelector = createSelector(
  getPending,
  (pending:any) => pending?.update
);

export const getUpdateUserPostSelector = createSelector(
  getPending,
  (pending:any) => pending?.post
);