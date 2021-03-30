import { configureStore } from '@reduxjs/toolkit';
import jobSearchBarReducer from '../features/job-search-bar/jobSearchBarSlice';

export default configureStore({
  reducer: {
    jobSearchBar: jobSearchBarReducer
  },
});
