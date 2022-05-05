import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth";
import Loading from "../components/Loading/Loading";

export default function RouteValidator({ children, isPrivate }){

    const {signed, loading} = useContext(AuthContext); 

    if(loading) {
        return(
            <Loading/>
        );
    }

    if(!signed && isPrivate) {
        return <Navigate to="/"/>
    }
    
    if(signed && !isPrivate) {
        return <Navigate to="/dashboard"/>
    }

    return children;
}