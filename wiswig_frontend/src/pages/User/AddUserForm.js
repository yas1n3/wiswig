import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, MenuItem, TextField } from '@mui/material';
import axios from 'axios';
import Label from '../../components/label';
import { RHFSelect, RHFSwitch, RHFTextField } from '../../components/hook-form';



const options = [
  { value: 'admin', label: 'Admin' },
  { value: 'user', label: 'User' },
];

AddUserForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function AddUserForm({ isEdit, currentUser }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email(),
    role: Yup.string().required('Role is required'),
  });

  const defaultValues = useMemo(() => {
    const defaultUser = {
      user_First_Name: '',
      user_Last_Name: '',
      user_Mail: '',
      user_Password: '',
      role: '',
    };
    if (isEdit && currentUser) {
      return {
        ...defaultUser,
        user_First_Name: currentUser.firstName,
        user_Last_Name: currentUser.lastName,
        user_Mail: currentUser.email,
        role: currentUser.role,
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

  const onSubmit = useCallback(
    async (data) => {
      try {
        await axios.post('http://localhost:4000/auth/addUser', data);
        reset();
        enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
        navigate('/dashboard/user');
      } catch (error) {
        console.error(error);
      }

    },
    [reset, enqueueSnackbar, navigate, isEdit]
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3} sx={{ width: '100%', mx: 'auto', paddingLeft: '5%' }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 10, px: 3, width: 800, mx: 'auto' }}>
              {isEdit && (
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
                      name="user_First_Name"
                      control={control}
                      render={({ field }) => (
                        <RHFTextField
                          {...field}
                          required
                          fullWidth
                          label="First Name"
                        />
                      )}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 5 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Last Name
                    </Typography>
                    <Controller
                      name="user_Last_Name"
                      control={control}
                      render={({ field }) => (
                        <RHFTextField
                          {...field}
                          required
                          fullWidth
                          label="Last Name"
                        />
                      )}
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
                    <RHFTextField name="user_Mail" required fullWidth control={control} />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 5 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Password
                    </Typography>
                    <RHFTextField name="user_Password" required fullWidth control={control} type="password" />
                  </Box>
                </Grid>
              </Grid>

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
                        {options.map((option) => (
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

{/*               <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                Save
              </Button> */}

              <LoadingButton type="submit" variant="contained" loading={isSubmitting} onClick={handleSubmit}>
                Save
              </LoadingButton>
            </Card>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
}
