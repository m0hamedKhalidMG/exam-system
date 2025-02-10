import React,{useState,useEffect} from 'react';
import { Typography, Button, Grid, Card, CardContent, CardMedia,Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import  axios from 'axios'
import Footer from './../components/Footer';
const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // Determine admin and student status
  const adminLoggedIn = userInfo?.role === 'admin';
  const studentProfile = userInfo?.role === 'user' ? userInfo : null;
  const [images, setImages] = useState({ adminBg: '', userBg: '' });

  useEffect(() => {
    axios.get('https://exam-server-psi.vercel.app/api/user/getimages')
      .then(response => {
        setImages(response.data);
      })
      .catch(error => {
        console.error('Error fetching images:', error);
      });
  }, []);
  return (
    <div style={styles.container}>
      <div style={styles.heroSection}>
        <Typography variant="h2" align="center" style={styles.title}>
          {/* {t('homePage.welcomeTitle')} */}
          أطلق العِنان لإمكانات إبنك 

        </Typography>
        <Box style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px' }}>
  <Typography variant="h6" align="center" style={{ fontWeight: 'bold', color: 'black' }}>
    تعلم من المنزل من خلال برامج التعلم المتطورة لدينا إلى جانب أفضل المعلمين
  </Typography>
</Box>

       
      </div>
      <Grid container spacing={4} justifyContent="center" style={styles.grid}>
        {adminLoggedIn ? (
          <Grid item xs={12} md={5}>
            <Card style={styles.card}>
              <CardMedia
                component="img"
                height="200"
                image="/images/admin.png" // Replace with your admin image URL
                alt="Admin"
              />
              <CardContent>
                <Typography
                  variant="h5"
                  align="center"
                  style={styles.cardTitle}
                >
                  {t('homePage.adminWelcome')}
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  style={styles.cardText}
                >
                  {t('homePage.adminDescription')}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/admin-hub')}
                  style={styles.button}
                >
                  {t('homePage.adminButton')}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ) : studentProfile ? (
          <Grid item xs={12} md={5}>
            <Card style={styles.card}>
              <CardMedia
                component="img"
                height="200"
                image={images.userBg}
                alt="Student"
              />
              <CardContent>
                <Typography
                  variant="h5"
                  align="center"
                  style={styles.cardTitle}
                >
                  {t('homePage.studentReady')}
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  style={styles.cardText}
                >
                  {t('homePage.studentDescription')}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/Categories')}
                  style={styles.button}
                >
                  {t('homePage.studentButton')}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          <>
            <Grid item xs={12} md={5}>
              <Card style={styles.card}>
                <CardMedia
                  component="img"
                  height="200"
                  image={images.adminBg}
                  alt="Admin Access"
                />
                <CardContent>
                  <Typography
                    variant="h5"
                    align="center"
                    style={styles.cardTitle}
                  >
                    {t('homePage.adminAccessTitle')}
                  </Typography>
                  <Typography
                    variant="body1"
                    align="center"
                    style={styles.cardText}
                  >
                    {t('homePage.adminAccessDescription')}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate('/admin-login')}
                    style={styles.button}
                  >
                    {t('homePage.adminAccessButton')}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card style={styles.card}>
                <CardMedia
                  component="img"
                  height="200"
                  image={images.userBg}

                  alt="Student Hub"
                />
                <CardContent>
                  <Typography
                    variant="h5"
                    align="center"
                    style={styles.cardTitle}
                  >
                    {t('homePage.studentHubTitle')}
                  </Typography>
                  <Typography
                    variant="body1"
                    align="center"
                    style={styles.cardText}
                  >
                    {t('homePage.studentHubDescription')}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate('/register')}
                    style={styles.button}
                  >
                    {t('homePage.studentHubButton')}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>
      
      <Footer />

    </div>
    
  );
};

const styles = {
  container: {
    background:
      'linear-gradient(135deg, rgba(0, 98, 204, 0.8), rgba(37, 206, 209, 0.8))',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  heroSection: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontWeight: 'bold',
    color: '#ffffff',
    textShadow: '3px 3px 8px rgba(0, 0, 0, 0.5)',
    marginBottom: '10px',
  },
  subtitle: {
    color: '#e3f2fd',
    fontWeight: '300',
    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)',
    marginBottom: '30px',
  },
  grid: {
    width: '90%',
  },
  card: {
    background: 'rgb(248, 248, 248)',
    backdropFilter: 'blur(12px)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '20px',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4)',
    },
  },
  cardTitle: {
    fontWeight: '500',
    color: '#1565c0',
    marginBottom: '10px',
  },
  cardText: {
    color: '#1565c0',
    marginBottom: '20px',
    fontSize: '1rem',
  },
  button: {
    fontWeight: 'bold',
    backgroundColor: '#1565c0',
    color: '#fff',
    borderRadius: '25px',
    padding: '10px 20px',
    transition: 'background 0.3s ease, transform 0.3s ease',
    '&:hover': {
      backgroundColor: '#0d47a1',
      transform: 'scale(1.05)',
    },
  },
};

export default HomePage;