import { createSlice } from '@reduxjs/toolkit';


export const JobPostViewSlice = createSlice({
    name: 'jobPostView',
    initialState: {
      
    },
    reducers: {
      postNewJob: (state,action) => {
        
      }
    }
  });

export const {postNewJob} = JobPostViewSlice.actions;
export default JobPostViewSlice.reducer;