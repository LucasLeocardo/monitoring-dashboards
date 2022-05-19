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
import './createDevice.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';
import * as Endpoints from '../../entities/endPoints';
import FormLabel from '@mui/material/FormLabel';
import * as ResponseStatus from '../../entities/responseStatus'


const latitudeMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask={Number}
        scale={6}
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
      scale={6}
      radix="."
      min={-180}
      max={180}
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

export default function CreateDevice() {
  const { API, setSelectedPage, user } = React.useContext(AuthContext); 
  const [latitudeValue, setLatitudeValue] = React.useState('');
  const [longitudeValue, setLongitudeValue] = React.useState('');
  const [deviceId, setDeviceId] = React.useState('');
  const [isFormFieldsEnabled, setIsFormFieldsEnabled] = React.useState(true);
  const [isSubmitEnabled, setIsSubmitEnabled] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    setSelectedPage('Manage devices');
  }, []);

  const handleLatitudeChange = (event) => {
    setLatitudeValue(event.target.value);
  };

  const handleLongitudeChange = (event) => {
    setLongitudeValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get('name');
    if (name && latitudeValue && longitudeValue) {
        const request = { name, latitude: Number(latitudeValue), longitude: Number(longitudeValue) };
        addNewDevice(request);
    }
    else {
        toast.warning('Please fill in all required fields!');
    }
  };

  const onBackToManageDevicesScreenClick = (event) => {
    event.preventDefault();
    navigate('/manage-devices');
  };

  async function addNewDevice(request) {
    setIsSubmitEnabled(false);
    toast.info('Adding new device...');
    await API(Endpoints.BASE_ENDPOINT, user.token).post(Endpoints.CREATE_DEVICE, request)
        .then( response => {
            if (response.status === ResponseStatus.SUCCESS) {
                setIsFormFieldsEnabled(false);
                setDeviceId(response.data);
                toast.success('Device created successfully!');
            }
            else {
              setIsSubmitEnabled(true);
            }
        })
        .catch(error => ( error ));
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
            Add new device
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Device Name"
                  disabled={!isFormFieldsEnabled}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="latitude"
                  label="Latitude"
                  value={latitudeValue}
                  onChange={handleLatitudeChange}
                  name="latitude"
                  disabled={!isFormFieldsEnabled}
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
                  value={longitudeValue}
                  onChange={handleLongitudeChange}
                  disabled={!isFormFieldsEnabled}
                  InputProps={{
                    inputComponent: longitudeMaskCustom,
                  }}
                />
              </Grid>
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
              { isFormFieldsEnabled && (
              <Grid item xs={12}>
                <FormLabel style={{color: 'red', fontSize: '14px'}} >* The Device Identifier field will be filled in after clicking on the add device button</FormLabel>
              </Grid>
              )}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!isSubmitEnabled}
              sx={{ mt: 3, mb: 2 }}
            >
              Add device
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}