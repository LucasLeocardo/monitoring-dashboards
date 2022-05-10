import { useState } from 'react';
import { AuthContext } from '../../contexts/auth';
import * as React from 'react';

function MainDashboard() {

    //const [open, setOpen] = React.useState(true);
    const { API, setSelectedPage, user } = React.useContext(AuthContext); 
    setSelectedPage('Main Dashboard');


    return (
        <div>
            <h1>Main Dashboard</h1>
        </div>
    );

}

export default MainDashboard;