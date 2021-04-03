import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navbar, Nav, Form, FormControl, Col, Row } from 'react-bootstrap';
import { NotLoggedInView } from '../profile-view/NotLoggedInView';
import { LoggedInView } from '../profile-view/LoggedInView';
import { JobPostView } from '../job-post-view/JobPostView';
import {
    searchJobs,
    selectGlobalJobFilters,
    getAvailableFilters,
    getFilterTemplateByTemplateName
} from './JobSearchBarSlice';
import {
    SERVICE_TYPE_OFFERING_TEXT,
    SERVICE_TYPE_REQUESTING_TEXT,
    SERVICE_TYPE_OFFER,
    SERVICE_TYPE_REQUEST,
    CURRENCY_FORMAT
} from '../../constants';
import NumberFormat from 'react-number-format';
import SpinnerText from '../common-components/SpinnerText';
import { toast } from 'react-toastify';
import { selectIsLoggedIn } from '../shared-vars/SharedStateSlice';

export function JobSearchBar() {

    const dispatch = useDispatch();

    /* redux, global states */
    const globalIsLoggedIn = useSelector(selectIsLoggedIn);

    /* local, feature-level states */
    const [jobFilters, setJobFilters] = useState({
        filterType: "",
        postedBeforeDays: 3
    });
    const [filterDetailMap, setFilterDetailMap] = useState({});
    const [isFetchAvailableFilterLoading, setFetchAvailableFilterLoading] = useState(false);
    const [availableFilters, setAvailableFilters] = useState([]);
    const [selectedFilterIndex, setSelectedFilterIndex] = useState();
    const [serviceType, setServiceType] = useState(SERVICE_TYPE_REQUEST);
    const [selectedFilterTemplate, setSelectedFilterTemplate] = useState(null);
    /* on init */
    useEffect(() => {
        setFetchAvailableFilterLoading(true);
        dispatch(getAvailableFilters(onGetAvailableFiltersResult))
    }, [])

    /* side effects */

    useEffect(() => {
        if (availableFilters[selectedFilterIndex]) {
            var filterTemplateName = availableFilters[selectedFilterIndex].jobDetailFilterTemplateName;
            console.log("selected filter template : " + filterTemplateName);
            setJobFilters({
                ...jobFilters,
                filterType: filterTemplateName
            });
            if (!filterDetailMap[filterTemplateName]) {
                console.log("fetching filter detail for '" + filterTemplateName + "' for the first time.");
                dispatch(getFilterTemplateByTemplateName(filterTemplateName, onGetAvailableFilterDetailsResult));
            }else{
                setSelectedFilterTemplate(filterDetailMap[filterTemplateName]);
            }
        }
    }, [selectedFilterIndex,filterDetailMap]);

    useEffect(()=>{
        console.log("selected template: "+JSON.stringify(selectedFilterTemplate));
    },[selectedFilterTemplate])

    /* event handlers */
    const updateSelectedFilter = function (selectedIndex) {
        selectedIndex = parseInt(selectedIndex);
        setSelectedFilterIndex(selectedIndex);
    }

    const updatePostedDate = function (e) {
        setJobFilters({
            ...jobFilters,
            postedBeforeDays: e.target.value
        });
    }

    const updateMinAmount = function (e) {
        setJobFilters({
            ...jobFilters,
            amount: e.target.value
        })
    }

    const handleOnChangeFormElement = function (e) {
        var fieldName = e.target.name;
        var fieldValue = e.target.value;
        fieldValue = fieldValue.replaceAll('$', '');
        fieldValue = fieldValue.replaceAll(',', '');

    }

    /* api callbacks */

    const onGetAvailableFiltersResult = function (isSuccess, response) {
        if (isSuccess) {
            setFetchAvailableFilterLoading(false);
            setAvailableFilters(response.data);
        }
        else {
            toast.error("Unable to fetch available search parameters, try refreshing the page.");
        }
    }

    const onGetAvailableFilterDetailsResult = function (isSuccess, response) {
        if (isSuccess) {
            var cache={...filterDetailMap};
            cache[response.data.filterTemplateName] = response.data;
            setFilterDetailMap({
                ...cache
            });
        }
        else {
            toast.error("Unable to fetch details, try refreshing the page.");
        }
    }

    return (
        <div>
            <Navbar fixed="top" bg="dark" variant="dark" expand="lg">
                <Navbar.Brand href="#home">Find available jobs</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto" style={{ minWidth: "65vw", paddingLeft: "2vw", paddingTop: "0.3vh" }}>
                        <Form inline>
                            {isFetchAvailableFilterLoading ? "" :
                                <Nav variant="pills" onSelect={updateSelectedFilter}>
                                    <Col>
                                        <Row>
                                            {availableFilters.map((filter, index) => {
                                                return <div><Nav.Item>
                                                    <Nav.Link eventKey={index}>{filter.jobDetailFilterTemplateLabel}</Nav.Link>
                                                </Nav.Item>
                                                </div>
                                            })}
                                        </Row>
                                    </Col>
                                </Nav>
                            }
                            <Form.Group controlId="formBasicRange">
                                <Form.Label className="mr-sm-4" style={{ color: "gray" }}>Posted before {jobFilters.postedBeforeDays} day(s)?</Form.Label>
                                <Form.Control type="range" style={{ width: "10vw" }} min={1} max={7} value={jobFilters.postedBeforeDays} onChange={updatePostedDate} />
                            </Form.Group>
                            
                        </Form>
                    </Nav>
                    <Nav className="mr-auto" style={{ paddingLeft: "0.5vw", minWidth: "20vw", paddingRight: "0.5vw" }}>
                        <Row>
                            <Col style={{ minWidth: "5vw" }}>
                                <JobPostView />
                            </Col>
                            <Col style={{ minWidth: "5vw" }}>
                                {globalIsLoggedIn ? <LoggedInView /> : <NotLoggedInView />}
                            </Col>
                        </Row>
                    </Nav>
                </Navbar.Collapse>

            </Navbar>

        </div>
    );

}