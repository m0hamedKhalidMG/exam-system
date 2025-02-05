import React, { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  TextField,
  Button,
  IconButton,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../redux/studentSlice';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
const StudentProfile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [profile, setProfile] = useState(null); // Profile fetched from backend
  const [editMode, setEditMode] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState(null);
  const [profilePic, setProfilePic] = useState('');

  // Fetch user profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get token from local storage
        const token = localStorage.getItem('token');
        
        // Fetch user profile
        const response = await axios.get('https://exam-server-psi.vercel.app/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userProfile = response.data.user;
        setProfile(userProfile);
        setUpdatedProfile(userProfile);
     setProfilePic(userProfile.profileImage || '');
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile({ ...updatedProfile, [name]: value });
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        setProfilePic(reader.result); // Display the uploaded image
        const token = localStorage.getItem('token'); // Get token from localStorage

        // Prepare the image for uploading
        const formData = new FormData();
        formData.append('image', file);

        try {
          const response = await axios.put(
            `https://exam-server-psi.vercel.app/api/user/update-profile-image/${profile._id}`, 
            formData, 
            {
              headers: {
                'Authorization': `Bearer ${token}`, // Send Bearer token for authentication
                'Content-Type': 'multipart/form-data', // Tell the server that we're sending a file
              }
            }
          );
          setProfilePic(response.data.imageUrl);
          dispatch(
            updateProfile({
              id: profile.id,
              updatedData: { ...updatedProfile, profilePic },
            })
          );
          setProfile(updatedProfile);
          
          //console.log('Image uploaded successfully:', response.data);
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSave = async () => {
    
    try {
      const token = localStorage.getItem('token');

      await axios.put(
        `https://exam-server-psi.vercel.app/api/user/user_update/${profile._id}`,
        {
          ...updatedProfile,
          profilePic,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //console.log(profilePic)
      dispatch(
        updateProfile({
          id: profile.id,
          updatedData: { ...updatedProfile, profilePic },
        })
      );
      setProfile(updatedProfile);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!profile) {
    return (
      <Typography
        align="center"
        style={{ marginTop: '20px', color: 'red', fontWeight: 'bold' }}
      >
        {t('studentProfile.noProfileFound')}
      </Typography>
    );
  }

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} align="center">
              <Avatar
                src={profilePic}
                style={styles.avatar}
                alt={profile.name.charAt(0).toUpperCase()}
              />
              {editMode && (
                <div style={styles.uploadButton}>
                  <input
                    accept="image/*"
                    id="upload-button"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleProfilePicChange}
                  />
                  <label htmlFor="upload-button">
                    <IconButton component="span" color="primary">
                      <PhotoCamera />
                    </IconButton>
                  </label>
                </div>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4" align="center" style={styles.title}>
                {editMode
                  ? t('studentProfile.editTitle')
                  : t('studentProfile.viewTitle')}
              </Typography>
            </Grid>
            {['name', 'age', 'country', 'province', 'whatsappNumber'].map(
              (field) => (
                <Grid item xs={12} sm={6} key={field}>
                  {editMode ? (
                    <TextField
                      fullWidth
                      label={t(`studentProfile.fields.${field}`)}
                      name={field}
                      value={updatedProfile[field]}
                      onChange={handleInputChange}
                      variant="outlined"
                      style={styles.input}
                    />
                  ) : (
                    <Typography variant="h6" style={styles.infoText}>
                      <strong>{t(`studentProfile.fields.${field}`)}:</strong>{' '}
                      {profile[field]}
                    </Typography>
                  )}
                </Grid>
              )
            )}
            <Grid item xs={12} align="center">
              {editMode ? (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    style={styles.button}
                    onClick={handleSave}
                  >
                    {t('studentProfile.saveButton')}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    style={styles.button}
                    onClick={() => {
                      setEditMode(false);
                      setUpdatedProfile(profile);
                      setProfilePic(profile?.profilePic || '');
                    }}
                  >
                    {t('studentProfile.cancelButton')}
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  style={styles.button}
                  onClick={() => setEditMode(true)}
                >
                  {t('studentProfile.editButton')}
                </Button>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};

const styles = {
  container: {
    background: 'linear-gradient(135deg, #1e88e5, #03a9f4)',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  card: {
    maxWidth: '800px',
    width: '100%',
    background: '#fff',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    padding: '30px',
  },
  avatar: {
    width: '120px',
    height: '120px',
    fontSize: '40px',
    backgroundColor: '#1565c0',
    color: '#fff',
    marginBottom: '10px',
  },
  uploadButton: {
    marginTop: '10px',
  },
  title: {
    fontWeight: 'bold',
    color: '#1565c0',
    marginBottom: '20px',
  },
  input: {
    marginBottom: '15px',
  },
  infoText: {
    marginBottom: '10px',
    color: '#333',
  },
  button: {
    margin: '10px',
    padding: '10px 20px',
    fontWeight: 'bold',
  },
};

export default StudentProfile;
