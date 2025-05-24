import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import rootReducer from './rootReducer';
import { rootSaga } from './rootSaga';

// Initialize the Saga middleware
const sagaMiddleware = createSagaMiddleware();

// Configure and create the store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware, logger),
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools only in development
});

// Run the root saga
sagaMiddleware.run(rootSaga);

// Export typed hooks to use in components
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
