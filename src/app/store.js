import { configureStore } from '@reduxjs/toolkit';
import jobSearchBarReducer from '../features/job-search-bar/JobSearchBarSlice';
import jobListTableReducer from '../features/job-list-table/JobListTableSlice';
import registrationLoginReducer from '../features/registration-login/RegistrationLoginSlice';

export default configureStore({
  reducer: {
    jobSearchBar: jobSearchBarReducer,
    jobListTable: jobListTableReducer,
    registrationLogin : registrationLoginReducer,
  },
});
