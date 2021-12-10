import {configureStore} from '@reduxjs/toolkit';
import userReducer from './fakeUser';

export default configureStore({
    reducer : {
        user : userReducer
    }
});

