import { createSlice } from '@reduxjs/toolkit';
import {
  getJobDetailTemplatesURI,
  getJobDetailFilterTemplateByNameURI
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
      axios.get(getJobDetailTemplatesURI())
        .then((response) => {
          onResult(true, response);
        }, (error) => {
          onResult(false, error);
        });
    }
  }

  export const getFilterTemplateByTemplateName = function (filterType,onResult) {
    return function () {
      axios.get(getJobDetailFilterTemplateByNameURI(filterType))
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