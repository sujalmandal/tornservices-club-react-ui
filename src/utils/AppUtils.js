export const yyyy_mm_dd = function (dateIn) {
    var yyyy = dateIn.getFullYear();
    var mm = dateIn.getMonth() + 1;
    var dd = dateIn.getDate();
    var dateAsString = yyyy + "-" + mm + "-" + dd;
    console.log(dateAsString);
    return dateAsString;
}

export const validateNumberFormat = function (valueObj, limit) {
    const value = valueObj.value;
    if (parseInt(value) >= 0 && parseInt(value) <= parseInt(limit)) {
        return valueObj;
    }
}