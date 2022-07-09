import * as React from 'react';
import './viewHistoricalData.css'
import { AuthContext } from '../../contexts/auth';
import { useNavigate } from 'react-router-dom';
import * as ResponseStatus from '../../entities/responseStatus';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import * as EndPoints from '../../entities/endPoints'
import Loading from '../Loading/Loading';
import TextField from '@mui/material/TextField';
import { useParams } from "react-router-dom";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Box from '@mui/material/Box';
import Moment from 'moment';
import Grid from '@mui/material/Grid';
import * as MeasurementTypes from '../../entities/measurementTypes';
import VibrationHistoricalChart from '../HistoricalCharts/VibrationHistoricalChart';
import SingleValueHistoricalChart from '../HistoricalCharts/SingleValueHistoricalChart';

const callbackTimeObj = { callback: (label, index, ticks) => {
      const format = 'ddd:hh A'; // Change how you please
      return new Moment(ticks[index].value)
        .utcOffset(-21600 / 60)
        .format(format);
} }

export default function ViewHistoricalHourlyData() {

    const { deviceId } = useParams();
    const { API, setSelectedPage, user } = React.useContext(AuthContext); 
    const navigate = useNavigate();
    const [isDeviceListAvailable, setIsDeviceListAvailable] = React.useState(false);
    const [deviceList, setDeviceList] =  React.useState([]);
    const [linearAccelerationDataList, setLinearAccelerationDataList] =  React.useState([]);
    const [isLinearAccelerationDataAvailable, setIsLinearAccelerationDataAvailable] = React.useState(false);
    const [angularAccelerationDataList, setAngularAccelerationDataList] =  React.useState([]);
    const [isAngularAccelerationDataAvailable, setIsAngularAccelerationDataAvailable] = React.useState(false);
    const [temperatureDataList, setTemperatureDataList] =  React.useState([]);
    const [isTemperatureDataAvailable, setIsTemperatureDataAvailable] = React.useState(false);
    const [humidityDataList, setHumidityDataList] =  React.useState([]);
    const [isHumidityDataAvailable, setIsHumidityDataAvailable] = React.useState(false);
    const [rainfallLevelDataList, setRainfallLevelDataList] =  React.useState([]);
    const [isRainfallLevelDataAvailable, setIsRainfallLevelDataAvailable] = React.useState(false);
    const [poroPressureDataList, setPoroPressureDataList] =  React.useState([]);
    const [isPoroPressureDataAvailable, setIsPoroPressureDataAvailable] = React.useState(false);
    const mounted = React.useRef();
    const [startDate, setStartDate] = React.useState(new Date());
    const [endDate, setEndDate] = React.useState(new Date());
    const [deviceMeasurementTypes, setDeviceMeasurementTypes] =  React.useState([]);
    const [isMeasurementTypesAvailable, setIsMeasurementTypesAvailable] = React.useState(false);

    React.useEffect(() => {
        if (!mounted.current) { 
            startDate.setHours(startDate.getHours() - 12);
            getActiveDevicesAsync();
            setSelectedPage('');
            mounted.current = true;
        } 
        else {
            getHourlyMeasurements();
        }
    }, [deviceMeasurementTypes.length, startDate, endDate]);

    React.useEffect(() => {
        setDeviceMeasurementTypes([]);
        getDeviceMeasurementTypesAysnc();
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
                    setIsDeviceListAvailable(true);
                }
            })
            .catch(error => ( error ));
    }

    const getHourlyMeasurements = () => {
        const requestStartDate = startDate.toISOString();
        const requestEndDate = endDate.toISOString();
        const requestBody = {deviceId, startDate: requestStartDate, endDate: requestEndDate};
        if (deviceMeasurementTypes.includes(MeasurementTypes.LINEAR_ACCELERATION)) {
            getHourlyLinearAccelerationDataAsync(requestBody);
        }
        if (deviceMeasurementTypes.includes(MeasurementTypes.ANGULAR_ACCELERATION)) {
            getHourlyAngularAccelerationDataAsync(requestBody);
        }
        if (deviceMeasurementTypes.includes(MeasurementTypes.TEMPERATURE)) {
            getHourlyTemperatureDataAsync(requestBody);
        }
        if (deviceMeasurementTypes.includes(MeasurementTypes.HUMIDITY)) {
            getHourlyHumidityDataAsync(requestBody);
        }
        if (deviceMeasurementTypes.includes(MeasurementTypes.RAINFALL_LEVEL)) {
            getHourlyRainfallLevelDataAsync(requestBody);
        }
        if (deviceMeasurementTypes.includes(MeasurementTypes.PORO_PRESSURE)) {
            getHourlyPoroPressureDataAsync(requestBody);
        }
    }

    const getHourlyLinearAccelerationDataAsync = async (requestBody) => {
        setIsLinearAccelerationDataAvailable(false);
        await API(EndPoints.BASE_ENDPOINT, user.token).post(EndPoints.GET_HOURLY_LINEAR_ACCELERATION_DATA, requestBody)
            .then( response => {
                if (response.status === ResponseStatus.SUCCESS) {
                    setLinearAccelerationDataList(response.data);
                    setIsLinearAccelerationDataAvailable(true);
                }
            })
            .catch(error => ( error ));
    }

    const getHourlyAngularAccelerationDataAsync = async (requestBody) => {
        setIsAngularAccelerationDataAvailable(false);
        await API(EndPoints.BASE_ENDPOINT, user.token).post(EndPoints.GET_HOURLY_ANGULAR_ACCELERATION_DATA, requestBody)
            .then( response => {
                if (response.status === ResponseStatus.SUCCESS) {
                    setAngularAccelerationDataList(response.data);
                    setIsAngularAccelerationDataAvailable(true);
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

    const getHourlyRainfallLevelDataAsync = async (requestBody) => {
        setIsRainfallLevelDataAvailable(false);
        await API(EndPoints.BASE_ENDPOINT, user.token).post(EndPoints.GET_HOURLY_RAINFALL_LEVEL_DATA, requestBody)
            .then( response => {
                if (response.status === ResponseStatus.SUCCESS) {
                    setRainfallLevelDataList(response.data);
                    setIsRainfallLevelDataAvailable(true);
                }
            })
            .catch(error => ( error ));
    }

    const getHourlyPoroPressureDataAsync = async (requestBody) => {
        setIsPoroPressureDataAvailable(false);
        await API(EndPoints.BASE_ENDPOINT, user.token).post(EndPoints.GET_HOURLY_PORO_PRESSURE_DATA, requestBody)
            .then( response => {
                if (response.status === ResponseStatus.SUCCESS) {
                    setPoroPressureDataList(response.data);
                    setIsPoroPressureDataAvailable(true);
                }
            })
            .catch(error => ( error ));
    }


    const onSelectedDeviceChange = (event, values) => {
        if (values) {
            navigate(`/view-historical-hourly-data/${values._id}`);
            setIsMeasurementTypesAvailable(false);
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
                            label="Start time (Yesterday)"
                            value={startDate}
                            onChange={(newValue) => {
                                onStarDateChange(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <TimePicker
                            label="End time (Today)"
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
                {!isMeasurementTypesAvailable? <Loading hasMarginTop/> :
                (<Grid container spacing={4}>
                    {deviceMeasurementTypes.includes(MeasurementTypes.LINEAR_ACCELERATION) && (
                    <React.Fragment>
                        <Grid item xs={12}>
                            <VibrationHistoricalChart
                                cardTittle="Linear acceleration (x, y, z)"
                                isVibrationDataAvailable={isLinearAccelerationDataAvailable}
                                firstLabelName="Acceleration X"
                                secondLabelName="Acceleration Y"
                                thirdLabelName="Acceleration Z"
                                vibrationDataList={linearAccelerationDataList}
                                unit="m/s²"
                                timeBasis="hour"
                                callbackTimeObj={callbackTimeObj}
                            />
                        </Grid>
                    </React.Fragment>
                    )}
                    {deviceMeasurementTypes.includes(MeasurementTypes.ANGULAR_ACCELERATION) && (
                    <React.Fragment>
                        <Grid item xs={12}>
                            <VibrationHistoricalChart
                                cardTittle="Angular acceleration (x, y, z)"
                                isVibrationDataAvailable={isAngularAccelerationDataAvailable}
                                firstLabelName="Acceleration X"
                                secondLabelName="Acceleration Y"
                                thirdLabelName="Acceleration Z"
                                vibrationDataList={angularAccelerationDataList}
                                unit="rad/s²"
                                timeBasis="hour"
                                callbackTimeObj={callbackTimeObj}
                            />
                        </Grid>
                    </React.Fragment>
                    )}
                    {deviceMeasurementTypes.includes(MeasurementTypes.HUMIDITY) && (
                    <React.Fragment>
                        <Grid item xs={12}>
                            <SingleValueHistoricalChart
                                cardTittle="Humidity"
                                isDataAvailable={isHumidityDataAvailable}
                                labelName="Humidity data"
                                dataList={humidityDataList}
                                unit="%"
                                timeBasis="hour"
                                chartColor="blue"
                                callbackTimeObj={callbackTimeObj}
                            />
                        </Grid>
                    </React.Fragment>
                    )}
                    {deviceMeasurementTypes.includes(MeasurementTypes.TEMPERATURE) && (
                    <React.Fragment>
                        <Grid item xs={12}>
                            <SingleValueHistoricalChart
                                cardTittle="Temperature"
                                isDataAvailable={isTemperatureDataAvailable}
                                labelName="Temperature data"
                                dataList={temperatureDataList}
                                unit="°C"
                                timeBasis="hour"
                                chartColor="red"
                                callbackTimeObj={callbackTimeObj}
                            />
                        </Grid>
                    </React.Fragment>
                    )}
                    {deviceMeasurementTypes.includes(MeasurementTypes.RAINFALL_LEVEL) && (
                    <React.Fragment>
                        <Grid item xs={12}>
                            <SingleValueHistoricalChart
                                cardTittle="Rainfall level"
                                isDataAvailable={isRainfallLevelDataAvailable}
                                labelName="Rainfall level data"
                                dataList={rainfallLevelDataList}
                                unit="mm"
                                timeBasis="hour"
                                chartColor="blue"
                                callbackTimeObj={callbackTimeObj}
                            />
                        </Grid>
                    </React.Fragment>
                    )}
                    {deviceMeasurementTypes.includes(MeasurementTypes.PORO_PRESSURE) && (
                    <React.Fragment>
                        <Grid item xs={12}>
                            <SingleValueHistoricalChart
                                cardTittle="Poro pressure"
                                isDataAvailable={isPoroPressureDataAvailable}
                                labelName="Poro pressure data"
                                dataList={poroPressureDataList}
                                unit="Pa"
                                timeBasis="hour"
                                chartColor="green"
                                callbackTimeObj={callbackTimeObj}
                            />
                        </Grid>
                    </React.Fragment>
                    )}
                </Grid>)}
            </Box>
        </div>
    );
}
