import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginAdmin } from '../redux/adminSlice';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const AdminLogin = () => {
  const { t } = useTranslation(); // Translation hook
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.admin.isLoggedIn);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(false);

  if (isLoggedIn) {
    navigate('/admin-hub'); // Redirect if already logged in
    return null;
  }

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://exam-server-psi.vercel.app/api/auth/login', credentials);
      
      if (response.status === 200&&response.data.user.role=='admin') {
        // Save admin information in Redux
        localStorage.setItem('token', response.data.token);
const role=response?.data.user.role||'null'
        // Store admin data in localStorage
        localStorage.setItem('userInfo', JSON.stringify({ role}));
if(role==='admin'){
        navigate('/admin-hub');}
      } else {
        alert("you have not premession to acess this page")
        setError(true);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError(true);
    }
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <CardContent>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            style={styles.title}
          >
            {t('adminLogin.title')}
          </Typography>
          {error && (
            <Typography color="error" align="center">
              {t('adminLogin.invalidCredentials')}
            </Typography>
          )}
          <TextField
            label={t('adminLogin.username')}
            fullWidth
            value={credentials.email}
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
            style={styles.input}
          />
          <TextField
            label={t('adminLogin.password')}
            type="password"
            fullWidth
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            style={styles.input}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
            style={styles.button}
          >
            {t('adminLogin.loginButton')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const styles = {
  container: {
    background:
      'linear-gradient(135deg, rgba(25, 118, 210, 0.9), rgba(37, 206, 209, 0.8))',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    width: '400px',
    padding: '20px',
    textAlign: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#ffffff',
    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)',
  },
  input: {
    marginBottom: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '5px',
  },
  button: {
    fontWeight: 'bold',
    backgroundColor: '#1565c0',
    color: '#fff',
    borderRadius: '25px',
    padding: '10px 20px',
    transition: 'background 0.3s, transform 0.3s',
    '&:hover': {
      backgroundColor: '#0d47a1',
      transform: 'scale(1.1)',
    },
  },
};

export default AdminLogin;
