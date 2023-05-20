import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
import { useSelector } from 'react-redux';
import { useAuth } from '../../../context/AuthContext';

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const { user } = useSelector(state => state.user);
  const photoURL = `/assets/images/avatars/${user.avatar}.jpg`;
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };


  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate('/');
      window.reload();
    }
    else {
      console.error('Failed');
    }
  };
  const handleSettings = () => {
    if (user) {
      const currentUser = user;
      navigate(`/dashboard/settings`, {
        state: {
          isEdit: true,
          currentUser,
        },
      });
      handleClose();
    }
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={photoURL} alt={user.user_First_Name.charAt(0)} />

      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 250,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user.user_Mail}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          <MenuItem key="home" onClick={handleClose}>
            Home
          </MenuItem>
          <MenuItem key="profile" onClick={handleClose}>
            Profile
          </MenuItem>
          {user.role === 'Admin' && (
            <MenuItem key="users" onClick={handleClose}>
              Manage users
            </MenuItem>
          )}
          <MenuItem key="settings" onClick={handleSettings}>
            Settings
          </MenuItem>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
