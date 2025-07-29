import { combineReducers } from 'redux';

import userReducer from './reducers/user/reducer'
import botReducer from './reducers/chatBot/reducer'
import appointmentReducer from './reducers/appointment/reducer'

const rootReducer = combineReducers({
    userReducer,
    botReducer,
    appointmentReducer,
});
  
export type AppState = ReturnType<typeof rootReducer>;
export default rootReducer;