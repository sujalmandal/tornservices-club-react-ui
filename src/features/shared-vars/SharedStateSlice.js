import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import {
      getSimpleSearchURI,
      getAdvancedSearchURI,
      getTemplateByNameURI,
      getAvailableTemplateNamesURI,
} from '../../utils/EndpointUtils'

import {
      initialSharedState,
      getSharedStateFromLocalStorage
} from '../../utils/AppUtils';

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
            },
            setCurrentPageNumber: (state, action) => {
                  console.log("updated current page number: " + JSON.stringify(action.payload));
                  state.currentPageNumber = action.payload;
            },
            setAvailableTemplateNames: (state,action)=>{
                  console.log("updated available template names in redux: " + JSON.stringify(action.payload));
                  state.availableTemplateNames = action.payload;
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
            axios({
                  method: 'POST',
                  url: getSimpleSearchURI(),
                  data: filterRequestDTO,
                  headers: {
                        fingerprint: getSharedStateFromLocalStorage().fingerprint,
                        apiKey: getSharedStateFromLocalStorage().apiKey
                  }
            })
                  .then((response) => {
                        dispatch(setCurrentPageNumber(1));
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
            axios({
                  method: 'POST',
                  url: getAdvancedSearchURI(),
                  data: filterRequestDTO,
                  headers: {
                        fingerprint: getSharedStateFromLocalStorage().fingerprint,
                        apiKey: getSharedStateFromLocalStorage().apiKey
                  }
            })
                  .then((response) => {
                        dispatch(setSearchLoading(false));
                        dispatch(setCurrentPageNumber(1));
                        onResult(true, response);
                  }).catch((error) => {
                        dispatch(setSearchLoading(false));
                        onResult(false, error.response);
                  });
      }
}

export const searchByPageNumber = function (pageNumber, filterRequestDTO, onResult, dispatch) {
      return function () {
            console.log("search by page number: " + pageNumber);
            dispatch(setSearchLoading(true));
            axios({
                  method: 'POST',
                  url: getAdvancedSearchURI(),
                  data: {
                        ...filterRequestDTO,
                        pageNumber: pageNumber
                  },
                  headers: {
                        fingerprint: getSharedStateFromLocalStorage().fingerprint,
                        apiKey: getSharedStateFromLocalStorage().apiKey
                  }
            })
                  .then((response) => {
                        dispatch(setSearchLoading(false));
                        onResult(true, response);
                  }).catch((error) => {
                        dispatch(setSearchLoading(false));
                        onResult(false, error.response);
                  });
      }
}

/* api calls */
export const getAvailableFilters = function (onResult) {
      return function () {
            axios.get(getAvailableTemplateNamesURI())
                  .then((response) => {
                        onResult(true, response);
                  }, (error) => {
                        onResult(false, error);
                  });
      }
}

export const getFilterTemplateByTemplateName = function (filterType, onResult) {
      return function () {
            axios.get(getTemplateByNameURI(filterType))
                  .then((response) => {
                        onResult(true, response);
                  }, (error) => {
                        onResult(false, error);
                  });
      }
}

export const selectSharedState = (state) => state.sharedState;
export const selectIsLoggedIn = (state) => state.sharedState.isLoggedIn;
export const selectAPIKey = (state) => state.sharedState.apiKey;

export const selectAvailableTemplateNames = (state) => state.sharedState.availableTemplateNames;

export const selectIsSearchLoading = (state) => state.sharedState.searchLoading;
export const selectSearchRequestObj = (state) => state.sharedState.searchRequestObj;

export const selectSearchResults = (state) => state.sharedState.searchResults;
export const selectCurrentPageNumber = (state) => state.sharedState.currentPageNumber;
export const selectPaginationDetails = (state) => {
      var paginationDetailsObj = { ...state.sharedState.searchResults };
      delete paginationDetailsObj.jobs
      return paginationDetailsObj;
};

export const {
      updateSharedState,
      setSearchResults,
      setSearchLoading,
      setSimpleSearchReqObj,
      setAdvancedSearchReqObj,
      setCurrentPageNumber,
      setAvailableTemplateNames
} = sharedStateSlice.actions;

export default sharedStateSlice.reducer;