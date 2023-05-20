import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useMemo, useState, useEffect } from 'react';
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

AddClientForm.propTypes = {
  isEdit: PropTypes.bool,
  currentClient: PropTypes.object,
};

export default function AddClientForm() {
  const { state } = useLocation();
  const { isEdit = false, currentClient = null } = state || {};


  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const NewClientSchema = Yup.object().shape({
    client_First_Name: Yup.string().required('First Name is required'),
    client_Last_Name: Yup.string().required('Last Name is required'),
    client_Mail: Yup.string().required('Email is required').email(),
    clientGroupId: Yup.string().required('Client group is required'),
  });

  const defaultValues = useMemo(() => {
    const defaultClient = {
      client_First_Name: '',
      client_Last_Name: '',
      client_Mail: '',
      clientGroupId: '',
    };
    if (isEdit && currentClient) {
      return {
        ...defaultClient,
        client_First_Name: currentClient.client_First_Name,
        client_Last_Name: currentClient.client_Last_Name,
        client_Mail: currentClient.client_Mail,
        clientGroupId: currentClient.clientGroup._id,
      };
    }
    return defaultClient;
  }, [currentClient, isEdit]);

  const methods = useForm({
    resolver: yupResolver(NewClientSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = methods;
  const handleCancel = () => {
    navigate('/dashboard/client');
  };


  const onSubmit = useCallback(
    async (data) => {
      try {
        console.log('Submitting data:', data);

        if (isEdit && currentClient) {
          await axios.put(`http://localhost:4000/client/edit/${currentClient._id}`, data);
          enqueueSnackbar('Update success!', { variant: 'success', autoHideDuration: 3000 });
        } else {
          await axios.post('http://localhost:4000/client/add', data);
          enqueueSnackbar('Create success!', { variant: 'success', autoHideDuration: 3000 });
        }

        reset();
        navigate('/dashboard/client');
      } catch (error) {
        enqueueSnackbar('An error occurred.', { variant: 'error', autoHideDuration: 3000 });
        console.error(error);
      }
    },
    [reset, enqueueSnackbar, navigate, isEdit, currentClient]
  );

  const [clientGroupOptions, setClientGroupOptions] = useState([]);

  useEffect(() => {
    async function getClientGroups() {

      try {
        const response = await axios.get('http://localhost:4000/company/companies');
        const options = response.data.map((clientGroup) => ({
          value: clientGroup._id,
          label: clientGroup.name,
        }));
        setClientGroupOptions(options);
      } catch (error) {
        console.error(error);
      }
    }
    getClientGroups();
  }, []);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} id="add-client-form">
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
                      name="client_First_Name"
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
                      name="client_Last_Name"
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
                    <RHFTextField name="client_Mail" required fullWidth control={control} />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 5 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Company
                    </Typography>
                    <Controller
                      name="clientGroupId"
                      control={control}
                      render={({ field }) => (
                        <RHFSelect {...field} label="Company" required variant="outlined" fullWidth>
                          <option value="" />
                          {clientGroupOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </RHFSelect>
                      )}
                    />
                    <Typography variant="caption" sx={{ mt: 1 }}>
                      Please select a client group from the options above.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button variant="contained" color="primary" type="submit" form="add-client-form">
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
