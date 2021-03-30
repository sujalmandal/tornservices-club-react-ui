import React from 'react';
import './App.css';
import { JobSearchBar } from './features/job-search-bar/JobSearchBar';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <JobSearchBar />
      </header>
    </div>
  );
}

export default App;
