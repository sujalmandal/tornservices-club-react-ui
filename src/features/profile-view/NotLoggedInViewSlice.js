import { createSlice } from '@reduxjs/toolkit';
import { getLoginURI } from '../../utils/EndpointUtils'

import axios from 'axios';

export const notLoggedInViewSlice = createSlice({
  name: 'notLoggedInView',
  initialState: {},
  reducers: {},
});

export const {} = notLoggedInViewSlice.actions;

export const sendLoginRequest = function (apiKey, onResult) {
  return function (dispatch) {
    axios.post(getLoginURI(apiKey))
      .then((response) => {
        onResult(true, response);
      }, (error) => {
        onResult(false, error);
      });
  }
}

export default notLoggedInViewSlice.reducer;