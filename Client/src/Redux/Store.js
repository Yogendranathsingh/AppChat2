import { configureStore } from '@reduxjs/toolkit';
import UserReducer from './UserSlice';

const store = configureStore({
    reducer: {
      // Add your reducers here
      user: UserReducer,
    },
  });
  
  export default store;