import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setProfile } from '../redux/studentSlice';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { loginStudent } from '../redux/studentSlice';  // Import the loginStudent action

const StudentLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async () => {
    try {
      // Send login request to the backend
      const response = await axios.post('https://exam-server-psi.vercel.app/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });
//console.log(response)
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        const userInfo = {
          id: response.data.user.id,
          username: response.data.user.username,
          role: response.data.user.role,
        };
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        localStorage.setItem('token', response.data.token); // Save token to localStorage
        dispatch(loginStudent(response.data.user));

        navigate('/level-selection'); // Redirect to level selection page
      } else {
        setError(t('studentLogin.invalidCredentials')); // Set error message if no profile found
      }
    } catch (err) {
      setError(t('studentLogin.loginError')); // Handle login errors (e.g., network issues)
      console.error('Login error:', err);
    }
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <CardContent>
          <Typography variant="h4" align="center" style={styles.title}>
            {t('studentLogin.title')}
          </Typography>
          <TextField
            label={t('studentLogin.email')}
            name="email"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            error={!!error}
            style={styles.input}
          />
          <TextField
            label={t('studentLogin.password')}
            name="password"
            type="password"
            fullWidth
            value={formData.password}
            onChange={handleChange}
            error={!!error}
            helperText={error}
            style={styles.input}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
            style={styles.button}
          >
            {t('studentLogin.loginButton')}
          </Button>
          <Typography
            align="center"
            style={styles.registerLink}
            onClick={() => navigate('/register')}
          >
            {t('studentLogin.registerPrompt')}
          </Typography>
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
    maxWidth: '400px',
    width: '100%',
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '10px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
    padding: '30px',
  },
  title: {
    fontWeight: 'bold',
    color: '#1565c0',
  },
  input: {
    marginBottom: '20px',
  },
  button: {
    marginTop: '10px',
    backgroundColor: '#1565c0',
    color: '#fff',
  },
  registerLink: {
    marginTop: '15px',
    color: '#1565c0',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default StudentLogin;
