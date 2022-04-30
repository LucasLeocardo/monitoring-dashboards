import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth";

export default function RouteValidator({ children, isPrivate }){

    const isLoading = false;
    const {signed, loading} = useContext(AuthContext); 

    if(isLoading) {
        return(
            <div></div>
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