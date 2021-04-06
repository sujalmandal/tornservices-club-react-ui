import {DATE_FORMAT} from '../constants';
import moment from 'moment'

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
        valueObj.value=minValue;
        valueObj.formattedValue="$"+minValue;
        return valueObj;
    }
    if (parseInt(value) >= parseInt(minValue) && parseInt(value) <= parseInt(maxValue)) {
        return valueObj;
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