import * as React from 'react';
import './viewHistoricalData.css'
import { AuthContext } from '../../contexts/auth';


export default function ViewHistoricalData() {

    const { API, setSelectedPage, user } = React.useContext(AuthContext); 

    React.useEffect(() => {
        setSelectedPage('');
    }, []);

    return (
        <div>
            <h1>View Historical Data</h1>
        </div>
    );
}
