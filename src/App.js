import React, { useEffect } from 'react';
import './App.css';
import { JobSearchBar } from './features/job-search-bar/JobSearchBar';
import { JobListTable } from './features/job-list-table/JobListTable';
import { SharedState } from './features/shared-vars/SharedState';
import { ToastContainer } from 'react-toastify';
import { TOAST_SHOW_DURATION_SECONDS } from './constants';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-toastify/dist/ReactToastify.css';
import { Container, Col, Row } from 'reactstrap';

function App() {

  useEffect(() => {
    document.title = "Torn City Services"
  }, [])

  return (
    <div className="App">
      <ToastContainer hideProgressBar={true} autoClose={TOAST_SHOW_DURATION_SECONDS * 1000} />
      <SharedState />
      <JobSearchBar />
      <JobListTable />
    </div>
  );
}

export default App;
