import { AuthContext } from '../../contexts/auth';
import * as React from 'react';
import './mainDashboard.css'
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const home = [-22.752996506534526, -43.47208904073012]

function MainDashboard() {

    //const [open, setOpen] = React.useState(true);
    const { setSelectedPage } = React.useContext(AuthContext); 

    React.useEffect(() => {
        setSelectedPage('Main Dashboard');
    }, []);


    return (
        <div className='dashboardContainer'>
            <MapContainer center={home} zoom={10} scrollWheelZoom={false} style={{height: '100%', width: '100%'}}>
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
        </div>
    );

}

export default MainDashboard;