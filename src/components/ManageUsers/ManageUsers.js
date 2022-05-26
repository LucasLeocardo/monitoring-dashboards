import { AuthContext } from '../../contexts/auth';
import { useState, useEffect, useContext } from 'react';
import MuiUsersTable from '../MuiTable/MuiUsersTable'
import './manageUsers.css';
import moment from 'moment';
import Loading from '../Loading/Loading';
import * as Endpoints from '../../entities/endPoints';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal'
import { toast } from 'react-toastify';
import * as ResponseStatus from '../../entities/responseStatus';

const modalTitle = 'Do you really want to remove these users?';
const modalTextContent = 'By clicking confirm, the selected users will be permanently removed from the platform and will no longer be able to access the landslide monitoring system.';

const notAllowedModalTitle = 'You are not allowed to delete users!';
const notAllowedModalTextContent = 'You are not an admin user to delete users. Please contact an admin user to perform this task.';



function ManageUsers() {

    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [usersList, setUsersList] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const { API, setSelectedPage, user } = useContext(AuthContext); 

    useEffect(() => {
        setSelectedPage('Manage users');
        getUsers();
    }, []);

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

    async function removeUsers() {
        await API(Endpoints.BASE_ENDPOINT, user.token).post(Endpoints.DELETE_USERS, selectedUsers)
            .then( response => {
                if (response.status === ResponseStatus.SUCCESS) {
                    const newUsersList = usersList.filter(user => !selectedUsers.includes(user._id));
                    setUsersList(newUsersList);
                    setSelectedUsers([]);
                    toast.success('Users successfully deleted!');
                }
                setLoading(false);
            })
            .catch(error => ( error ));
    }

    const onDeleteUsersClick = () => {
        setIsDeleteModalOpen(true);
    }

    const handleModalCancelClick = () => {
        setIsDeleteModalOpen(false);
    }

    const handleModalConfirmClick = () => {
        if (!user.isAdmin) {
            setIsDeleteModalOpen(false);
            return;
        }
        toast.info('Deleting selected users...');
        setIsDeleteModalOpen(false);
        setLoading(true);
        removeUsers();
    }

    if (!loading) {
        return (
            <div className='table-box'>
                <MuiUsersTable tableData={usersList} onDeleteUsersClick={onDeleteUsersClick} setSelectedUsers={setSelectedUsers}/>
                <ConfirmationModal
                    modalTitle={user.isAdmin ? modalTitle : notAllowedModalTitle}
                    modalTextContent={user.isAdmin ? modalTextContent : notAllowedModalTextContent}
                    isOpen={isDeleteModalOpen}
                    handleConfirmClick={handleModalConfirmClick}
                    handleCancelClick={handleModalCancelClick}
                />
            </div>
        );
    }

    return (
        <Loading/>
    );

}

export default ManageUsers;