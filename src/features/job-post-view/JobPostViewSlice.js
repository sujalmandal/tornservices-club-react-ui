import { createSlice } from '@reduxjs/toolkit';
import {
  getJobDetailTemplatesKeyURI,
  getJobDetailTemplateByKeyURI,
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
    axios.get(getJobDetailTemplatesKeyURI())
      .then((response) => {
        onResult(true, response);
      }, (error) => {
        onResult(false, error);
      });
  }
}

export const getJobDetailFormData = function (jobDetailKey, onResult) {
  return function () {
    axios.get(getJobDetailTemplateByKeyURI(jobDetailKey))
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