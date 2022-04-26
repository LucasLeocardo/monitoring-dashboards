import { Routes, Route } from 'react-router-dom';
import RouteValidator from './RouteValidator';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';


export default function RoutesCreator(){
    return(
        <Routes>
            <Route exact path="/" element={<RouteValidator><SignIn/></RouteValidator>}/>
            <Route exact path="/register" element={<RouteValidator><SignUp/></RouteValidator>}/>
            <Route exact path="/dashboard" element={<RouteValidator isPrivate={true}><Dashboard/></RouteValidator>}/>
        </Routes>
    );
}