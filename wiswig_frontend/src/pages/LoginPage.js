import { useState, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Link, Container, Typography, Divider, Stack, Button, TextField } from '@mui/material';
import useResponsive from '../hooks/useResponsive';
import Logo from '../components/logo';
import { useAuth } from '../context/AuthContext';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await login(mail, password);
    if (success) {
      console.log("isAuthenticated set to true");
      // Login successful, redirect user to page
      navigate('/dashboard/editor');
    } else {
      // Login failed, handle error
      console.error('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField label="Email address" value={mail} onChange={(event) => setMail(event.target.value)} />
        <TextField
          type="password"
          label="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button fullWidth size="large" type="submit" variant="contained">
          Sign in
        </Button>
      </Stack>
    </form>
  );
}

export default function LoginPage() {
  const mdUp = useResponsive('up', 'md');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/dashboard/products');
    return null;
  }

  return (
    <>
      <Helmet>
        <title> Login | Wiswig </title>
      </Helmet>

      <StyledRoot>
        <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        />

        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, Welcome Back
            </Typography>
            <img src="/assets/illustrations/illustration_login.png" alt="login" />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Sign in to Wiswig
            </Typography>

            {/*             <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                OR
              </Typography>
            </Divider> */}

            <LoginForm />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
