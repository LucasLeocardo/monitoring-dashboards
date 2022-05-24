import { AuthContext } from '../../contexts/auth';
import * as React from 'react';
import './mainDashboard.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import Loading from '../Loading/Loading';
import * as Endpoints from '../../entities/endPoints';
import * as ResponseStatus from '../../entities/responseStatus';

const makerIcon = new L.icon({
    iconUrl: require('../../assets/iot-signal.png'),
    iconSize: [45, 55],
    iconAnchor: [17, 46],
    popupAnchor: [0, -46]
});

function MainDashboard() {

    const [isDataAvailable, setIsDataAvailable] = React.useState(false);
    const [isBrowserLocationEnabled, setIsBrowserLocationEnabled] = React.useState(null);
    const [mapData, setMapData] = React.useState([]);
    const [userLocation, setUserLocation] = React.useState(null);
    const { API, setSelectedPage, user } = React.useContext(AuthContext); 

    React.useEffect(() => {

        getUsersLocation();
        getActiveDevicesAsync();
        setSelectedPage('Main Dashboard');
    }, []);

    const getUsersLocation = () => {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                setIsBrowserLocationEnabled(true);
                const coords = position.coords;
                setUserLocation([coords.latitude, coords.longitude]);
            },
            function(error) {
                setIsBrowserLocationEnabled(false);
            }
        );
    }

    const getActiveDevicesAsync = async () => {
        await API(Endpoints.BASE_ENDPOINT, user.token).get(Endpoints.GET_ACTIVE_DEVICES)
            .then( response => {
                if (response.status === ResponseStatus.SUCCESS) {
                    setMapData(response.data);
                    setIsDataAvailable(true);
                }
            })
            .catch(error => ( error ));
    }

    if (!isDataAvailable || setIsBrowserLocationEnabled === null) {
        return (
            <Loading/>
        );
    }


    return (
        <div className='dashboardContainer'>
            <MapContainer center={userLocation} zoom={10} scrollWheelZoom={false} style={{height: '100%', width: '100%'}}>
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={userLocation}>
                </Marker>
                {mapData.map(data => {
                    return(<Marker 
                    position={[data.latitude, data.longitude]}
                    icon={makerIcon}
                    key={data._id}
                    />)
                })}
            </MapContainer>
        </div>
    );

}

export default MainDashboard;