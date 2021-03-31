import { createSlice } from '@reduxjs/toolkit';


export const jobSearchBarSlice = createSlice({
    name: 'jobSearchBar',
    initialState: {
        "jobFilters":{
          jobType:"",
          pay:0,
          amount:0,
          postedBefore:""
      }
    },
    reducers: {
      searchJobs: (state,action) => {
        console.log(action)
        state.jobFilters = action.payload;
      }
    },
  });

export const selectGlobalJobFilters = (state) => state.jobSearchBar.jobFilters;

export const {searchJobs} = jobSearchBarSlice.actions;
export default jobSearchBarSlice.reducer;