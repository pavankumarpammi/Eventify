import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Paper,
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';

const PaymentGateway = ({ open, onClose, onSuccess, amount, eventDetails, ticketCount }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  const [errors, setErrors] = useState({});

  const steps = ['Enter Card Details', 'Confirm Payment', 'Generate Ticket'];

  const validateCard = () => {
    const newErrors = {};
    if (!paymentDetails.cardNumber || paymentDetails.cardNumber.length !== 16) {
      newErrors.cardNumber = 'Enter a valid 16-digit card number';
    }
    if (!paymentDetails.cardHolder) {
      newErrors.cardHolder = 'Enter card holder name';
    }
    if (!paymentDetails.expiryDate || !paymentDetails.expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      newErrors.expiryDate = 'Enter valid expiry date (MM/YY)';
    }
    if (!paymentDetails.cvv || paymentDetails.cvv.length !== 3) {
      newErrors.cvv = 'Enter valid CVV';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (activeStep === 0 && !validateCard()) {
      return;
    }
    if (activeStep === steps.length - 1) {
      onSuccess();
      return;
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Payment Details
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CreditCardIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="subtitle1">
                Amount to Pay: ${amount}
              </Typography>
            </Box>
            <TextField
              fullWidth
              label="Card Number"
              name="cardNumber"
              value={paymentDetails.cardNumber}
              onChange={handleChange}
              error={!!errors.cardNumber}
              helperText={errors.cardNumber}
              sx={{ mb: 2 }}
              inputProps={{ maxLength: 16 }}
            />
            <TextField
              fullWidth
              label="Card Holder Name"
              name="cardHolder"
              value={paymentDetails.cardHolder}
              onChange={handleChange}
              error={!!errors.cardHolder}
              helperText={errors.cardHolder}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Expiry Date"
                name="expiryDate"
                value={paymentDetails.expiryDate}
                onChange={handleChange}
                error={!!errors.expiryDate}
                helperText={errors.expiryDate}
                placeholder="MM/YY"
                sx={{ flex: 1 }}
              />
              <TextField
                label="CVV"
                name="cvv"
                type="password"
                value={paymentDetails.cvv}
                onChange={handleChange}
                error={!!errors.cvv}
                helperText={errors.cvv}
                sx={{ flex: 1 }}
                inputProps={{ maxLength: 3 }}
              />
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Confirm Payment
            </Typography>
            <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Event: {eventDetails.title}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Number of Tickets: {ticketCount}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Price per Ticket: ${eventDetails.price}
              </Typography>
              <Typography variant="h6" sx={{ mt: 2, color: 'primary.main' }}>
                Total Amount: ${amount}
              </Typography>
            </Paper>
            <Alert severity="info">
              This is a dummy payment gateway. No real payment will be processed.
            </Alert>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom color="primary">
              Payment Successful!
            </Typography>
            <Typography variant="body1">
              Your tickets are being generated...
            </Typography>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '400px',
        },
      }}
    >
      <DialogTitle>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>
      <DialogContent>
        {getStepContent(activeStep)}
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={onClose}
          sx={{ mr: 1 }}
          disabled={activeStep === steps.length - 1}
        >
          Cancel
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        {activeStep > 0 && (
          <Button
            onClick={handleBack}
            sx={{ mr: 1 }}
            disabled={activeStep === steps.length - 1}
          >
            Back
          </Button>
        )}
        <Button
          variant="contained"
          onClick={handleNext}
          sx={{
            background: 'linear-gradient(135deg, #1A237E 0%, #AD1457 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1A237E 20%, #AD1457 120%)',
            },
          }}
        >
          {activeStep === steps.length - 1 ? 'View Tickets' : 'Next'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentGateway; 