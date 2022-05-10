import { useState } from 'react';
import { AuthContext } from '../../contexts/auth';
import * as React from 'react';

function ManageDevices() {

    //const [open, setOpen] = React.useState(true);
    const { API, setSelectedPage, user } = React.useContext(AuthContext); 
    setSelectedPage('Manage devices');


    return (
        <div>
            <h1>ManageDevices</h1>
        </div>
    );

}

export default ManageDevices;