import * as React from 'react';
import './viewRealTimeData.css'
import { AuthContext } from '../../contexts/auth';
import * as EndPoints from '../../entities/endPoints'
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import Loading from '../Loading/Loading';
import * as ResponseStatus from '../../entities/responseStatus';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { UNIT_CAPTION } from '../../entities/constants'
import GaugeChartLinearAcceleration from '../GaugeChartLinearAcceleration/GaugeChartLinearAcceleration';
import GaugeChartAngularAcceleration from '../GaugeChartAngularAcceleration/GaugeChartAngularAcceleration';
import GaugeChartHumidity from '../GaugeChartHumidity/GaugeChartHumidity';
import GaugeChartTemperature from '../GaugeChartTemperature/GaugeChartTemperature';
import GaugeChartPressure from '../GaugeChartPressure/GaugeChartPressure';
import GaugeChartRainfallLevel from '../GaugeChartRainFallLevel/GaugeChartRainFallLevel';
import * as MeasurementTypes from '../../entities/measurementTypes';

export default function ViewRealTimeData() {

    const { deviceId } = useParams();
    const navigate = useNavigate();
    const [isDataAvailable, setIsDataAvailable] = React.useState(false);
    const [isMeasurementTypesAvailable, setIsMeasurementTypesAvailable] = React.useState(false);
    const [deviceList, setDeviceList] =  React.useState([]);
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
    const [rainfallLevel, setRainfallLevel] = React.useState(0);
    const [poroPressure, setPoroPressure] = React.useState(0);
    const [deviceMeasurementTypes, setDeviceMeasurementTypes] =  React.useState([]);
    const mounted = React.useRef();

    React.useEffect(() => {
        const socket = configureSocketConnection(deviceId);
        getDeviceMeasurementTypesAysnc();
        if (!mounted.current) { 
            getActiveDevicesAsync();
            setSelectedPage('');
            mounted.current = true;
        } 
        return () => { 
            socket.disconnect();
            setAcelX(0);
            setAcelY(0);
            setAcelZ(0);
            setAlphaX(0);
            setAlphaY(0);
            setAlphaZ(0);
            setTemperature(0);
            setHumidity(0);
            setRainfallLevel(0);
            setPoroPressure(0);
        };
    }, [deviceId]);

    const getDeviceMeasurementTypesAysnc = async () => {
        await API(EndPoints.BASE_ENDPOINT, user.token).get(`${EndPoints.GET_DEVICE_MEASUREMENT_TYPES}?deviceId=${deviceId}`)
            .then( response => {
                if (response.status === ResponseStatus.SUCCESS) {
                    setDeviceMeasurementTypes(response.data);
                    setIsMeasurementTypesAvailable(true);
                }
            })
            .catch(error => ( error ));
    }

    const getActiveDevicesAsync = async () => {
        await API(EndPoints.BASE_ENDPOINT, user.token).get(EndPoints.GET_ACTIVE_DEVICES)
            .then( response => {
                if (response.status === ResponseStatus.SUCCESS) {
                    setDeviceList(response.data);
                    setIsDataAvailable(true);
                }
            })
            .catch(error => ( error ));
    }

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

        socket.on("linear-acceleration-data", (data) => {
            setAcelX(data.acelX);
            setAcelY(data.acelY);
            setAcelZ(data.acelZ);
        });

        socket.on("angular-acceleration-data", (data) => {
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

        socket.on("rainfall-level-data", (data) => {
            setRainfallLevel(data.rainfallLevel);
        });

        socket.on("poro-pressure-data", (data) => {
            setPoroPressure(data.poroPressure);
        });

        return socket;
    }

    const onSelectedDeviceChange = (event, values) => {
        if (values) {
            navigate(`/view-real-time-data/${values._id}`);
            setIsMeasurementTypesAvailable(false);
        }
    }

    const getDefaultValue = () => {
        const defaultDevice = deviceList.find(device => device._id === deviceId);
        return defaultDevice
    }

    if (!isDataAvailable) {
        return (
            <Loading/>
        );
    }

    return (
        <div>
            <Stack spacing={1} sx={{ width: 600 }}>
                <Autocomplete
                    options={deviceList}
                    getOptionLabel={option => option.name}
                    defaultValue={getDefaultValue}
                    onChange={onSelectedDeviceChange}
                    id="auto-complete"
                    autoComplete
                    includeInputInList
                    renderInput={(params) => ( 
                        <TextField 
                            {...params}  
                            label="Select a Device" 
                            variant="standard" 
                            color="success"
                        /> 
                    )}
                />
            </Stack>
            <Box sx={{ flexGrow: 1, marginTop: '40px', paddingBottom: '40px' }}>
                {!isMeasurementTypesAvailable? <Loading hasMarginTop/> :  
                (<Grid container spacing={4}>
                    {deviceMeasurementTypes.includes(MeasurementTypes.LINEAR_ACCELERATION) && (
                    <React.Fragment>
                        <Grid item xs={4}>
                            <GaugeChartLinearAcceleration
                                cardTitle="Acceleration X"
                                cardValue={acelX}
                                cardUnit={UNIT_CAPTION["ACCELETATION"]}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <GaugeChartLinearAcceleration
                                cardTitle="Acceleration Y"
                                cardValue={acelY}
                                cardUnit={UNIT_CAPTION["ACCELETATION"]}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <GaugeChartLinearAcceleration
                                cardTitle="Acceleration Z"
                                cardValue={acelZ}
                                cardUnit={UNIT_CAPTION["ACCELETATION"]}
                            />
                        </Grid>
                    </React.Fragment>
                    )}
                    {deviceMeasurementTypes.includes(MeasurementTypes.ANGULAR_ACCELERATION) &&
                    (<React.Fragment>
                        <Grid item xs={4}>
                            <GaugeChartAngularAcceleration
                                cardTitle="Angular acceleration X"
                                cardValue={alphaX}
                                cardUnit={UNIT_CAPTION["ANGULAR ACCELETATION"]}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <GaugeChartAngularAcceleration
                                cardTitle="Angular acceleration Y"
                                cardValue={alphaY}
                                cardUnit={UNIT_CAPTION["ANGULAR ACCELETATION"]}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <GaugeChartAngularAcceleration
                                cardTitle="Angular acceleration Z"
                                cardValue={alphaZ}
                                cardUnit={UNIT_CAPTION["ANGULAR ACCELETATION"]}
                            />
                        </Grid>
                    </React.Fragment>
                    )}
                    {deviceMeasurementTypes.includes(MeasurementTypes.HUMIDITY) &&
                    (<React.Fragment>
                        <Grid item xs={4}>
                            <GaugeChartHumidity
                                cardValue={humidity}
                                cardUnit="%"
                            />
                        </Grid>
                    </React.Fragment>
                    )}
                    {deviceMeasurementTypes.includes(MeasurementTypes.TEMPERATURE) &&
                    (<React.Fragment>
                        <Grid item xs={4}>
                            <GaugeChartTemperature
                                cardValue={temperature}
                                cardUnit={UNIT_CAPTION["CELSIUS"]} 
                            />
                        </Grid>
                    </React.Fragment>
                    )}
                    {deviceMeasurementTypes.includes(MeasurementTypes.PORO_PRESSURE) &&
                    (<React.Fragment>
                        <Grid item xs={4}>
                            <GaugeChartPressure
                                cardValue={poroPressure}
                                cardUnit="Pa"
                            />
                        </Grid>
                    </React.Fragment>
                    )}
                    {deviceMeasurementTypes.includes(MeasurementTypes.RAINFALL_LEVEL) &&
                    (<React.Fragment>
                        <Grid item xs={4}>
                            <GaugeChartRainfallLevel
                                cardValue={rainfallLevel}
                                cardUnit="mm"
                            />
                        </Grid>
                    </React.Fragment>
                    )}
                </Grid>)}
            </Box>
        </div>
    );
}

