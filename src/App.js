import React ,{useEffect} from 'react';
import './App.css';
import { JobSearchBar } from './features/job-search-bar/JobSearchBar';
import { JobListTable } from './features/job-list-table/JobListTable';
import 'bootstrap/dist/css/bootstrap.css';

function App() {

  useEffect(() => {
    document.title = "Torn City Services"
  }, [])

  return (
    <div className="App">
        <JobSearchBar/>
        <JobListTable/>
    </div>
  );
}

export default App;
