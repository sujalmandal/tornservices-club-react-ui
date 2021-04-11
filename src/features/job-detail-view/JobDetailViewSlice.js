import { createSlice } from '@reduxjs/toolkit';
import {
  getJobDetailURI
} from '../../utils/EndpointUtils'
import axios from 'axios';
import {
  getSharedStateFromLocalStorage
} from '../../utils/AppUtils';


export const JobDetailViewSlice = createSlice({
  name: 'jobDetailView',
  initialState: {

  },
  reducers: {
  
  }
});

export const getJobById = function (jobId,onResult) {
  return function () {
    axios({
      method:"GET",
      url:getJobDetailURI()+parseInt(jobId),
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

export const { } = JobDetailViewSlice.actions;
export default JobDetailViewSlice.reducer;