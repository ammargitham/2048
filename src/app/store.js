import { configureStore } from '@reduxjs/toolkit';
import gridReducer from '../features/grid/gridSlice';

export default configureStore({
  reducer: {
    // counter: counterReducer,
    grid: gridReducer
  }
});
