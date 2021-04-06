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
    <div className="App" style={{background: "#2d405f"}}>
      <ToastContainer hideProgressBar={true} autoClose={TOAST_SHOW_DURATION_SECONDS * 1000}/>
      <SharedState/>
      <Container  fluid>
        <Row style={{minWidth:"100vw","minHeight":"20vh"}}>
          <JobSearchBar/>
        </Row>
        <Row style={{minWidth:"100vw"}}>
          <JobListTable/>
        </Row>
        <Row>

        </Row>
      </Container>
    </div>
  );
}

export default App;
