import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import WarningIcon from '@mui/icons-material/Warning';

export default function ConfirmationModal(props) {
  const {modalTitle, modalTextContent, isOpen, handleConfirmClick, handleCancelClick} = props;

  return (
    <Dialog
    open={isOpen}
    onClose={handleCancelClick}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    >
    <DialogTitle sx={{display: 'flex'}} id="alert-dialog-title">
        <WarningIcon sx={{mr: '10px', color: 'red'}}/>
        {modalTitle}
    </DialogTitle>
    <DialogContent>
        <DialogContentText id="alert-dialog-description">{modalTextContent}</DialogContentText>
    </DialogContent>
    <DialogActions>
        <Button onClick={handleConfirmClick} color="success">Confirm</Button>
        <Button onClick={handleCancelClick} color="success" autoFocus> Cancel</Button>
    </DialogActions>
    </Dialog>
  );
}

ConfirmationModal.prototypes = {
    modalTitle: PropTypes.string.isRequired,
    modalTextContent: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    handleConfirmClick: PropTypes.func.isRequired,
    handleCancelClick: PropTypes.func.isRequired
}
