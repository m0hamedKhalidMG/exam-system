import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setProfile, addProfile } from '../redux/studentSlice';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const StudentRegistration = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    id: Date.now(),
    name: '',
    email: '',
    phone: '',
    age: '',
    country: '',
    state: '',
    password: '',
  });

  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = t('studentRegistration.errors.name');
    if (!formData.email || !/^[\w-\.]+@[\w-]+\.[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = t('studentRegistration.errors.email');
    }
    if (!formData.phone || !/^\+?[1-9]\d{9,14}$/.test(formData.phone)) {
      newErrors.phone = t('studentRegistration.errors.phone');
    }
    if (!formData.age || isNaN(formData.age) || formData.age < 7 || formData.age > 100) {
      newErrors.age = t('studentRegistration.errors.age');
    }
    if (!formData.country) newErrors.country = t('studentRegistration.errors.country');
    if (!formData.state) newErrors.state = t('studentRegistration.errors.state');
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = t('studentRegistration.errors.password');
    }
    if (!file) newErrors.file = t('studentRegistration.errors.file'); // Image required error
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append('username', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('name', formData.name);
        formDataToSend.append('age', formData.age);
        formDataToSend.append('country', formData.country);
        formDataToSend.append('province', formData.state);
        formDataToSend.append('whatsappNumber', formData.phone);
        formDataToSend.append('image', file);

        const response = await axios.post(
          'https://exam-server-psi.vercel.app/api/auth/register',
          formDataToSend,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        if (response.status === 201) {
          localStorage.setItem('token', response.data.token);
          const userInfo = {
            id: response.data.user.id,
            username: response.data.user.username,
            role: response.data.user.role,
          };
          localStorage.setItem('userInfo', JSON.stringify(userInfo));

          dispatch(addProfile(formData));
          dispatch(setProfile(formData));
          navigate('/whatsapp-group');
        } else {
          console.error('Registration failed:', response.data);
        }
      } catch (error) {
        console.error('Error during registration:', error);
      }
    }
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <CardContent>
          <Typography variant="h4" align="center" style={styles.title}>
            {t('studentRegistration.title')}
          </Typography>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div style={styles.uploadButton}>
              <input
                accept="image/*"
                id="upload-button"
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <label htmlFor="upload-button">
                <IconButton component="span" color="primary">
                  <PhotoCamera />
                </IconButton>
              </label>
              {file ? (
                <Typography>{file.name}</Typography>
              ) : (
                <Typography style={styles.errorText}>{errors.file}</Typography>
              )}
            </div>

            {['name', 'email', 'phone', 'age', 'country', 'state'].map((field) => (
              <TextField
                key={field}
                label={t(`studentRegistration.fields.${field}`)}
                name={field}
                fullWidth
                value={formData[field]}
                onChange={handleChange}
                error={!!errors[field]}
                helperText={errors[field]}
                style={styles.input}
                {...(field === 'phone' && { placeholder: 'أكتب الرقم مع مفتاح الدولة' })}
              />
            ))}
            <TextField
              label={t('studentRegistration.fields.password')}
              name="password"
              type="password"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              style={styles.input}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={styles.button}
            >
              {t('studentRegistration.registerButton')}
            </Button>
            <Typography
              align="center"
              style={styles.loginLink}
              onClick={() => navigate('/login')}
            >
              {t('studentRegistration.loginLink')}
            </Typography>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const styles = {
  container: {
    background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.9), rgba(37, 206, 209, 0.8))',
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
  loginLink: {
    marginTop: '15px',
    color: '#1565c0',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  uploadButton: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  errorText: {
    color: 'red',
    fontSize: '0.8rem',
    marginTop: '5px',
  },
};

export default StudentRegistration;
