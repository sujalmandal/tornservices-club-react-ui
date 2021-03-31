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
      getDetails: (state,action) => {
        
      }
    }
  });

export const selectJobs = (state) => state.jobListTable.jobs;

export const {getDetails} = jobListTableSlice.actions;
export default jobListTableSlice.reducer;