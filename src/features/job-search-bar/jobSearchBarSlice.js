import { createSlice } from '@reduxjs/toolkit';
import {
  getJobDetailTemplatesKeyURI,
  getJobDetailTemplateByKeyURI
} from '../../utils/EndpointUtils'
import axios from 'axios';

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


  export const getAvailableFilters = function (onResult) {
    return function () {
      axios.get(getJobDetailTemplatesKeyURI())
        .then((response) => {
          onResult(true, response);
        }, (error) => {
          onResult(false, error);
        });
    }
  }

  export const getAvailableFilterDetails = function (filterType,onResult) {
    return function () {
      axios.get(getJobDetailTemplateByKeyURI(filterType))
        .then((response) => {
          onResult(true, response);
        }, (error) => {
          onResult(false, error);
        });
    }
  }

export const selectGlobalJobFilters = (state) => state.jobSearchBar.jobFilters;
export const {searchJobs} = jobSearchBarSlice.actions;
export default jobSearchBarSlice.reducer;