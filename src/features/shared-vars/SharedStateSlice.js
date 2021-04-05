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
      isLoggedIn: false
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
                  console.log("search results set to redux state: " + JSON.stringify(action.payload));
            }
      }
});

export const wipeSharedState = (dispatch) => {
      localStorage.removeItem("sharedState");
      dispatch(updateSharedState(initialSharedState));
      setTimeout(() => { window.location.reload() }, 1000);
}


export const simpleSearchJobsByFilter = function (filterRequestDTO, onResult) {
      return function () {
            axios.post(getSimpleSearchURI(), filterRequestDTO)
                  .then((response) => {
                        onResult(true, response);
                  }, (error) => {
                        onResult(false, error);
                  });
      }
}

export const advancedSearchJobsByFilter = function (filterRequestDTO, onResult) {
      return function () {
            axios.post(getAdvancedSearchURI(), filterRequestDTO)
                  .then((response) => {
                        onResult(true, response);
                  }, (error) => {
                        onResult(false, error);
                  });
      }
}


export const { updateApiKey, updateSharedState, setSearchResults } = sharedStateSlice.actions;
export const selectPlayerInfo = (state) => state.sharedState;
export const selectIsLoggedIn = (state) => state.sharedState.isLoggedIn;
export const selectAPIKey = (state) => state.sharedState.apiKey;
export const selectSearchResults = (state) => state.sharedState.searchResults;
export default sharedStateSlice.reducer;