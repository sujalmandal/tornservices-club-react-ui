import React ,{useEffect} from 'react';
import './App.css';
import { JobSearchBar } from './features/job-search-bar/JobSearchBar';
import { JobListTable } from './features/job-list-table/JobListTable';
import { SharedState } from './features/shared-vars/SharedState';
import { ToastContainer, toast } from 'react-toastify';

import 'bootstrap/dist/css/bootstrap.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  useEffect(() => {
    document.title = "Torn City Services"
  }, [])

  return (
    <div className="App">
        <ToastContainer hideProgressBar={true} autoClose={3000}/>
        <SharedState/>
        <JobSearchBar/>
        <JobListTable/>
    </div>
  );
}

export default App;
