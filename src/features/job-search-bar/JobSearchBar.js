import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    searchJobs,
    selectGlobalJobFilters
} from './jobSearchBarSlice';
import styles from './JobSearchBar.module.css';

export function JobSearchBar() {

    const dispatch = useDispatch();

    /* redux, global states */
    const globalJobFilters = useSelector(selectGlobalJobFilters);

    /* local, feature-level states */
    const [jobFilters, setJobFilters] = useState({
        jobType: "BOUNTY",
        amount: 0
    });

    return (
        <div>
            <div>
                <div>
                    <span>Job Type</span>
                </div>
                <div>
                    <select id="jobType" defaultValue={jobFilters.jobType}
                        onChange={(e) => {
                            setJobFilters({
                                ...jobFilters,
                                jobType: e.target.value
                            })
                        }}>
                        <option value="BOUNTY">Bounty</option>
                        <option value="HOSPITALIZE">Hospitalize</option>
                        <option value="MUG">Mug</option>
                        <option value="BOUNTY_REVEAL">Bounty Reveal</option>
                    </select>
                </div>
            </div>
            <div>
                <div>
                    <span>Amount</span>
                </div>
                <div>
                    <input type="number" defaultValue={jobFilters.amount}
                        onChange={(e) => {
                            setJobFilters({
                                ...jobFilters,
                                amount: e.target.value
                            })
                        }} />
                </div>
            </div>
            <div><button onClick={() => { dispatch(searchJobs(jobFilters))}}>Search Jobs</button></div>
        </div>
    );

}