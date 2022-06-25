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
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
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

export default function ViewHistoricalHourlyData() {

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
            startDate.setHours(startDate.getHours() - 12);
            getActiveDevicesAsync();
            setSelectedPage('');
            mounted.current = true;
        } 
        getHourlyMeasurements();
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

    const getHourlyMeasurements = () => {
        const requestStartDate = startDate.toUTCString();
        const requestEndDate = endDate.toUTCString();
        const requestBody = {deviceId, startDate: requestStartDate, endDate: requestEndDate};
        getHourlyVibrationDataAsync(requestBody);
        getHourlyTemperatureDataAsync(requestBody);
        getHourlyHumidityDataAsync(requestBody);
    }

    const getHourlyVibrationDataAsync = async (requestBody) => {
        setIsVibrationDataAvailable(false);
        await API(EndPoints.BASE_ENDPOINT, user.token).post(EndPoints.GET_HOURLY_VIBRATION_DATA, requestBody)
            .then( response => {
                if (response.status === ResponseStatus.SUCCESS) {
                    setVibrationDataList(response.data);
                    setIsVibrationDataAvailable(true);
                }
            })
            .catch(error => ( error ));
    }

    const getHourlyTemperatureDataAsync = async (requestBody) => {
        setIsTemperatureDataAvailable(false);
        await API(EndPoints.BASE_ENDPOINT, user.token).post(EndPoints.GET_HOURLY_TEMPERATURE_DATA, requestBody)
            .then( response => {
                if (response.status === ResponseStatus.SUCCESS) {
                    setTemperatureDataList(response.data);
                    setIsTemperatureDataAvailable(true);
                }
            })
            .catch(error => ( error ));
    }

    const getHourlyHumidityDataAsync = async (requestBody) => {
        setIsHumidityDataAvailable(false);
        await API(EndPoints.BASE_ENDPOINT, user.token).post(EndPoints.GET_HOURLY_HUMIDITY_DATA, requestBody)
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
            navigate(`/view-historical-hourly-data/${values._id}`);
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
                        <TimePicker
                            label="Start date"
                            value={startDate}
                            onChange={(newValue) => {
                                onStarDateChange(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <TimePicker
                            label="End date"
                            value={endDate}
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
                                                    unit: 'hour'
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
                                                    unit: 'hour'
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
                                            label: 'H0',
                                            data: humidityDataList,
                                            parsing: {
                                                yAxisKey: 'h0',
                                                xAxisKey: '_id'
                                            },
                                            backgroundColor: 'red',
                                            borderColor: 'red'
                                        },{
                                            label: 'H1',
                                            data: humidityDataList,
                                            parsing: {
                                                yAxisKey: 'h1',
                                                xAxisKey: '_id'
                                            },
                                            backgroundColor: 'blue',
                                            borderColor: 'blue'
                                        },{
                                            label: 'H2',
                                            data: humidityDataList,
                                            parsing: {
                                                yAxisKey: 'h2',
                                                xAxisKey: '_id'
                                            },
                                            backgroundColor: 'green',
                                            borderColor: 'green'
                                        },{
                                            label: 'H3',
                                            data: humidityDataList,
                                            parsing: {
                                                yAxisKey: 'h3',
                                                xAxisKey: '_id'
                                            },
                                            backgroundColor: 'yellow',
                                            borderColor: 'yellow'
                                        },{
                                            label: 'H4',
                                            data: humidityDataList,
                                            parsing: {
                                                yAxisKey: 'h4',
                                                xAxisKey: '_id'
                                            },
                                            backgroundColor: 'gray',
                                            borderColor: 'gray'
                                        },{
                                            label: 'H5',
                                            data: humidityDataList,
                                            parsing: {
                                                yAxisKey: 'h5',
                                                xAxisKey: '_id'
                                            },
                                            backgroundColor: 'black',
                                            borderColor: 'black'
                                        },{
                                            label: 'H6',
                                            data: humidityDataList,
                                            parsing: {
                                                yAxisKey: 'h6',
                                                xAxisKey: '_id'
                                            },
                                            backgroundColor: 'pink',
                                            borderColor: 'pink'
                                        },{
                                            label: 'H7',
                                            data: humidityDataList,
                                            parsing: {
                                                yAxisKey: 'h7',
                                                xAxisKey: '_id'
                                            },
                                            backgroundColor: 'orange',
                                            borderColor: 'orange'
                                        },{
                                            label: 'H8',
                                            data: humidityDataList,
                                            parsing: {
                                                yAxisKey: 'h8',
                                                xAxisKey: '_id'
                                            },
                                            backgroundColor: 'brown',
                                            borderColor: 'brown'
                                        },{
                                            label: 'H9',
                                            data: humidityDataList,
                                            parsing: {
                                                yAxisKey: 'h9',
                                                xAxisKey: '_id'
                                            },
                                            backgroundColor: 'purple',
                                            borderColor: 'purple'
                                        }]
                                    }}
                                    options={{
                                        maintainAspectRatio: false,
                                        scales: {
                                            x: {
                                                type: 'time',
                                                time: {
                                                    unit: 'hour'
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
                                            label: 'T0',
                                            data: temperatureDataList,
                                            parsing: {
                                                yAxisKey: 't0',
                                                xAxisKey: '_id'
                                            },
                                            backgroundColor: 'red',
                                            borderColor: 'red'
                                        },{
                                            label: 'T1',
                                            data: temperatureDataList,
                                            parsing: {
                                                yAxisKey: 't1',
                                                xAxisKey: '_id'
                                            },
                                            backgroundColor: 'blue',
                                            borderColor: 'blue'
                                        },{
                                            label: 'T2',
                                            data: temperatureDataList,
                                            parsing: {
                                                yAxisKey: 't2',
                                                xAxisKey: '_id'
                                            },
                                            backgroundColor: 'green',
                                            borderColor: 'green'
                                        },{
                                            label: 'T3',
                                            data: temperatureDataList,
                                            parsing: {
                                                yAxisKey: 't3',
                                                xAxisKey: '_id'
                                            },
                                            backgroundColor: 'yellow',
                                            borderColor: 'yellow'
                                        },{
                                            label: 'T4',
                                            data: temperatureDataList,
                                            parsing: {
                                                yAxisKey: 't4',
                                                xAxisKey: '_id'
                                            },
                                            backgroundColor: 'gray',
                                            borderColor: 'gray'
                                        },{
                                            label: 'T5',
                                            data: temperatureDataList,
                                            parsing: {
                                                yAxisKey: 't5',
                                                xAxisKey: '_id'
                                            },
                                            backgroundColor: 'black',
                                            borderColor: 'black'
                                        },{
                                            label: 'T6',
                                            data: temperatureDataList,
                                            parsing: {
                                                yAxisKey: 't6',
                                                xAxisKey: '_id'
                                            },
                                            backgroundColor: 'pink',
                                            borderColor: 'pink'
                                        },{
                                            label: 'T7',
                                            data: temperatureDataList,
                                            parsing: {
                                                yAxisKey: 't7',
                                                xAxisKey: '_id'
                                            },
                                            backgroundColor: 'orange',
                                            borderColor: 'orange'
                                        },{
                                            label: 'T8',
                                            data: temperatureDataList,
                                            parsing: {
                                                yAxisKey: 't8',
                                                xAxisKey: '_id'
                                            },
                                            backgroundColor: 'brown',
                                            borderColor: 'brown'
                                        },{
                                            label: 'T9',
                                            data: temperatureDataList,
                                            parsing: {
                                                yAxisKey: 't9',
                                                xAxisKey: '_id'
                                            },
                                            backgroundColor: 'purple',
                                            borderColor: 'purple'
                                        }]
                                    }}
                                    options={{
                                        maintainAspectRatio: false,
                                        scales: {
                                            x: {
                                                type: 'time',
                                                time: {
                                                    unit: 'hour'
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
