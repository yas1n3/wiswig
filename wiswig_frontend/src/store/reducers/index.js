import { combineReducers } from 'redux';
import userReducer from './userReducer';
import authTokenReducer from './authTokenReducer';

const rootReducer = combineReducers({
    user: userReducer,
    authToken: authTokenReducer
});

export default rootReducer;
