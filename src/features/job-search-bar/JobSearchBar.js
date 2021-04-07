import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navbar, Nav, Form, Col, Row, Button, ButtonGroup, ToggleButton, Container } from 'react-bootstrap';
import { NotLoggedInView } from '../profile-view/NotLoggedInView';
import { LoggedInView } from '../profile-view/LoggedInView';
import { JobPostView } from '../job-post-view/JobPostView';
import { AdvancedJobSearchView } from '../advanced-job-search-view/AdvancedJobSearchView';
import {
    getAvailableFilters,
    getFilterTemplateByTemplateName
} from './JobSearchBarSlice';
import {
    SERVICE_TYPE
} from '../../constants';
import SpinnerText from '../common-components/SpinnerText';
import { toast } from 'react-toastify';
import {
    selectIsLoggedIn,
    simpleSearchJobsByFilter,
    setSearchResults,
    selectIsSearchLoading,
    setSearchLoading
} from '../shared-vars/SharedStateSlice';
export function JobSearchBar() {

    const dispatch = useDispatch();

    /* redux, global states */
    const isLoggedIn_ReduxState = useSelector(selectIsLoggedIn);
    const isSearchLoading_ReduxState = useSelector(selectIsSearchLoading);

    /* local, feature-level states */
    const [searchFilterObj, setSearchFilterObj] = useState({
        serviceType: "ALL",
        postedXDaysAgo: 3,
        filterTemplateName: ""
    });

    const [isFilterRequestLoading, setIsFilterRequestLoading] = useState(false);
    const [filterDetailMap, setFilterDetailMap] = useState({});
    const [isAdvancedSearchPopupOpen, setAdvancedSearchPopupOpen] = useState(false);
    const [availableFilterTemplates, setAvailableFilterTemplates] = useState([]);
    const [selectFilterTemplateIndex, setSelectedFilterTemplateIndex] = useState(null);
    const [selectedFilterTemplateObj, setSelectedFilterTemplateObj] = useState(null);
    const [selectedServiceTypeKey, setServiceTypeKey] = useState(SERVICE_TYPE.ALL);
    const [firstLoad, setFirstLoad] = useState(true);
    /* on init */
    useEffect(() => {
        setIsFilterRequestLoading(true);
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
                setSelectedFilterTemplateObj(filterDetailMap[filterTemplateName]);
                setSearchFilterObj({
                    ...searchFilterObj,
                    filterTemplateName: filterDetailMap[filterTemplateName].jobDetailFilterTemplateName
                });
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
        var selectedServiceTypeKey = e.currentTarget.name;
        setServiceTypeKey(selectedServiceTypeKey);
        setSearchFilterObj({
            ...searchFilterObj,
            serviceType: selectedServiceTypeKey
        });
    }

    const handleSimpleSearch = function () {
        dispatch(setSearchLoading());
        console.log("triggering simple search with criteria : " + JSON.stringify(searchFilterObj));
        dispatch(simpleSearchJobsByFilter(searchFilterObj, onSimpleSearchJobsByFilterResult))
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
            setIsFilterRequestLoading(false);
            setAvailableFilterTemplates(response.data);
            console.log("fetched available template information : " + JSON.stringify(response.data));
            if (firstLoad && isLoggedIn_ReduxState) {
                handleSimpleSearch();
                setFirstLoad(false);
            }
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
            dispatch(setSearchLoading());
            dispatch(setSearchResults(response.data))
        }
        else {
            toast.error("Unable to search jobs/services. Please wait for a while and try again.");
        }
    }

    return (
        <Container fluid>
            <AdvancedJobSearchView onClose={closeAdvancedSearchPopup} isOpen={isAdvancedSearchPopupOpen} jobDetailFilterTemplate={selectedFilterTemplateObj} />
            <Navbar fixed="top" bg="dark" variant="dark" expand="lg">
                <Navbar.Brand>Find offers/requests</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto" style={{ paddingLeft: "2vw", paddingTop: "0.3vh" }}>
                        <Form inline>
                            {isFilterRequestLoading ? "" :
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
                                <Form.Label className="mr-sm-4" style={{ color: "gray" }}>Posted between today and {searchFilterObj.postedXDaysAgo} day(s) ago</Form.Label>
                                <Form.Control type="range" style={{ width: "10vw" }} min={1} max={7} value={searchFilterObj.postedXDaysAgo} onChange={updatePostedDate} />
                            </Form.Group>

                            <Form.Group style={{ paddingLeft: "0.5vw" }}>
                                <ButtonGroup toggle >
                                    <ToggleButton
                                        type="radio"
                                        variant="primary"
                                        name={SERVICE_TYPE.ALL}
                                        checked={selectedServiceTypeKey === SERVICE_TYPE.ALL}
                                        onChange={handleSelectServiceTypeChange}
                                    > {SERVICE_TYPE.ALL_LABEL} </ToggleButton>
                                    <ToggleButton
                                        type="radio"
                                        variant="primary"
                                        name={SERVICE_TYPE.REQUEST.FILTER.KEY}
                                        checked={selectedServiceTypeKey === SERVICE_TYPE.REQUEST.FILTER.KEY}
                                        onChange={handleSelectServiceTypeChange}
                                    > {SERVICE_TYPE.REQUEST.FILTER.SHORT_LABEL} </ToggleButton>
                                    <ToggleButton
                                        type="radio"
                                        variant="primary"
                                        name={SERVICE_TYPE.OFFER.FILTER.KEY}
                                        checked={selectedServiceTypeKey === SERVICE_TYPE.OFFER.FILTER.KEY}
                                        onChange={handleSelectServiceTypeChange}
                                    > {SERVICE_TYPE.OFFER.FILTER.SHORT_LABEL} </ToggleButton>
                                </ButtonGroup>
                            </Form.Group>

                            <ButtonGroup style={{ paddingLeft: "0.5vw" }} >
                                <Button onClick={openAdvancedSearchPopup} variant="outline-primary" disabled={(selectedFilterTemplateObj == null)}>
                                    <SpinnerText loadingText="Just a min.." text="Advanced Search" />
                                </Button>
                                <Button onClick={handleSimpleSearch} variant="primary" disabled={(isSearchLoading_ReduxState)}>
                                    <SpinnerText isLoading={isSearchLoading_ReduxState} loadingText="Just a min.." text="Search" />
                                </Button>
                            </ButtonGroup>
                        </Form>
                    </Nav>
                    <Nav className="mr-auto" style={{ paddingLeft: "0.5vw", minWidth: "25vw", paddingRight: "0.5vw" }}>
                        <Row>
                            <Col style={{ minWidth: "15vw" }}>
                                <JobPostView />
                            </Col>
                            <Col style={{ minWidth: "5vw" }}>
                                {isLoggedIn_ReduxState ? <LoggedInView /> : <NotLoggedInView />}
                            </Col>
                        </Row>
                    </Nav>
                </Navbar.Collapse>

            </Navbar>

        </Container>
    );

}