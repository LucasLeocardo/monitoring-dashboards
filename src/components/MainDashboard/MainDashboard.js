import { AuthContext } from '../../contexts/auth';
import * as React from 'react';
import './mainDashboard.css'
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet'
import L from 'leaflet';
import Loading from '../Loading/Loading';
import * as Endpoints from '../../entities/endPoints';
import * as ResponseStatus from '../../entities/responseStatus';
import OptionsConfirmationModal from '../ConfirmationModal/OptionsConfirmationModal'


const defaultMapCenter = [-22.90667664594464, -43.1807230722308];

const makerIcon = new L.icon({
    iconUrl: require('../../assets/iot-signal.png'),
    iconSize: [45, 55],
    iconAnchor: [17, 46],
    popupAnchor: [0, -46]
});

function MainDashboard() {

    const [isDataAvailable, setIsDataAvailable] = React.useState(false);
    const [selectedDevice, setSelectedDevice] = React.useState(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
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
                const coords = position.coords;
                setUserLocation([coords.latitude, coords.longitude]);
                setIsBrowserLocationEnabled(true);
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

    const onDeviceMapClick = device => {
        setSelectedDevice(device);
        setIsModalOpen(true);
    }

    const handleModalCancelClick = () => {
        setIsModalOpen(false);
    }

    if (!isDataAvailable || isBrowserLocationEnabled === null) {
        return (
            <Loading/>
        );
    }


    return (
        <div className='dashboardContainer'>
            <MapContainer center={isBrowserLocationEnabled ? userLocation : defaultMapCenter} zoom={11} scrollWheelZoom={true} style={{height: '100%', width: '100%'}}>
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {userLocation !==null && 
                    <Marker position={userLocation}>
                         <Tooltip sticky>This is your current location!</Tooltip>
                    </Marker>
                }
                {mapData.map(data => {
                    return(
                        <Marker 
                            position={[data.latitude, data.longitude]}
                            icon={makerIcon}
                            key={data._id}
                            eventHandlers={{ click: () => onDeviceMapClick(data) }}
                        > 
                            <Tooltip sticky>Device name: {data.name}</Tooltip>
                        </Marker>
                    )
                })}
            </MapContainer>
            <OptionsConfirmationModal
                    selectedDevice={selectedDevice}
                    isOpen={isModalOpen}
                    handleCancelCallback={handleModalCancelClick}
            />
        </div>
    );

}

export default MainDashboard;