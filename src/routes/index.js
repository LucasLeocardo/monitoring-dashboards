import { Routes, Route, Navigate } from 'react-router-dom';
import MuiSignIn from '../pages/MuiSignIn';
import Dashboard from '../pages/Dashboard';
import { useContext } from "react";
import { AuthContext } from "../contexts/auth";
import ManageUsers from '../components/ManageUsers/ManageUsers';
import ManageDevices from '../components/ManageDevices/ManageDevices';
import MainDashboard from '../components/MainDashboard/MainDashboard';
import CreateUser from '../components/CreateUser/CreateUser';


export default function RoutesCreator(){

    const { signed, loadingAuth } = useContext(AuthContext); 

    if (signed) {
        return(
            <Dashboard>
                <Routes>
                    <Route exact path="/" element={<MainDashboard/>}/>
                    <Route exact path="/manage-users" element={<ManageUsers/>}/>
                    <Route exact path="/manage-devices" element={<ManageDevices/>}/>
                    <Route exact path="/manage-users/create-user" element={<CreateUser/>}/>
                </Routes>
            </Dashboard>
        );
    }
    else if (!signed && !loadingAuth) {
        return (
            <Routes>
                <Route exact path="/" element={<MuiSignIn/>} />
                <Route exact path="/*" element={<Navigate to="/"/>} />
            </Routes>
        );
    }

}