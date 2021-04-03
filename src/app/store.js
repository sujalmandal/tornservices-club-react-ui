import { configureStore } from '@reduxjs/toolkit';
import jobSearchBarReducer from '../features/job-search-bar/JobSearchBarSlice';
import jobListTableReducer from '../features/job-list-table/JobListTableSlice';
import notLoggedInViewReducer from '../features/profile-view/NotLoggedInViewSlice';
import sharedStateReducer from '../features/shared-vars/SharedStateSlice';
import jobPostViewReducer from '../features/job-post-view/JobPostViewSlice';
import advancedJobSearchBarReducer from '../features/advanced-job-search-view/AvancedJobSearchViewSlice';

export default configureStore({
  reducer: {
    sharedState: sharedStateReducer,
    notLoggedInView : notLoggedInViewReducer,
    jobPostView : jobPostViewReducer,
    jobSearchBar: jobSearchBarReducer,
    advancedJobSearchBar: advancedJobSearchBarReducer,
    jobListTable: jobListTableReducer
  },
});