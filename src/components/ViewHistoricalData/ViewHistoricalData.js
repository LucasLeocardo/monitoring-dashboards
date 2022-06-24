import * as React from 'react';
import './viewHistoricalData.css'
import { AuthContext } from '../../contexts/auth';
import { useNavigate } from 'react-router-dom';
import * as ResponseStatus from '../../entities/responseStatus';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import * as EndPoints from '../../entities/endPoints'
import Loading from '../Loading/Loading';
import CardLoading from '../CardLoading/CardLoading';
import TextField from '@mui/material/TextField';
import { useParams } from "react-router-dom";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Line } from 'react-chartjs-2';
import {
    NewInfoCardContent,
    InfoCardTitle
  } from "../Info-elements/info-elements";
import 'chartjs-adapter-date-fns';
import {
    Chart as ChartJS,
    registerables
  } from "chart.js";

ChartJS.register(
...registerables
);

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
    height: '600px',
    color: theme.palette.text.secondary,
  }));

export default function ViewHistoricalData() {

    const { deviceId } = useParams();
    const { API, setSelectedPage, user } = React.useContext(AuthContext); 
    const navigate = useNavigate();
    const [isDeviceListAvailable, setIsDeviceListAvailable] = React.useState(false);
    const [deviceList, setDeviceList] =  React.useState([]);
    const [vibrationDataList, setVibrationDataList] =  React.useState([]);
    const [isVibrationDataAvailable, setIsVibrationDataAvailable] = React.useState(false);
    const [temperatureDataList, setTemperatureDataList] =  React.useState([]);
    const [isTemperatureDataAvailable, setIsTemperatureDataAvailable] = React.useState(false);
    const [humidityDataList, setHumidityDataList] =  React.useState([]);
    const [isHumidityDataAvailable, setIsHumidityDataAvailable] = React.useState(false);
    const mounted = React.useRef();
    const [startDate, setStartDate] = React.useState(new Date());
    const [endDate, setEndDate] = React.useState(new Date());

    React.useEffect(() => {
        if (!mounted.current) { 
            startDate.setMonth(startDate.getMonth() - 1);
            getActiveDevicesAsync();
            setSelectedPage('');
            mounted.current = true;
        } 
        getDaillyMeasurements();
    }, [deviceId, startDate, endDate]);

    const getActiveDevicesAsync = async () => {
        await API(EndPoints.BASE_ENDPOINT, user.token).get(EndPoints.GET_ACTIVE_DEVICES)
            .then( response => {
                if (response.status === ResponseStatus.SUCCESS) {
                    setDeviceList(response.data);
                    setIsDeviceListAvailable(true);
                }
            })
            .catch(error => ( error ));
    }

    const getDaillyMeasurements = () => {
        const requestStartDate = startDate.toDateString();
        const requestEndDate = endDate.toDateString();
        const requestBody = {deviceId, startDate: requestStartDate, endDate: requestEndDate};
        getDaillyVibrationDataAsync(requestBody);
        getDaillyTemperatureDataAsync(requestBody);
        getDaillyHumidityDataAsync(requestBody);
    }

    const getDaillyVibrationDataAsync = async (requestBody) => {
        setIsVibrationDataAvailable(false);
        await API(EndPoints.BASE_ENDPOINT, user.token).post(EndPoints.GET_DAILLY_VIBRATION_DATA, requestBody)
            .then( response => {
                if (response.status === ResponseStatus.SUCCESS) {
                    setVibrationDataList(response.data);
                    setIsVibrationDataAvailable(true);
                }
            })
            .catch(error => ( error ));
    }

    const getDaillyTemperatureDataAsync = async (requestBody) => {
        setIsTemperatureDataAvailable(false);
        await API(EndPoints.BASE_ENDPOINT, user.token).post(EndPoints.GET_DAILLY_TEMPERATURE_DATA, requestBody)
            .then( response => {
                if (response.status === ResponseStatus.SUCCESS) {
                    setTemperatureDataList(response.data);
                    setIsTemperatureDataAvailable(true);
                }
            })
            .catch(error => ( error ));
    }

    const getDaillyHumidityDataAsync = async (requestBody) => {
        setIsHumidityDataAvailable(false);
        await API(EndPoints.BASE_ENDPOINT, user.token).post(EndPoints.GET_DAILLY_HUMIDITY_DATA, requestBody)
            .then( response => {
                if (response.status === ResponseStatus.SUCCESS) {
                    setHumidityDataList(response.data);
                    setIsHumidityDataAvailable(true);
                }
            })
            .catch(error => ( error ));
    }


    const onSelectedDeviceChange = (event, values) => {
        if (values) {
            navigate(`/view-historical-data/${values._id}`);
        }
    }

    const onStarDateChange = (newDate) => {
        setStartDate(newDate);
    }

    const onEndDateChange = (newDate) => {
        setEndDate(newDate);
    }

    const getDefaultValue = () => {
        const defaultDevice = deviceList.find(device => device._id === deviceId);
        return defaultDevice
    }

    if (!isDeviceListAvailable) {
        return (
            <Loading/>
        );
    }

    return (
        <div>
            <Stack spacing={1} sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Stack spacing={3} sx={{ width: '600px'}}>
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
                <Stack spacing={3} sx={{ width: '600px', display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                            label="Start date"
                            value={startDate}
                            minDate={new Date('2022-01-01')}
                            onChange={(newValue) => {
                                onStarDateChange(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <DesktopDatePicker
                            label="End date"
                            value={endDate}
                            minDate={new Date('2022-01-01')}
                            onChange={(newValue) => {
                                onEndDateChange(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Stack>
            </Stack>
            <Box sx={{ flexGrow: 1, marginTop: '40px', paddingBottom: '40px' }}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Item>
                            <InfoCardTitle>Linear acceleration (x, y, z)</InfoCardTitle>
                            {!isVibrationDataAvailable? <CardLoading/> : (
                            <NewInfoCardContent marginTop="30px">
                                <Line
                                    data={{
                                        datasets: [{
                                            label: 'Acceleration X',
                                            data: vibrationDataList,
                                            parsing: {
                                                yAxisKey: 'acelX',
                                                xAxisKey: '_id'
                                            },
                                            backgroundColor: 'red',
                                            borderColor: 'red'
                                        }, {
                                            label: 'Acceleration Y',
                                            data: vibrationDataList,
                                            parsing: {
                                                yAxisKey: 'acelY',
                                                xAxisKey: '_id'
                                            },
                                            backgroundColor: 'blue',
                                            borderColor: 'blue'
                                        }, {
                                            label: 'Acceleration Z',
                                            data: vibrationDataList,
                                            parsing: {
                                                yAxisKey: 'acelZ',
                                                xAxisKey: '_id'
                                            },
                                            backgroundColor: 'green',
                                            borderColor: 'green'
                                        }]
                                    }}
                                    options={{
                                        maintainAspectRatio: false,
                                        scales: {
                                            x: {
                                                type: 'time',
                                                time: {
                                                    unit: 'day'
                                                }
                                            },
                                            y: {
                                                ticks: {
                                                    callback: function(value, index, ticks) {
                                                        return value + ' m/s²';
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                    height="100%"
                                    width="100%"
                                />
                            </NewInfoCardContent>)}
                        </Item>
                    </Grid>
                    <Grid item xs={12}>
                        <Item>
                            <InfoCardTitle>Angular acceleration (x, y, z)</InfoCardTitle>
                            {!isVibrationDataAvailable? <CardLoading/> : (
                            <NewInfoCardContent marginTop="30px">
                                <Line
                                    data={{
                                        datasets: [{
                                            label: 'Angular acceleration X',
                                            data: vibrationDataList,
                                            parsing: {
                                                yAxisKey: 'alphaX',
                                                xAxisKey: '_id'
                                            },
                                            backgroundColor: 'red',
                                            borderColor: 'red'
                                        }, {
                                            label: 'Angular acceleration Y',
                                            data: vibrationDataList,
                                            parsing: {
                                                yAxisKey: 'alphaY',
                                                xAxisKey: '_id'
                                            },
                                            backgroundColor: 'blue',
                                            borderColor: 'blue'
                                        }, {
                                            label: 'Angular acceleration Z',
                                            data: vibrationDataList,
                                            parsing: {
                                                yAxisKey: 'alphaZ',
                                                xAxisKey: '_id'
                                            },
                                            backgroundColor: 'green',
                                            borderColor: 'green'
                                        }]
                                    }}
                                    options={{
                                        maintainAspectRatio: false,
                                        scales: {
                                            x: {
                                                type: 'time',
                                                time: {
                                                    unit: 'day'
                                                }
                                            },
                                            y: {
                                                ticks: {
                                                    callback: function(value, index, ticks) {
                                                        return value + 'rad/s²';
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                    height="100%"
                                    width="100%"
                                />
                            </NewInfoCardContent>)}
                        </Item>
                    </Grid>
                    <Grid item xs={12}>
                        <Item>
                            <InfoCardTitle>Humidity</InfoCardTitle>
                            {!isHumidityDataAvailable? <CardLoading/> : (
                            <NewInfoCardContent marginTop="30px">
                                <Line
                                    data={{
                                        datasets: [{
                                            label: 'Soil humidity',
                                            data: humidityDataList,
                                            parsing: {
                                                yAxisKey: 'humidity',
                                                xAxisKey: '_id'
                                            },
                                            backgroundColor: 'blue',
                                            borderColor: 'blue'
                                        }]
                                    }}
                                    options={{
                                        maintainAspectRatio: false,
                                        scales: {
                                            x: {
                                                type: 'time',
                                                time: {
                                                    unit: 'day'
                                                }
                                            },
                                            y: {
                                                ticks: {
                                                    callback: function(value, index, ticks) {
                                                        return value + ' %';
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                    height="100%"
                                    width="100%"
                                />
                            </NewInfoCardContent>)}
                        </Item>
                    </Grid>
                    <Grid item xs={12}>
                        <Item>
                            <InfoCardTitle>Temperature</InfoCardTitle>
                            {!isTemperatureDataAvailable? <CardLoading/> : (
                            <NewInfoCardContent marginTop="30px">
                                <Line
                                    data={{
                                        datasets: [{
                                            label: 'Soil temperature',
                                            data: temperatureDataList,
                                            parsing: {
                                                yAxisKey: 'temperature',
                                                xAxisKey: '_id'
                                            },
                                            backgroundColor: 'red',
                                            borderColor: 'red'
                                        }]
                                    }}
                                    options={{
                                        maintainAspectRatio: false,
                                        scales: {
                                            x: {
                                                type: 'time',
                                                time: {
                                                    unit: 'day'
                                                }
                                            },
                                            y: {
                                                ticks: {
                                                    callback: function(value, index, ticks) {
                                                        return value + ' °C';
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                    height="100%"
                                    width="100%"
                                />
                            </NewInfoCardContent>)}
                        </Item>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}
