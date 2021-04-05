import { createSlice } from '@reduxjs/toolkit';


export const jobListTableSlice = createSlice({
    name: 'jobListTable',
    initialState: {
      
    },
    reducers: {
      getDetails: (state,action) => {
        
      }
    }
  });

export const selectSearchResults =(state) => state.jobSearchBar.searchResults;

export const {getDetails} = jobListTableSlice.actions;
export default jobListTableSlice.reducer;