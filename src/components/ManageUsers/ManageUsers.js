import { useState } from 'react';
import { AuthContext } from '../../contexts/auth';
import * as React from 'react';
import MuiUsersTable from '../MuiTable/MuiUsersTable'
import './manageUsers.css';
import moment from 'moment';

function createData(id, name, email, phoneNumber, created_at) {
  return {
    id,
    name,
    email,
    phoneNumber,
    created_at,
  };
}

const tableData = [
    createData(1, 'Lucas Leocardo', 'Lucasleocardo.go@gmail.com', '(21) 97997-8924', moment().format("MMM Do YY"))
    // createData(2, 'Lucas Leocardo 2', 'Lucasleocardo2.go@gmail.com', '(36) 97997-8924', moment().format("MMM Do YY")),
    // createData(3, 'Lucas Leocardo 3', 'Lucasleocardo3.go@gmail.com', '(32) 97997-8924', moment().format("MMM Do YY")),
    // createData(4, 'Lucas Leocardo 4', 'Lucasleocardo4.go@gmail.com', '(31) 97997-8924', moment().format("MMM Do YY"))
];

function ManageUsers() {

    //const [open, setOpen] = React.useState(true);
    const { API, setSelectedPage, user } = React.useContext(AuthContext); 

    React.useEffect(() => {
        setSelectedPage('Manage users');
    }, []);


    return (
        <div className='table-box'>
            <MuiUsersTable tableData={tableData}/>
        </div>
    );

}

export default ManageUsers;