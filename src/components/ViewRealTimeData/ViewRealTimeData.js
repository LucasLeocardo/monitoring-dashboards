import * as React from 'react';
import './viewRealTimeData.css'
import { AuthContext } from '../../contexts/auth';


export default function ViewRealTimeData() {

    const { API, setSelectedPage, user } = React.useContext(AuthContext); 

    React.useEffect(() => {
        setSelectedPage('');
    }, []);

    return (
        <div>
            <h1>View Real Time Data</h1>
        </div>
    );
}

