import { Routes, Route, Navigate } from 'react-router-dom';
import MuiSignIn from '../pages/MuiSignIn';
import Dashboard from '../pages/Dashboard';
import { useContext } from "react";
import { AuthContext } from "../contexts/auth";


export default function RoutesCreator(){

    const { signed } = useContext(AuthContext); 

    if (signed) {
        return(
            <Dashboard>
                <Routes>
                    <Route exact path="/"/>
                </Routes>
            </Dashboard>
        );
    }
    else {
        return (
            <Routes>
                <Route exact path="/" element={<MuiSignIn/>} />
                <Route exact path="/*" element={<Navigate to="/"/>} />
            </Routes>
        );
    }

}