import React ,{useEffect} from 'react';
import './App.css';
import { JobSearchBar } from './features/job-search-bar/JobSearchBar';
import { JobListTable } from './features/job-list-table/JobListTable';
import { SharedCache } from './features/shared-vars/SharedCache';
import 'bootstrap/dist/css/bootstrap.css';

function App() {

  useEffect(() => {
    document.title = "Torn City Services"
  }, [])

  return (
    <div className="App">
        <SharedCache/>
        <JobSearchBar/>
        <JobListTable/>
    </div>
  );
}

export default App;
