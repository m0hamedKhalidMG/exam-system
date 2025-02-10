import React, { useState ,useEffect} from 'react';
import {
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setProfile, addProfile } from '../redux/studentSlice';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { getStates, getCountries } from 'country-state-picker';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
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
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  useEffect(() => {
    setCountries(getCountries());
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'country') {
      setStates(getStates(value));
      setFormData((prev) => ({ ...prev, state: '' }));
    }
  };
  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone: value });
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
            email: response.data.user.email,

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

            <TextField
              label={t('studentRegistration.fields.name')}
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              style={styles.input}
            />
            <TextField
              label={t('studentRegistration.fields.email')}
              name="email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              style={styles.input}
            />
            
            {/* Age Dropdown */}
            <FormControl fullWidth style={styles.input}>
              <InputLabel>{t('studentRegistration.fields.age')}</InputLabel>
              <Select name="age" value={formData.age} onChange={handleChange}>
                {Array.from({ length: 8 }, (_, i) => i + 7).map((age) => (
                  <MenuItem key={age} value={age}>
                    {age}
                  </MenuItem>
                ))}
              </Select>
              {errors.age && <Typography color="error">{errors.age}</Typography>}
            </FormControl>

            {/* Phone Input with Country Code */}
            <PhoneInput
              country={'sa'}
              value={formData.phone}
              onChange={handlePhoneChange}
              inputStyle={{ width: '100%'}}
            />
            {errors.phone && <Typography color="error">{errors.phone}</Typography>}

            {/* Country Dropdown */}
            <FormControl fullWidth style={{ ...styles.input, ...styles.input2 }}>
            <InputLabel>{t('studentRegistration.fields.country')}</InputLabel>
              <Select name="country" value={formData.country} onChange={handleChange}>
                {countries.map((country) => (
                  <MenuItem key={country.code} value={country.code}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.country && <Typography color="error">{errors.country}</Typography>}
            </FormControl>

            {/* State Dropdown */}
            <FormControl fullWidth style={styles.input} disabled={!states.length}>
              <InputLabel>{t('studentRegistration.fields.state')}</InputLabel>
              <Select name="state" value={formData.state} onChange={handleChange}>
                {states.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </Select>
              {errors.state && <Typography color="error">{errors.state}</Typography>}
            </FormControl>

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
            <Button type="submit" variant="contained" color="primary" fullWidth style={styles.button}>
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
  input2: {
    marginTop: '20px',
    
    
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
