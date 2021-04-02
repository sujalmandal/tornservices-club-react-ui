import { createSlice } from '@reduxjs/toolkit';
import {
  getJobDetailTemplatesKeyURI,
  getJobDetailTemplateByKeyURI
} from '../../utils/EndpointUtils'
import axios from 'axios';

export const JobPostViewSlice = createSlice({
  name: 'jobPostView',
  initialState: {

  },
  reducers: {
    postNewJob: (state, action) => {

    }
  }
});

export const getAvailableJobDetailKeys = function (onResult) {
  return function (dispatch) {
    axios.get(getJobDetailTemplatesKeyURI())
      .then((response) => {
        onResult(true, response);
      }, (error) => {
        onResult(false, error);
      });
  }
}

export const getJobDetailFormData = function (jobDetailKey, onResult) {
  return function (dispatch) {
    axios.get(getJobDetailTemplateByKeyURI(jobDetailKey))
      .then((response) => {
        onResult(true, response);
      }, (error) => {
        onResult(false, error);
      });
  }
}

export const { postNewJob } = JobPostViewSlice.actions;
export default JobPostViewSlice.reducer;