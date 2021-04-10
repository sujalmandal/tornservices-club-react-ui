import {DATE_FORMAT} from '../constants';
import moment from 'moment'


export const initialSharedState = {
    isLoggedIn: false,
    searchLoading: false,
    searchRequestObj: {
          "serviceType": "ALL",
          "pageSize": 3,
          "postedXDaysAgo": 3,
          "filterFields": [],
          "filterTemplateName": ""
    },
    currentPageNumber: 1
};

export const getSharedStateFromLocalStorage = function () {
    var storedState = localStorage.getItem("sharedState");
    if (storedState) {
          console.log("stored state found!")
          return JSON.parse(storedState);
    }
    else {
          console.log("stored not state found, returning initial state.");
          return initialSharedState;
    }
}

export const yyyy_mm_dd = function (dateIn) {
    var yyyy = dateIn.getFullYear();
    var mm = dateIn.getMonth() + 1;
    var dd = dateIn.getDate();
    var dateAsString = yyyy + "-" + mm + "-" + dd;
    return dateAsString;
}

export const validateNumberFormat = function (valueObj, maxValue, minValue) {
    const value = valueObj.value;
    console.log("value passed: "+value+", limit: "+maxValue)
    if(value===""){
        console.log("value is empty")
        valueObj.value=0;
        valueObj.formattedValue="$0";
        return valueObj;
    }
    if (parseInt(value) <= parseInt(maxValue)) {
        return valueObj;
    }
}

export const formatCurrency = function (e,minValue,maxValue,onChange) {
    var value = e.target.value;
    value=value.replaceAll(",","");
    var isNumber=!isNaN(value);
    if(isNumber){
        if(value>maxValue){
            value=maxValue+"";
        }
        if(value<minValue){
            value=minValue+"";
        }
        var formattedAsCurrency=value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        e.target.value=formattedAsCurrency;
        console.log("formattedAsCurrency: "+formattedAsCurrency+", minValue: "+minValue+", maxValue: "+maxValue);
        onChange(e);
    }
}

export const formatCurrencyForFilter = function (e,minValue,maxValue,fieldName,groupName,fieldType,onChange) {
    var value = e.target.value;
    value=value.replaceAll(",","");
    var isNumber=!isNaN(value);
    if(isNumber){
        if(value>maxValue){
            value=maxValue+"";
        }
        if(value<minValue){
            value=minValue+"";
        }
        var formattedAsCurrency=value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        e.target.value=formattedAsCurrency;
        console.log("formattedAsCurrency: "+formattedAsCurrency+", minValue: "+minValue+", maxValue: "+maxValue);
        onChange(value,fieldName,groupName,fieldType);
    }
}

export const allowOnlyNumbers=function(e){
    var keyChar = e.key;
    if(isNaN(keyChar) || keyChar===" "){
        e.preventDefault();
    }
}

export const fieldHasError=(fieldName,errorMap)=>{
    if(errorMap==={} || Object.keys(errorMap).length === 0 ||  errorMap===null || errorMap===undefined){
        return false;
    }
    else if(errorMap[fieldName]){
        return false;
    }
    else{
        return true;
    }
}

export const getFieldErrorMessage=(fieldName,errorMap)=>{
    if(!fieldHasError){
        return "";
    }
    else if(!errorMap[fieldName]){
        return "";
    }
    else{
        return errorMap[fieldName];
    }
}

export const renderFriendlyDate=(dateString)=>{
    var dateObj = moment(dateString,DATE_FORMAT);
    var now = new Date();
    var diff = now.getDay()-dateObj.day();
    if(diff===0){
        return "today";
    }
    else if(diff===1){
        return "yesterday";
    }
    else{
        return diff;
    }
}
