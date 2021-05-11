import { createSlice } from '@reduxjs/toolkit';
import {
  getAvailableTemplateNamesURI,
  getTemplateByNameURI,
  getPostNewJobURI
} from '../../utils/EndpointUtils'
import axios from 'axios';
import {
  getSharedStateFromLocalStorage
} from '../../utils/AppUtils';


export const JobPostViewSlice = createSlice({
  name: 'jobPostView',
  initialState: {

  },
  reducers: {
  
  }
});

export const getAvailableJobDetailKeys = function (onResult) {
  return function () {
    axios({
      method:"GET",
      url:getAvailableTemplateNamesURI(),
      headers:{
            fingerprint:getSharedStateFromLocalStorage().fingerprint,
            apiKey:getSharedStateFromLocalStorage().apiKey
      }
      })
      .then((response) => {
        onResult(true, response);
      }, (error) => {
        onResult(false, error);
      });
  }
}

export const getJobDetailFormData = function (jobDetailTemplateName, onResult) {
  return function () {
    axios({
      method:'GET',
      url:getTemplateByNameURI(jobDetailTemplateName),
      headers:{
            fingerprint: getSharedStateFromLocalStorage().fingerprint,
            apiKey: getSharedStateFromLocalStorage().apiKey
      }
      })
      .then((response) => {
        onResult(true, response);
      }, (error) => {
        onResult(false, error);
      });
  }
}

export const postNewJob = function (createJobDTO, onResult) {
  return function () {
    axios({
      method:'POST',
      url: getPostNewJobURI(),
      data:createJobDTO,
      headers:{
            fingerprint: getSharedStateFromLocalStorage().fingerprint,
            apiKey: getSharedStateFromLocalStorage().apiKey
      }
      })
      .then((response) => {
        onResult(true, response);
      }, (error) => {
        onResult(false, error);
      });
  }
}

export const { } = JobPostViewSlice.actions;
export default JobPostViewSlice.reducer;