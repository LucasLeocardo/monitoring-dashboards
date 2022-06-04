import * as React from 'react';
import './viewRealTimeData.css'
import { AuthContext } from '../../contexts/auth';
import * as EndPoints from '../../entities/endPoints'
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { toast } from 'react-toastify';


export default function ViewRealTimeData() {

    const { deviceId } = useParams();
    const { API, setSelectedPage, user, setUser } = React.useContext(AuthContext); 
    const [isSocketConnected, setIsSocketConnected] = React.useState(false);
    const [acelX, setAcelX] = React.useState(0);
    const [acelY, setAcelY] = React.useState(0);
    const [acelZ, setAcelZ] = React.useState(0);
    const [alphaX, setAlphaX] = React.useState(0);
    const [alphaY, setAlphaY] = React.useState(0);
    const [alphaZ, setAlphaZ] = React.useState(0);
    const [temperature, setTemperature] = React.useState(0);
    const [humidity, setHumidity] = React.useState(0);

    React.useEffect(() => {
        const socket = configureSocketConnection(deviceId);
        setSelectedPage('');

        return () => { socket.disconnect();};
    }, []);

    const configureSocketConnection = deviceId => {
        const socketHandshakeObj = {
            auth: { token: user.token },
            query: { deviceId: deviceId }
        };
        const socket = io(EndPoints.BASE_ENDPOINT, socketHandshakeObj);

        socket.on("connect", () => {
            setIsSocketConnected(true);
        });

        socket.on("connect_error", (err) => {
            if (err.message === "Invalid Token by logout!") {
                toast.warning('Your session has expired, you are being logged out!');
                setUser(null);
                localStorage.removeItem('logged-user');
                return;
            }
            socket.connect();
        });
          
        socket.on("disconnect", () => {
            setIsSocketConnected(false);
        });

        socket.on("vibration-data", (data) => {
            setAcelX(data.acelX);
            setAcelY(data.acelY);
            setAcelZ(data.acelZ);
            setAlphaX(data.alphaX);
            setAlphaY(data.alphaY);
            setAlphaZ(data.alphaZ);
        });

        socket.on("temperature-data", (data) => {
            setTemperature(data.temperature);
        });

        socket.on("humidity-data", (data) => {
            setHumidity(data.humidity);
        });

        return socket;
    }

    return (
        <div>
            <h1>View Real Time Data</h1>
        </div>
    );
}

