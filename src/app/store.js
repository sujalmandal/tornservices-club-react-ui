import { configureStore } from '@reduxjs/toolkit';
import jobSearchBarReducer from '../features/job-search-bar/JobSearchBarSlice';
import jobListTableReducer from '../features/job-list-table/JobListTableSlice';
import notLoggedInViewReducer from '../features/profile-view/NotLoggedInViewSlice';
import sharedCacheReducer from '../features/shared-vars/SharedCacheSlice';
import jobPostViewReducer from '../features/job-post-view/JobPostViewSlice';

export default configureStore({
  reducer: {
    jobSearchBar: jobSearchBarReducer,
    jobListTable: jobListTableReducer,
    notLoggedInView : notLoggedInViewReducer,
    jobPostView : jobPostViewReducer,
    sharedCache: sharedCacheReducer
  },
});
