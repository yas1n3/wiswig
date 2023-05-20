import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, MenuItem, TextField, Button } from '@mui/material';
import axios from 'axios';
import Label from '../../components/label';
import { RHFSelect, RHFSwitch, RHFTextField } from '../../components/hook-form';
import Iconify from '../../components/iconify';

const u_options = [
  { value: 'Admin', label: 'Admin' },
  { value: 'User', label: 'User' },
];
const g_options = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];


AddUserForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function AddUserForm() {
  const LoggedUser = useSelector((state) => state.user);
  const { state } = useLocation();
  console.log(state);
  const { isEdit = false, currentUser = null } = state || {};
  console.log(isEdit, currentUser);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const NewUserSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    mail: Yup.string().required('Email is required').email(),
    password: Yup.string().required('Password is required').min(4, 'Password must be at least 4 characters'),
    role: Yup.string().required('Role is required'),
    gender: Yup.string().required('Gender is required'),
  });

  const defaultValues = useMemo(() => {
    const defaultUser = {
      firstName: '',
      lastName: '',
      mail: '',
      password: '',
      role: '',
      gender: '',
    };
    if (isEdit && currentUser) {
      return {
        ...defaultUser,
        firstName: currentUser.user_First_Name,
        lastName: currentUser.user_Last_Name,
        mail: currentUser.user_Mail,
        role: currentUser.role,
        gender: currentUser.gender,
      };
    }
    return defaultUser;
  }, [currentUser, isEdit]);

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = methods;
  const handleCancel = () => {
    navigate('/dashboard/user');
  };



  const onSubmit = useCallback(
    async (data) => {
      try {
        console.log('Submitting data:', data);

        if (isEdit && currentUser) {
          await axios.put(`http://localhost:4000/auth/edit/${currentUser._id}`, data);
          enqueueSnackbar('Update success!', { variant: 'success', autoHideDuration: 3000 });
        } else {
          await axios.post('http://localhost:4000/auth/register', data);
          enqueueSnackbar('Create success!', { variant: 'success', autoHideDuration: 3000 });
        }

        reset();
        navigate('/dashboard/user');
      } catch (error) {
        enqueueSnackbar('An error occurred.', { variant: 'error', autoHideDuration: 3000 });
        console.error(error);
      }
    },
    [reset, enqueueSnackbar, navigate, isEdit, currentUser]
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} id="add-user-form">
        <Grid container spacing={3} sx={{ width: '100%', mx: 'auto', paddingLeft: '5%' }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 10, px: 3, width: 800, mx: 'auto' }}>
              {isEdit && control.formState && (
                <Label
                  color={control.formState.isDirty ? 'error' : 'success'}
                  sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
                >
                  {control.formState.isDirty ? 'Dirty' : 'Clean'}
                </Label>
              )}

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 5 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      First Name
                    </Typography>
                    <Controller
                      name="firstName"
                      control={control}
                      render={({ field }) => <RHFTextField {...field} required fullWidth label="First Name" />}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 5 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Last Name
                    </Typography>
                    <Controller
                      name="lastName"
                      control={control}
                      render={({ field }) => <RHFTextField {...field} required fullWidth label="Last Name" />}
                    />
                  </Box>
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 5 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Email
                    </Typography>
                    <RHFTextField name="mail" required fullWidth control={control} />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 5 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Password
                    </Typography>
                    <RHFTextField name="password" required fullWidth control={control} type="password" />
                  </Box>
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                {LoggedUser.user.role === 'Admin' && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 5 }}>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Role
                      </Typography>
                      <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                          <RHFSelect {...field} label="Role" required variant="outlined" fullWidth>
                            <option value="" />
                            {u_options.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </RHFSelect>
                        )}
                      />
                      <Typography variant="caption" sx={{ mt: 1 }}>
                        Please select a role from the options above.
                      </Typography>
                    </Box>
                  </Grid>
                )}

                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 5 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Gender
                    </Typography>
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <RHFSelect {...field} label="Gender" required variant="outlined" fullWidth>
                          <option value="" />
                          {g_options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </RHFSelect>
                      )}
                    />
                    <Typography variant="caption" sx={{ mt: 1 }}>
                      Please select a gender from the options above.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button variant="contained" color="primary" type="submit" form="add-user-form">
                    {isSubmitting ? <LoadingButton loading /> : 'Submit'}
                  </Button>
                </Stack>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
}
