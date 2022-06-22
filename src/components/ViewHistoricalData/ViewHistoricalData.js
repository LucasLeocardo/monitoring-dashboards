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

const data = [{x: '2022-06-10', acelX: 11, acelY: 9.89, acelZ: 10.25}, {x: '2022-06-13', acelX: 11, acelY: 9.89, acelZ: 10.25}, {x: '2022-06-18', acelX: 8.89, acelY: 7.89, acelZ: 15.25}];

export default function ViewHistoricalData() {

    const { deviceId } = useParams();
    const { API, setSelectedPage, user } = React.useContext(AuthContext); 
    const navigate = useNavigate();
    const [isDataAvailable, setIsDataAvailable] = React.useState(false);
    const [deviceList, setDeviceList] =  React.useState([]);
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
    }, []);

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

    const onSelectedDeviceChange = (event, values) => {
        if (values) {
            navigate(`/view-historical-data/${values._id}`);
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
                                setStartDate(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <DesktopDatePicker
                            label="End date"
                            value={endDate}
                            minDate={new Date('2022-01-01')}
                            onChange={(newValue) => {
                                setEndDate(newValue);
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
                            <NewInfoCardContent marginTop="30px">
                                <Line
                                    data={{
                                        datasets: [{
                                            label: 'Acceleration X',
                                            data: data,
                                            parsing: {
                                                yAxisKey: 'acelX'
                                            },
                                            backgroundColor: 'red',
                                            borderColor: 'red'
                                        }, {
                                            label: 'Acceleration Y',
                                            data: data,
                                            parsing: {
                                                yAxisKey: 'acelY'
                                            },
                                            backgroundColor: 'blue',
                                            borderColor: 'blue'
                                        }, {
                                            label: 'Acceleration Z',
                                            data: data,
                                            parsing: {
                                                yAxisKey: 'acelZ'
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
                            </NewInfoCardContent>
                        </Item>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}
