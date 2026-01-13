import React from 'react';
import { Calendar } from 'lucide-react';

const DateFilter = ({ dateFilter, setDateFilter, DATE_FILTERS }) => {
    const filterLabels = {
        today: 'Today',
        week: 'This Week',
        month: 'This Month',
        year: 'This Year',
        all: 'All Time'
    };

    return (
        <div className="date-filter">
            <Calendar size={16} className="date-filter-icon" />
            {DATE_FILTERS.map(filter => (
                <button
                    key={filter}
                    className={`date-filter-btn ${dateFilter === filter ? 'active' : ''}`}
                    onClick={() => setDateFilter(filter)}
                >
                    {filterLabels[filter]}
                </button>
            ))}
        </div>
    );
};

export default DateFilter;
