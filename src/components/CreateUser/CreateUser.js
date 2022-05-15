import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { IMaskInput } from 'react-imask';
import PropTypes from 'prop-types';
import './createUser.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';
import * as Endpoints from '../../entities/endPoints';

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="(#0) 00000-0000"
        definitions={{
          '#': /[1-9]/,
        }}
        inputRef={ref}
        onAccept={(value) => onChange({ target: { name: props.name, value } })}
        overwrite
      />
    );
  });

TextMaskCustom.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

const theme = createTheme();

export default function CreateUser() {
  const { API, setSelectedPage, user } = React.useContext(AuthContext); 
  const [phoneText, setPhoneText] = React.useState('(100) 000-0000');
  const [isSubmitEnabled, setIsSubmitEnabled] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    setSelectedPage('Manage users');
  });

  const handlePhoneTextChange = (event) => {
    setPhoneText(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const firstName = data.get('firstName');
    const lastName = data.get('lastName');
    const email = data.get('email');
    const password = data.get('password');
    const phoneNumber = data.get('phoneNumber');
    const isPasswordValid = validatePassword(password);
    if (firstName && lastName && email && password && phoneNumber && isPasswordValid) {
        const name = firstName + ' ' + lastName;
        const request = { name, email, password, phoneNumber };
        addNewUser(request);
    }
    else if (firstName && lastName && email && password && phoneNumber && !isPasswordValid) {
        toast.warning('Passwords must contain 6 to 10 characters!');
    }
    else {
        toast.warning('Please fill in all required fields!');
    }
  };

  const onBackToManageUsersScreenClick = (event) => {
    event.preventDefault();
    navigate('/manage-users');
  };

  function validatePassword(password) {
    const passwordLength = password.length;
    let isPasswordValid = false;
    if (passwordLength >= 6 && passwordLength <= 10) {
        isPasswordValid = true
    }
    return isPasswordValid;
  }

  async function addNewUser(request) {
    setIsSubmitEnabled(false);
    toast.info('Adding new user...');
    await API(Endpoints.BASE_ENDPOINT, user.token).post(Endpoints.CREATE_USER, request)
        .then( response => {
            if (response.data) {
                toast.success('User created successfully!');
                navigate('/manage-users');
            }
            setIsSubmitEnabled(true);
        })
        .catch(error => ( error ));
  }

  return (
    <ThemeProvider theme={theme}>
      <div className='button-container'>
        <Button color='success' variant="outlined" onClick={onBackToManageUsersScreenClick} startIcon={<ArrowBackIosIcon />}>
            Manage users screen
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Add new user
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Phone Number"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={phoneText}
                  onChange={handlePhoneTextChange}
                  InputProps={{
                    inputComponent: TextMaskCustom,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!isSubmitEnabled}
              sx={{ mt: 3, mb: 2 }}
            >
              Add user
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}