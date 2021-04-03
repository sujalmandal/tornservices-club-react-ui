import { createSlice } from '@reduxjs/toolkit';
import {
  getJobDetailTemplatesURI,
  getJobDetailTemplateByNameURI,
  getPostNewJobURI
} from '../../utils/EndpointUtils'
import axios from 'axios';

export const JobPostViewSlice = createSlice({
  name: 'jobPostView',
  initialState: {

  },
  reducers: {
  
  }
});

export const getAvailableJobDetailKeys = function (onResult) {
  return function () {
    axios.get(getJobDetailTemplatesURI())
      .then((response) => {
        onResult(true, response);
      }, (error) => {
        onResult(false, error);
      });
  }
}

export const getJobDetailFormData = function (jobDetailTemplateName, onResult) {
  return function () {
    axios.get(getJobDetailTemplateByNameURI(jobDetailTemplateName))
      .then((response) => {
        onResult(true, response);
      }, (error) => {
        onResult(false, error);
      });
  }
}

export const postNewJob = function (createJobDTO, onResult) {
  return function () {
    axios.post(getPostNewJobURI(),createJobDTO)
      .then((response) => {
        onResult(true, response);
      }, (error) => {
        onResult(false, error);
      });
  }
}

export const { } = JobPostViewSlice.actions;
export default JobPostViewSlice.reducer;