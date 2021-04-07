import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import {
      getSimpleSearchURI,
      getAdvancedSearchURI
} from '../../utils/EndpointUtils'

export const initialSharedState = {
      apiKey: "",
      activeSubscriptionType: "",
      tornUserName: "",
      tornPlayerId: "",
      playerId: "",
      isLoggedIn: false,
      searchLoading: true,
      searchRequestObj: {
            "serviceType": "ALL",
            "postedXDaysAgo": 3,
            "filterFields": [],
            "filterTemplateName": ""
      }
};

const getSharedStateFromLocalStorage = function () {
      return localStorage.getItem("sharedState") ? JSON.parse(localStorage.getItem("sharedState")) : initialSharedState;
}

const setSharedStateToLocalStorage = function (sharedCache) {
      localStorage.setItem("sharedState", JSON.stringify(sharedCache));
}

export const sharedStateSlice = createSlice({
      name: 'sharedState',
      initialState: {
            ...getSharedStateFromLocalStorage(),
            searchResults: []
      },
      reducers: {
            updateApiKey: (state, action) => {
                  state.apiKey = action.payload;
            },
            updateSharedState: (state, action) => {
                  state = action.payload;
                  setSharedStateToLocalStorage(action.payload);
            },
            setSearchResults: (state, action) => {
                  state.searchResults = action.payload;
                  state.searchLoading = false;
                  console.log("search results set to redux state: " + JSON.stringify(action.payload));
            },
            setSearchLoading: (state, action) => {
                  state.searchLoading = action.payload;
                  console.log("search loading set to true redux state.");
            },
            setSimpleSearchReqObj: (state, action) => {
                  console.log("updated simple search request: " + JSON.stringify(action.payload));
                  state.searchRequestObj = {
                        ...action.payload,
                        filterFields: []
                  };
            },
            setAdvancedSearchReqObj: (state, action) => {
                  console.log("updated advanced search request: " + JSON.stringify(action.payload));
                  state.searchRequestObj = action.payload;
            }
      }
});

export const wipeSharedState = (dispatch) => {
      localStorage.removeItem("sharedState");
      dispatch(updateSharedState(initialSharedState));
      setTimeout(() => { window.location.reload() }, 1000);
}

export const simpleSearchJobsByFilter = function (filterRequestDTO, onResult, dispatch) {
      return function () {
            dispatch(setSearchLoading(true));
            axios.post(getSimpleSearchURI(), filterRequestDTO)
                  .then((response) => {
                        dispatch(setSearchLoading(false));
                        onResult(true, response);
                  }).catch((error, response) => {
                        dispatch(setSearchLoading(false));
                        onResult(false, error.response);
                  });
      }
}

export const searchJobsByFilter = function (filterRequestDTO, onResult, dispatch) {
      return function () {
            dispatch(setSearchLoading(true));
            axios.post(getAdvancedSearchURI(), filterRequestDTO)
                  .then((response) => {
                        dispatch(setSearchLoading(false));
                        onResult(true, response);
                  }).catch((error) => {
                        dispatch(setSearchLoading(false));
                        onResult(false, error.response);
                  });
      }
}

export const {
      updateApiKey,
      updateSharedState,
      setSearchResults,
      setSearchLoading,
      setSimpleSearchReqObj,
      setAdvancedSearchReqObj
} = sharedStateSlice.actions;

export const selectPlayerInfo = (state) => state.sharedState;
export const selectIsLoggedIn = (state) => state.sharedState.isLoggedIn;
export const selectAPIKey = (state) => state.sharedState.apiKey;

export const selectIsSearchLoading = (state) => state.sharedState.searchLoading;
export const selectSearchRequestObj = (state) => state.sharedState.searchRequestObj;

export const selectSearchResults = (state) => state.sharedState.searchResults;
export default sharedStateSlice.reducer;