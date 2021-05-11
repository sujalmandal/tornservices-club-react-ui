import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
    getAvailableFilters,
    setAvailableTemplateNames
} from '../shared-vars/SharedStateSlice';

export function SharedState() {

    const dispatch = useDispatch();

    useEffect(() => {
        console.log("shared state view loading..");
        dispatch(getAvailableFilters(onGetAvailableFiltersResult))
    }, []);

    const onGetAvailableFiltersResult = function (isSuccess, response) {
        if (isSuccess) {
            var templateLabels=response.data.map(obj=>obj[Object.keys(obj)[0]])
            dispatch(setAvailableTemplateNames(templateLabels));
        }
        else {
            toast.error("Unable to fetch available services, try refreshing the page.");
        }
    }

    return (<></>);
}