import { useState } from 'react';
import { AuthContext } from '../../contexts/auth';
import * as React from 'react';

function ManageUsers() {

    //const [open, setOpen] = React.useState(true);
    const { API, setSelectedPage, user } = React.useContext(AuthContext); 
    setSelectedPage('Manage users');


    return (
        <div>
            <h1>Manage Users</h1>
        </div>
    );

}

export default ManageUsers;