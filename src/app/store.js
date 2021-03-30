import { configureStore } from '@reduxjs/toolkit';
import jobSearchBarReducer from '../features/job-search-bar/JobSearchBarSlice';
import jobListTableReducer from '../features/job-list-table/JobListTableSlice';

export default configureStore({
  reducer: {
    jobSearchBar: jobSearchBarReducer,
    jobListTable: jobListTableReducer
  },
});
