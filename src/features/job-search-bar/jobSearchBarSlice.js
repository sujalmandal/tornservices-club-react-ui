import { createSlice } from '@reduxjs/toolkit';
import {
  getJobDetailTemplatesURI,
  getJobDetailFilterTemplateByNameURI,
  getSimpleSearchURI
} from '../../utils/EndpointUtils'
import axios from 'axios';

export const jobSearchBarSlice = createSlice({
    name: 'jobSearchBar',
    initialState: { },
    reducers: { },
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

/* selectors */

export const {} = jobSearchBarSlice.actions;
export default jobSearchBarSlice.reducer;