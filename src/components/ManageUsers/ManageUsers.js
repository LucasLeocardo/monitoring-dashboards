import { AuthContext } from '../../contexts/auth';
import { useState, useEffect, useContext } from 'react';
import MuiUsersTable from '../MuiTable/MuiUsersTable'
import './manageUsers.css';
import moment from 'moment';
import Loading from '../Loading/Loading';
import * as Endpoints from '../../entities/endPoints';

function ManageUsers() {

    const [loading, setLoading] = useState(true);
    const [usersList, setUsersList] = useState([]);
    const { API, setSelectedPage, user } = useContext(AuthContext); 

    useEffect(() => {
        setSelectedPage('Manage users');
        getUsers();
    });

    async function getUsers() {
        await API(Endpoints.BASE_ENDPOINT, user.token).get(Endpoints.GET_USERS)
            .then( response => {
                if (response.data) {
                    const users = response.data.map(user => {
                        user['created_at'] = moment(user.created_at).format('DD/MM/YYYY');
                        return user;
                    });
                    setUsersList(users);
                }
                setLoading(false);
            })
            .catch(error => ( error ));
    }

    if (!loading) {
        return (
            <div className='table-box'>
                <MuiUsersTable tableData={usersList}/>
            </div>
        );
    }

    return (
        <Loading/>
    );

}

export default ManageUsers;