import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCalendar, faFile, faUser, faGear } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <FontAwesomeIcon icon={faHome} />
                <h1>Do</h1>
            </div>
        </div>
    );
};

