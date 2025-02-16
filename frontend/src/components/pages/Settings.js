import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Avatar,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  CircularProgress,
  Tab,
  Tabs,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  AccountCircle as AccountCircleIcon,
  Email as EmailIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import { updateProfile } from '../../store/slices/authSlice';

const Settings = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(0);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    profileImage: user?.profileImage || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    eventReminders: true,
    marketingEmails: false,
    orderUpdates: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        profileImage: user.profileImage || '',
      });
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const validateProfileData = () => {
    const newErrors = {};
    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordData = () => {
    const newErrors = {};
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileUpdate = async () => {
    if (validateProfileData()) {
      try {
        await dispatch(updateProfile(profileData)).unwrap();
        setSuccessMessage('Profile updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setErrors({ submit: err.message });
      }
    }
  };

  const handlePasswordUpdate = async () => {
    if (validatePasswordData()) {
      try {
        await dispatch(updateProfile({ password: passwordData.newPassword })).unwrap();
        setOpenPasswordDialog(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setSuccessMessage('Password updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setErrors({ submit: err.message });
      }
    }
  };

  const handleNotificationChange = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const renderProfileSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} display="flex" justifyContent="center">
        <Box position="relative">
          <Avatar
            src={profileData.profileImage || '/default-avatar.jpg'}
            sx={{ width: 120, height: 120 }}
          />
          <IconButton
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: 'primary.main',
              '&:hover': { backgroundColor: 'primary.dark' },
            }}
            size="small"
          >
            <PhotoCameraIcon sx={{ color: 'white' }} />
          </IconButton>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Name"
          value={profileData.name}
          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
          error={!!errors.name}
          helperText={errors.name}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Email"
          value={profileData.email}
          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
          error={!!errors.email}
          helperText={errors.email}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          onClick={handleProfileUpdate}
          disabled={isLoading}
          sx={{ mt: 2 }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Update Profile'}
        </Button>
      </Grid>
    </Grid>
  );

  const renderNotificationSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={notificationSettings.emailNotifications}
              onChange={() => handleNotificationChange('emailNotifications')}
              color="primary"
            />
          }
          label="Email Notifications"
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={notificationSettings.eventReminders}
              onChange={() => handleNotificationChange('eventReminders')}
              color="primary"
            />
          }
          label="Event Reminders"
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={notificationSettings.marketingEmails}
              onChange={() => handleNotificationChange('marketingEmails')}
              color="primary"
            />
          }
          label="Marketing Emails"
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={notificationSettings.orderUpdates}
              onChange={() => handleNotificationChange('orderUpdates')}
              color="primary"
            />
          }
          label="Order Updates"
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          onClick={() => setSuccessMessage('Notification preferences updated')}
          sx={{ mt: 2 }}
        >
          Save Preferences
        </Button>
      </Grid>
    </Grid>
  );

  const renderSecuritySettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Button
          variant="outlined"
          startIcon={<SecurityIcon />}
          onClick={() => setOpenPasswordDialog(true)}
        >
          Change Password
        </Button>
      </Grid>
    </Grid>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          borderRadius: 2,
          background: 'linear-gradient(135deg, rgba(26, 35, 126, 0.02) 0%, rgba(173, 20, 87, 0.02) 100%)',
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #1A237E 0%, #AD1457 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Settings
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
              },
            }}
          >
            <Tab icon={<AccountCircleIcon />} label="Profile" />
            <Tab icon={<NotificationsIcon />} label="Notifications" />
            <Tab icon={<SecurityIcon />} label="Security" />
          </Tabs>
        </Box>

        <Box sx={{ mt: 3 }}>
          {activeTab === 0 && renderProfileSettings()}
          {activeTab === 1 && renderNotificationSettings()}
          {activeTab === 2 && renderSecuritySettings()}
        </Box>

        {/* Password Change Dialog */}
        <Dialog
          open={openPasswordDialog}
          onClose={() => setOpenPasswordDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 600 }}>
            Change Password
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Current Password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  error={!!errors.currentPassword}
                  helperText={errors.currentPassword}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="New Password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  error={!!errors.newPassword}
                  helperText={errors.newPassword}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button
              onClick={() => setOpenPasswordDialog(false)}
              sx={{ color: '#1A237E', fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePasswordUpdate}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #1A237E 0%, #AD1457 100%)',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #1A237E 20%, #AD1457 120%)',
                },
              }}
            >
              Update Password
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default Settings; 