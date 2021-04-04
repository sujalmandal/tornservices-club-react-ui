import { createSlice } from '@reduxjs/toolkit';
import {
  getJobDetailTemplatesURI,
  getJobDetailFilterTemplateByNameURI,
  getSimpleSearchURI
} from '../../utils/EndpointUtils'
import axios from 'axios';

export const jobSearchBarSlice = createSlice({
    name: 'jobSearchBar',
    initialState: {
        searchResults:[]
    },
    reducers: {
      setSearchResults:(state,action) => {
        state.searchResults=action.payload;
        console.log("search results set to redux state: "+JSON.stringify(action.payload));
      }
    },
  });

  /* api calls */
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

  export const simpleSearchJobsByFilter = function (filterRequestDTO,onResult) {
    return function () {
      axios.post(getSimpleSearchURI(),filterRequestDTO)
        .then((response) => {
          onResult(true, response);
        }, (error) => {
          onResult(false, error);
        });
    }
  }

/* selectors */
export const selectSearchResults =(state) => state.jobSearchBar.searchResults;

export const {setSearchResults} = jobSearchBarSlice.actions;
export default jobSearchBarSlice.reducer;