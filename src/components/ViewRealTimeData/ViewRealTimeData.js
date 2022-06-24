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
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import {
    InfoCardContent,
    InfoCardFooter,
    InfoCardTitle
  } from "../Info-elements/info-elements";
import VerticalInfoMeter from '../Vertical-info-meter/vertical-info-meter';
import { BsFillDropletFill } from "react-icons/bs";
import { FaTemperatureHigh } from "react-icons/fa";
import { SiSpeedtest } from "react-icons/si";
import NumberIndex from '../Number-index/number-index'
import { UNIT_CAPTION, INDEX_POSITION } from '../../entities/constants'
import Thermometer from 'react-thermometer-component'
import ReactSpeedometer from "react-d3-speedometer";
const { Index } = require("../../components/Number-index/number-index.styles");

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    height: '270px',
    color: theme.palette.text.secondary,
  }));


export default function ViewRealTimeData() {

    const { deviceId } = useParams();
    const navigate = useNavigate();
    const [isDataAvailable, setIsDataAvailable] = React.useState(false);
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
    const mounted = React.useRef();

    React.useEffect(() => {
        const socket = configureSocketConnection(deviceId);
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
        };
    }, [deviceId]);

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

    const onSelectedDeviceChange = (event, values) => {
        if (values) {
            navigate(`/view-real-time-data/${values._id}`);
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
                <Grid container spacing={4}>
                    <Grid item xs={4}>
                        <Item>
                            <InfoCardTitle>Acceleration X</InfoCardTitle>
                            <InfoCardContent marginTop="30px">
                                <ReactSpeedometer
                                    maxValue={120}
                                    minValue={-100}
                                    height={190}
                                    width={290}
                                    value={acelX}
                                    needleTransition="easeQuadIn"
                                    needleTransitionDuration={1000}
                                    needleColor="red"
                                    startColor="green"
                                    segments={10}
                                    endColor="blue"
                                />
                            </InfoCardContent>
                            <InfoCardFooter>
                                <SiSpeedtest color="#c6c6c6" size={35} />
                                <Index
                                    style={{
                                    fontSize: 24,
                                    justifyContent: "center"
                                    }}
                                >
                                    {UNIT_CAPTION["ACCELETATION"]}
                                </Index>
                            </InfoCardFooter>
                        </Item>
                    </Grid>
                    <Grid item xs={4}>
                        <Item>
                            <InfoCardTitle>Acceleration Y</InfoCardTitle>
                            <InfoCardContent marginTop="30px">
                                <ReactSpeedometer
                                    maxValue={120}
                                    minValue={-100}
                                    height={190}
                                    width={290}
                                    value={acelY}
                                    needleTransition="easeQuadIn"
                                    needleTransitionDuration={1000}
                                    needleColor="red"
                                    startColor="green"
                                    segments={10}
                                    endColor="blue"
                                />
                            </InfoCardContent>
                            <InfoCardFooter>
                                <SiSpeedtest color="#c6c6c6" size={35} />
                                <Index
                                    style={{
                                    fontSize: 24,
                                    justifyContent: "center"
                                    }}
                                >
                                    {UNIT_CAPTION["ACCELETATION"]}
                                </Index>
                            </InfoCardFooter>
                        </Item>
                    </Grid>
                    <Grid item xs={4}>
                        <Item>
                            <InfoCardTitle>Acceleration Z</InfoCardTitle>
                            <InfoCardContent marginTop="30px">
                                <ReactSpeedometer
                                    maxValue={120}
                                    minValue={-100}
                                    height={190}
                                    width={290}
                                    value={acelZ}
                                    needleTransition="easeQuadIn"
                                    needleTransitionDuration={1000}
                                    needleColor="red"
                                    startColor="green"
                                    segments={10}
                                    endColor="blue"
                                />
                            </InfoCardContent>
                            <InfoCardFooter>
                                <SiSpeedtest color="#c6c6c6" size={35} />
                                <Index
                                    style={{
                                    fontSize: 24,
                                    justifyContent: "center"
                                    }}
                                >
                                    {UNIT_CAPTION["ACCELETATION"]}
                                </Index>
                            </InfoCardFooter>
                        </Item>
                    </Grid>
                    <Grid item xs={4}>
                        <Item>
                            <InfoCardTitle>Angular acceleration X</InfoCardTitle>
                            <InfoCardContent marginTop="30px">
                            <ReactSpeedometer
                                    maxValue={120}
                                    minValue={-100}
                                    height={190}
                                    width={290}
                                    value={alphaX}
                                    needleTransition="easeQuadIn"
                                    needleTransitionDuration={1000}
                                    needleColor="gray"
                                    startColor="red"
                                    segments={10}
                                    endColor="yellow"
                                />
                            </InfoCardContent>
                            <InfoCardFooter>
                                <SiSpeedtest color="#c6c6c6" size={35} />
                                <Index
                                    style={{
                                    fontSize: 24,
                                    justifyContent: "center"
                                    }}
                                >
                                    {UNIT_CAPTION["ANGULAR ACCELETATION"]}
                                </Index>
                            </InfoCardFooter>
                        </Item>
                    </Grid>
                    <Grid item xs={4}>
                        <Item>
                            <InfoCardTitle>Angular acceleration Y</InfoCardTitle>
                            <InfoCardContent marginTop="30px">
                                <ReactSpeedometer
                                    maxValue={120}
                                    minValue={-100}
                                    height={190}
                                    width={290}
                                    value={alphaY}
                                    needleTransition="easeQuadIn"
                                    needleTransitionDuration={1000}
                                    needleColor="gray"
                                    startColor="red"
                                    segments={10}
                                    endColor="yellow"
                                />
                            </InfoCardContent>
                            <InfoCardFooter>
                                <SiSpeedtest color="#c6c6c6" size={35} />
                                <Index
                                    style={{
                                    fontSize: 24,
                                    justifyContent: "center"
                                    }}
                                >
                                    {UNIT_CAPTION["ANGULAR ACCELETATION"]}
                                </Index>
                            </InfoCardFooter>
                        </Item>
                    </Grid>
                    <Grid item xs={4}>
                        <Item>
                            <InfoCardTitle>Angular acceleration Z</InfoCardTitle>
                            <InfoCardContent marginTop="30px">
                                <ReactSpeedometer
                                    maxValue={120}
                                    minValue={-100}
                                    height={190}
                                    width={290}
                                    value={alphaZ}
                                    needleTransition="easeQuadIn"
                                    needleTransitionDuration={1000}
                                    needleColor="gray"
                                    startColor="red"
                                    segments={10}
                                    endColor="yellow"
                                />
                            </InfoCardContent>
                            <InfoCardFooter>
                                <SiSpeedtest color="#c6c6c6" size={35} />
                                <Index
                                    style={{
                                    fontSize: 24,
                                    justifyContent: "center"
                                    }}
                                >
                                    {UNIT_CAPTION["ANGULAR ACCELETATION"]}
                                </Index>
                            </InfoCardFooter>
                        </Item>
                    </Grid>
                    <Grid item xs={4}>
                        <Item>
                            <InfoCardTitle>Humidity</InfoCardTitle>
                            <InfoCardContent>
                                <NumberIndex index="%" size={48}>
                                {humidity}
                                </NumberIndex>
                                <VerticalInfoMeter value={humidity} />
                            </InfoCardContent>
                            <InfoCardFooter>
                                <BsFillDropletFill color="#c6c6c6" size={35} />
                            </InfoCardFooter>
                        </Item>
                    </Grid>
                    <Grid item xs={4}>
                        <Item>
                            <InfoCardTitle>Temperature</InfoCardTitle>
                            <InfoCardContent>
                                <NumberIndex 
                                    index={UNIT_CAPTION["CELSIUS"]} 
                                    size={48}
                                    indexPosition={INDEX_POSITION.RIGHT_TOP}
                                >
                                {temperature}
                                </NumberIndex>
                                <Thermometer
                                    theme="light"
                                    value={temperature}
                                    max="100"
                                    steps="1"
                                    format="°C"
                                    size="normal"
                                    height="180"
                                />
                            </InfoCardContent>
                            <InfoCardFooter>
                                <FaTemperatureHigh color="#c6c6c6" size={35} />
                            </InfoCardFooter>
                        </Item>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}

