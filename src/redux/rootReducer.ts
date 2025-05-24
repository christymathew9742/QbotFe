import { combineReducers } from 'redux';

import userReducer from './reducers/user/reducer'
import botReducer from './reducers/chatBot/reducer'

const rootReducer = combineReducers({
    userReducer,
    botReducer,
});
  
export type AppState = ReturnType<typeof rootReducer>;
export default rootReducer;