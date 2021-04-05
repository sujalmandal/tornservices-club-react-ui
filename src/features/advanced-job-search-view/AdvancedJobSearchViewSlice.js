import { createSlice } from '@reduxjs/toolkit';
import {
  getAdvancedSearchURI
} from '../../utils/EndpointUtils'
import axios from 'axios';

export const AdvancedJobSearchViewSlice = createSlice({
  name: 'advancedJobSearchView',
  initialState: {

  },
  reducers: {
  
  }
});

export const { } = AdvancedJobSearchViewSlice.actions;
export default AdvancedJobSearchViewSlice.reducer;