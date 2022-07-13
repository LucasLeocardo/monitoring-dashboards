import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import SensorsIcon from '@mui/icons-material/Sensors';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { IMaskInput } from 'react-imask';
import PropTypes from 'prop-types';
import './editDevice.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';
import * as Endpoints from '../../entities/endPoints';
import FormLabel from '@mui/material/FormLabel';
import * as ResponseStatus from '../../entities/responseStatus'
import Loading from '../Loading/Loading';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useParams } from "react-router-dom";



const latitudeMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask={Number}
        scale={10}
        radix="."
        digits={1}
        min={-90}
        max={90}
        inputRef={ref}
        onAccept={(value) => onChange({ target: { name: props.name, value } })}
        overwrite
      />
    );
  });

  latitudeMaskCustom.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

const longitudeMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask={Number}
      scale={10}
      radix="."
      min={-180}
      max={180}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

const numberMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask={Number}
      scale={10}
      radix="."
      digits={1}
      min={-90}
      max={90}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

longitudeMaskCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const theme = createTheme();

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function EditDevice() {
  const { API, setSelectedPage, user } = React.useContext(AuthContext); 
  const [deviceName, setDeviceName] = React.useState('');
  const [deviceLatitude, setDeviceLatitude] = React.useState('');
  const [deviceLongitude, setDeviceLongitude] = React.useState('');
  const { deviceId } = useParams();
  const [measurementTypeList, setMeasurementTypeList] = React.useState([]);
  const [selectedMeasurementTypes, setSelectedMeasurementTypes] = React.useState([]);
  const [selectedMeasuredDataTypesObj, setSelectedMeasuredDataTypesObj] = React.useState([]);
  const [isMeasurementTypeListLoaded, setIsMeasurementTypeListLoaded] = React.useState(false);
  const [isDeviceDataLoaded, setIsDeviceDataLoaded] = React.useState(false);
  const [isSubmitEnabled, setIsSubmitEnabled] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    getAllMeasurementTypes();
    getDeviceById();
    setSelectedPage('Manage devices');
  }, []);

  const handleDeviceNameChange = (event) => {
    setDeviceName(event.target.value);
  };

  const handleLatitudeChange = (event) => {
    setDeviceLatitude(event.target.value);
  };

  const handleLongitudeChange = (event) => {
    setDeviceLongitude(event.target.value);
  };

  const handleSensorGainChange = (event, index) => {
    const copySelectedMeasuredDataTypesObj = selectedMeasuredDataTypesObj.slice();;
    copySelectedMeasuredDataTypesObj[index].gain = event.target.value;
    setSelectedMeasuredDataTypesObj(copySelectedMeasuredDataTypesObj);
  };

  const handleSensorOffsetChange = (event, index) => {
    const copySelectedMeasuredDataTypesObj = selectedMeasuredDataTypesObj.slice();;
    copySelectedMeasuredDataTypesObj[index].offSet = event.target.value;
    setSelectedMeasuredDataTypesObj(copySelectedMeasuredDataTypesObj);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get('name');
    if (name && deviceLatitude && deviceLongitude && selectedMeasuredDataTypesObj.length > 0) {
        const request = { id: deviceId, name, latitude: Number(deviceLatitude), longitude: Number(deviceLongitude), measuredDataTypes: selectedMeasuredDataTypesObj };
        updateDevice(request);
    }
    else {
        toast.warning('Please fill in all required fields!');
    }
  };

  const onBackToManageDevicesScreenClick = (event) => {
    event.preventDefault();
    navigate('/manage-devices');
  };

  const getStyles = (id, selectedMeasurementTypes, theme) => {
    const index = selectedMeasurementTypes.findIndex(measurementType => measurementType._id === id);
    return {
      fontWeight:
          index === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const onSelectedMeasurementTypeChange = (event) => {
    const {
      target: { value },
    } = event;
    const measuredDataTypes =  measurementTypeList.filter(measurementType => {
      const measurementTypeLabelKey =  measurementType.name + ' (' + measurementType.unit + ')';
      if (value === 'string') {
        return value === measurementTypeLabelKey;
      } else {
        return value.some(selectedMeasurementType => selectedMeasurementType === measurementTypeLabelKey);
      }
    });
    setSelectedMeasurementTypes(
      typeof value === 'string' ? value.split(',') : value,
    );
    const unselectedMeasuredDataTypesObj = measuredDataTypes.filter(measuredDataType => selectedMeasuredDataTypesObj.every(selectedMeasuredDataTypeObj => selectedMeasuredDataTypeObj.name !== measuredDataType.name));
    const newSelectedMeasuredDataTypesObj = selectedMeasuredDataTypesObj.filter(selectedMeasuredDataTypeObj => measuredDataTypes.some(measuredDataType => measuredDataType.name === selectedMeasuredDataTypeObj.name));
    setSelectedMeasuredDataTypesObj([...newSelectedMeasuredDataTypesObj, ...unselectedMeasuredDataTypesObj]);
  };

  async function getDeviceById() {
    await API(Endpoints.BASE_ENDPOINT, user.token).get(`${Endpoints.GET_DEVICE_BY_ID}?deviceId=${deviceId}`)
        .then( response => {
            if (response.status === ResponseStatus.SUCCESS) {
                const data = response.data;
                setDeviceName(data.name);
                setDeviceLatitude(String(data.latitude));
                setDeviceLongitude(String(data.longitude));
                const deviceSelectedMeasurementTypes = data.measuredDataTypes.map(dataType => dataType.measurementType + ' (' + dataType.unit + ')');
                const selectedMeasurementTypes = data.measuredDataTypes.map(dataType => { 
                  const deviceSelectedMeasurementType =  {
                    name: dataType.measurementType, 
                    unit: dataType.unit, 
                    gain: dataType.gain, 
                    offSet: dataType.offSet, 
                    _id: dataType._id 
                  };
                  return deviceSelectedMeasurementType;
                });
                setSelectedMeasurementTypes(deviceSelectedMeasurementTypes); 
                setSelectedMeasuredDataTypesObj(selectedMeasurementTypes);
                setIsDeviceDataLoaded(true);
            }
            else {
              toast.error('There was an error loading page data!');
            }
        })
        .catch(error => ( error ));
  }

  async function getAllMeasurementTypes() {
    await API(Endpoints.BASE_ENDPOINT, user.token).get(Endpoints.GET_ALL_MEASUREMENT_TYPES)
        .then( response => {
            if (response.status === ResponseStatus.SUCCESS) {
                setIsMeasurementTypeListLoaded(true);
                setMeasurementTypeList(response.data);
            }
            else {
              toast.error('There was an error loading page data!');
            }
        })
        .catch(error => ( error ));
  }

  async function updateDevice(request) {
    toast.info('Updating device info...');
    setIsSubmitEnabled(false);
    await API(Endpoints.BASE_ENDPOINT, user.token).put(Endpoints.UPDATE_DEVICES, request)
        .then( response => {
            if (response.status === ResponseStatus.SUCCESS) {
                toast.success('Device updated successfully!');
                setIsSubmitEnabled(true);
            }
        })
        .catch(error => ( error ));
  }

  if (!isMeasurementTypeListLoaded || !isDeviceDataLoaded) {
    return (
      <Loading/>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <div className='button-container'>
        <Button color='success' variant="outlined" onClick={onBackToManageDevicesScreenClick} startIcon={<ArrowBackIosIcon />}>
            Manage devices screen
        </Button>
      </div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <SensorsIcon fontSize='large'/>
          </Avatar>
          <Typography component="h1" variant="h5">
            Edit device
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  value={deviceName}
                  onChange={handleDeviceNameChange}
                  required
                  fullWidth
                  id="name"
                  label="Device Name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="latitude"
                  label="Latitude"
                  value={deviceLatitude}
                  onChange={handleLatitudeChange}
                  name="latitude"
                  InputProps={{
                    inputComponent: latitudeMaskCustom,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Longitude"
                  id="longitude"
                  name="longitude"
                  value={deviceLongitude}
                  onChange={handleLongitudeChange}
                  InputProps={{
                    inputComponent: longitudeMaskCustom,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl sx={{ width: '100%' }}>
                  <InputLabel id="demo-multiple-chip-label">Select measurement types</InputLabel>
                  <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={selectedMeasurementTypes}
                    onChange={onSelectedMeasurementTypeChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Select measurement types" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {measurementTypeList.map((measurementType) => {
                      const measurementTypeLabel = measurementType.name + ' (' + measurementType.unit + ')';
                      return (
                        <MenuItem
                          key={measurementType._id}
                          value={measurementTypeLabel}
                          style={getStyles(measurementTypeLabel, selectedMeasurementTypes, theme)}
                        >
                          {measurementTypeLabel}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              {selectedMeasuredDataTypesObj.map((selectedMeasuredDataType, index) => {
                return (
                  <React.Fragment key={"Fragment: " + String(index)}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        id={"Sensor type: " + String(index)}
                        label="Sensor type"
                        value={selectedMeasuredDataType.name}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        id={"Gain: " + String(index)}
                        label="Gain"
                        value={selectedMeasuredDataType.gain ? String(selectedMeasuredDataType.gain) : ''}
                        onChange={(event) => handleSensorGainChange(event, index)}
                        InputProps={{
                          inputComponent: numberMaskCustom,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Offset"
                        id={"Offset: " + String(index)}
                        value={selectedMeasuredDataType.offSet ? String(selectedMeasuredDataType.offSet) : ''}
                        onChange={(event) => handleSensorOffsetChange(event, index)}
                        InputProps={{
                          inputComponent: numberMaskCustom,
                        }}
                      />
                    </Grid>
                  </React.Fragment>
                 );
              })}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="_id"
                  label="Device Identifier"
                  name="_id"
                  value={deviceId}
                  disabled
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              disabled={!isSubmitEnabled}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Update device
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}