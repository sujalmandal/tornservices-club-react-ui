import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navbar, Nav, Form, Col, Row, Button, ButtonGroup, ToggleButton } from 'react-bootstrap';
import { NotLoggedInView } from '../profile-view/NotLoggedInView';
import { LoggedInView } from '../profile-view/LoggedInView';
import { JobPostView } from '../job-post-view/JobPostView';
import { AdvancedJobSearchView } from '../advanced-job-search-view/AdvancedJobSearchView';
import {
    getAvailableFilters,
    getFilterTemplateByTemplateName,
    simpleSearchJobsByFilter,
    setSearchResults
} from './JobSearchBarSlice';
import {
    SERVICE_TYPE
} from '../../constants';
import SpinnerText from '../common-components/SpinnerText';
import { toast } from 'react-toastify';
import { selectIsLoggedIn } from '../shared-vars/SharedStateSlice';

export function JobSearchBar() {

    const dispatch = useDispatch();

    /* redux, global states */
    const globalIsLoggedIn = useSelector(selectIsLoggedIn);

    /* local, feature-level states */
    const [searchFilterObj, setSearchFilterObj] = useState({
        serviceType: "ALL",
        postedXDaysAgo: 3
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [filterDetailMap, setFilterDetailMap] = useState({});
    const [isAdvancedSearchPopupOpen, setAdvancedSearchPopupOpen] = useState(false);
    const [availableFilterTemplates, setAvailableFilterTemplates] = useState([]);
    const [selectFilterTemplateIndex, setSelectedFilterTemplateIndex] = useState(null);
    const [selectedFilterTemplate, setSelectedFilterTemplate] = useState(null);
    const [selectedServiceTypeKey, setServiceTypeKey] = useState(SERVICE_TYPE.ALL);

    /* on init */
    useEffect(() => {
        setIsLoading(true);
        dispatch(getAvailableFilters(onGetAvailableFiltersResult))
    }, [])

    /* side effects */
    useEffect(() => {
        if (availableFilterTemplates[selectFilterTemplateIndex]) {
            var filterTemplateName = availableFilterTemplates[selectFilterTemplateIndex].jobDetailFilterTemplateName;
            console.log("selected filter template : " + filterTemplateName);
            if (!filterDetailMap[filterTemplateName]) {
                console.log("fetching filter detail for '" + filterTemplateName + "' for the first time.");
                dispatch(getFilterTemplateByTemplateName(filterTemplateName, onGetAvailableFilterDetailsResult));
            } else {
                setSelectedFilterTemplate(filterDetailMap[filterTemplateName]);
            }
        }
    }, [selectFilterTemplateIndex, filterDetailMap]);

    /* event handlers */
    const updateSelectedFilterTemplate = function (selectedIndex) {
        selectedIndex = parseInt(selectedIndex);
        setSelectedFilterTemplateIndex(selectedIndex);
    }

    const updatePostedDate = function (e) {
        setSearchFilterObj({
            ...searchFilterObj,
            postedXDaysAgo: e.target.value
        });
    }

    const handleSelectServiceTypeChange = function (e) {
        var selectedServiceTypeKey=e.currentTarget.name;
        setServiceTypeKey(selectedServiceTypeKey);
        setSearchFilterObj({
            ...searchFilterObj,
            serviceType: selectedServiceTypeKey
        });
    }

    const handleSimpleSearch = function () {
        setIsSearchLoading(true);
       console.log("triggering simple search with criteria : "+JSON.stringify(searchFilterObj));
       dispatch(simpleSearchJobsByFilter(searchFilterObj,onSimpleSearchJobsByFilterResult))
    }

    const openAdvancedSearchPopup = function () {
        setAdvancedSearchPopupOpen(true);
    }

    const closeAdvancedSearchPopup = function () {
        setAdvancedSearchPopupOpen(false);
    }
    
    /* api callbacks */
    const onGetAvailableFiltersResult = function (isSuccess, response) {
        if (isSuccess) {
            setIsLoading(false);
            setAvailableFilterTemplates(response.data);
            console.log("fetched available template information : " + JSON.stringify(response.data));
        }
        else {
            toast.error("Unable to fetch available search parameters, try refreshing the page.");
        }
    }

    const onGetAvailableFilterDetailsResult = function (isSuccess, response) {
        if (isSuccess) {
            var cache = { ...filterDetailMap };
            cache[response.data.filterTemplateName] = response.data;
            setFilterDetailMap({
                ...cache
            });
        }
        else {
            toast.error("Unable to fetch details, try refreshing the page.");
        }
    }

    const onSimpleSearchJobsByFilterResult = function (isSuccess, response) {
        if (isSuccess) {
            setIsSearchLoading(false);
            dispatch(setSearchResults(response.data.jobs))
        }
        else {
            toast.error("Unable to search jobs/services. Please wait for a while and try again.");
        }
    }

    return (
        <div>
            <AdvancedJobSearchView onClose={closeAdvancedSearchPopup} isOpen={isAdvancedSearchPopupOpen} jobDetailFilterTemplate={selectedFilterTemplate} />
            <Navbar fixed="top" bg="dark" variant="dark" expand="lg">
                <Navbar.Brand>Find offers/requests</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto" style={{ paddingLeft: "2vw", paddingTop: "0.3vh" }}>
                        <Form inline>
                            {isLoading ? "" :
                                <Nav variant="pills" onSelect={updateSelectedFilterTemplate}>
                                    <Col>
                                        <Row>
                                            {availableFilterTemplates.map((filter, index) => {
                                                return <div key={'div_' + index}><Nav.Item key={'item_' + index}>
                                                    <Nav.Link key={'link_' + index} eventKey={index}>{filter.jobDetailFilterTemplateLabel}</Nav.Link>
                                                </Nav.Item>
                                                </div>
                                            })}
                                        </Row>
                                    </Col>
                                </Nav>
                            }
                            <Form.Group controlId="formBasicRange" style={{ paddingLeft: "0.5vw" }}>
                                <Form.Label className="mr-sm-4" style={{ color: "gray" }}>Posted between today and {searchFilterObj.postedBeforeDays} day(s) ago</Form.Label>
                                <Form.Control type="range" style={{ width: "10vw" }} min={1} max={7} value={searchFilterObj.postedBeforeDays} onChange={updatePostedDate} />
                            </Form.Group>

                            <Form.Group style={{ paddingLeft: "0.5vw" }}>
                                <ButtonGroup toggle >
                                    <ToggleButton
                                        type="radio"
                                        variant="secondary"
                                        name={SERVICE_TYPE.REQUEST.FILTER.KEY}
                                        checked={selectedServiceTypeKey === SERVICE_TYPE.REQUEST.FILTER.KEY}
                                        onChange={handleSelectServiceTypeChange}
                                    > {SERVICE_TYPE.REQUEST.FILTER.SHORT_LABEL} </ToggleButton>
                                    <ToggleButton
                                        type="radio"
                                        variant="secondary"
                                        name={SERVICE_TYPE.OFFER.FILTER.KEY}
                                        checked={selectedServiceTypeKey === SERVICE_TYPE.OFFER.FILTER.KEY}
                                        onChange={handleSelectServiceTypeChange}
                                    > {SERVICE_TYPE.OFFER.FILTER.SHORT_LABEL} </ToggleButton>
                                </ButtonGroup>
                            </Form.Group>

                            <ButtonGroup style={{ paddingLeft: "0.5vw" }} >
                                <Button onClick={openAdvancedSearchPopup} variant="outline-primary" disabled={(selectedFilterTemplate == null)}>
                                    <SpinnerText loadingText="Just a min.." text="Advanced Search" />
                                </Button>
                                <Button onClick={handleSimpleSearch} variant="primary" disabled={(isSearchLoading)}>
                                    <SpinnerText isLoading={isSearchLoading} loadingText="Just a min.." text="Search" />
                                </Button>
                            </ButtonGroup>
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