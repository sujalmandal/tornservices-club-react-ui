import { configureStore } from '@reduxjs/toolkit';
import jobSearchBarReducer from '../features/job-search-bar/JobSearchBarSlice';
import notLoggedInViewReducer from '../features/profile-view/NotLoggedInViewSlice';
import sharedStateReducer from '../features/shared-vars/SharedStateSlice';
import jobPostViewReducer from '../features/job-post-view/JobPostViewSlice';

/* components that don't use global states don't need reducers */
export default configureStore({
  reducer: {
    sharedState: sharedStateReducer,
    notLoggedInView : notLoggedInViewReducer,
    jobPostView : jobPostViewReducer,
    jobSearchBar: jobSearchBarReducer
  },
});