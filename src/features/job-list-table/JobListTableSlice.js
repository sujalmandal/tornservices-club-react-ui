import { createSlice } from '@reduxjs/toolkit';


export const jobListTableSlice = createSlice({
    name: 'jobListTable',
    initialState: {
        "jobs":[{
          "jobType":"Mug",
          "amount":5,
          "targetPlayerName":"Transhumanist",
          "pay":50000
        }]
    },
    reducers: {
      searchJobs: (state,action) => {
        console.log(action)
        state.jobFilters = action.payload;
      }
    }
  });

export const selectJobs = (state) => state.jobListTable.jobs;

export const {searchJobs} = jobListTableSlice.actions;
export default jobListTableSlice.reducer;