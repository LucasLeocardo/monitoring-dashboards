import { Navigate } from "react-router-dom";

export default function RouteValidator({ children, isPrivate }){

    const isLoading = false;
    const signed = false;

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