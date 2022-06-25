import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useNavigate } from 'react-router-dom';

const modalTitle = 'IoT data visualization';
const modalTextContent = 'Please select a data view type for the device: ';

export default function OptionsConfirmationModal(props) {
  const {selectedDevice, isOpen, handleCancelCallback} = props;

  const [radioValue, setRadioValue] = React.useState('');
  const [isConfirmEnabled, setIsConfirmEnabled] = React.useState(false);
  const navigate = useNavigate();

  const handleRadioChange = (event) => {
    setRadioValue(event.target.value);
    setIsConfirmEnabled(true);
  };

  const handleCancelClick = () => {
    setRadioValue('');
    setIsConfirmEnabled(false);
    handleCancelCallback();
  };

  const handleConfirmClick = () => {
    if (radioValue === 'realTime') {
        navigate(`/view-real-time-data/${selectedDevice._id}`);
    }
    else if (radioValue === 'historical-daily') {
        navigate(`/view-historical-daily-data/${selectedDevice._id}`);
    }
    else if (radioValue === 'historical-hourly') {
      navigate(`/view-historical-hourly-data/${selectedDevice._id}`);
    }
  };

  return (
    <Dialog
    open={isOpen}
    onClose={handleCancelClick}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    >
    <DialogTitle sx={{display: 'flex'}} id="alert-dialog-title">
        <SettingsInputAntennaIcon sx={{mr: '10px', color: 'green'}}/>
        {modalTitle}
    </DialogTitle>
    <DialogContent>
        <DialogContentText id="alert-dialog-description">{modalTextContent}<font color="red">{selectedDevice !== null && selectedDevice.name}</font></DialogContentText>
    </DialogContent>
    <FormControl style={{marginLeft: '20px'}}>
        <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={radioValue}
            onChange={handleRadioChange}
        >
            <FormControlLabel value="realTime" control={<Radio color="success" />} label="View real-time data" />
            <FormControlLabel value="historical-daily" control={<Radio color="success" />} label="View historical data (Daily Basis)" />
            <FormControlLabel value="historical-hourly" control={<Radio color="success" />} label="View historical data (Hourly Basis)" />
        </RadioGroup>
    </FormControl>
    <DialogActions>
        <Button onClick={handleConfirmClick} disabled={!isConfirmEnabled} color="success">Confirm</Button>
        <Button onClick={handleCancelClick} color="success" autoFocus> Cancel</Button>
    </DialogActions>
    </Dialog>
  );
}

OptionsConfirmationModal.prototypes = {
    selectedDevice: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    handleCancelCallback: PropTypes.func.isRequired
}
