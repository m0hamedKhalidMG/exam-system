import React from 'react';
import { Typography, Button, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const studentProfile = useSelector((state) => state.student.profile);
  const adminLoggedIn = useSelector((state) => state.admin.isLoggedIn);

  return (
    <div style={styles.container}>
      <div style={styles.heroSection}>
        <Typography variant="h2" align="center" style={styles.title}>
          {t('homePage.welcomeTitle')}
        </Typography>
        <Typography variant="h5" align="center" style={styles.subtitle}>
          {t('homePage.welcomeSubtitle')}
        </Typography>
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
                image="https://firebasestorage.googleapis.com/v0/b/sec-project-368ee.appspot.com/o/12bd1558-9da8-4f24-9b1a-eacec172fba2.jpg?alt=media&token=4ed8e252-4096-4365-b552-c3d582d18f98" // Replace with your student image URL
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
                  onClick={() => navigate('/level-selection')}
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
  <Card
    style={{
      borderRadius: '20px',
      boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'scale(1.05)';
      e.currentTarget.style.boxShadow = '0px 12px 20px rgba(0, 0, 0, 0.2)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.boxShadow = '0px 8px 15px rgba(0, 0, 0, 0.1)';
    }}
  >
    <CardMedia
      component="img"
      height="200"
      image="https://firebasestorage.googleapis.com/v0/b/sec-project-368ee.appspot.com/o/pexels-cottonbro-3201580.jpg?alt=media&token=a457eeac-82b6-415a-918d-24bd822e482e"
      alt="Admin Access"
      style={{
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        objectFit: 'cover',
      }}
    />
    <CardContent style={{ padding: '20px', textAlign: 'center' }}>
      <Typography
        variant="h5"
        style={{
          fontWeight: '600',
          marginBottom: '10px',
          color: '#333',
        }}
      >
        {t('homePage.adminAccessTitle')}
      </Typography>
      <Typography
        variant="body1"
        style={{
          color: '#555',
          marginBottom: '20px',
        }}
      >
        {t('homePage.adminAccessDescription')}
      </Typography>
      <Button
        variant="contained"
        fullWidth
        onClick={() => navigate('/admin-login')}
        style={{
          backgroundColor: '#3f51b5',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: '10px',
          fontWeight: 'bold',
          textTransform: 'none',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = '#2e3c9a')
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = '#3f51b5')
        }
      >
        {t('homePage.adminAccessButton')}
      </Button>
    </CardContent>
  </Card>
</Grid>

<Grid item xs={12} md={5}>
  <Card
    style={{
      borderRadius: '20px',
      boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'scale(1.05)';
      e.currentTarget.style.boxShadow = '0px 12px 20px rgba(0, 0, 0, 0.2)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.boxShadow = '0px 8px 15px rgba(0, 0, 0, 0.1)';
    }}
  >
    <CardMedia
      component="img"
      height="200"
      image="https://firebasestorage.googleapis.com/v0/b/sec-project-368ee.appspot.com/o/pexels-julia-m-cameron-4143800.jpg?alt=media&token=2da6545b-b470-4992-971c-e3a8cb3cb983"
      alt="Student Hub"
      style={{
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        objectFit: 'cover',
      }}
    />
    <CardContent style={{ padding: '20px', textAlign: 'center' }}>
      <Typography
        variant="h5"
        style={{
          fontWeight: '600',
          marginBottom: '10px',
          color: '#333',
        }}
      >
        {t('homePage.studentHubTitle')}
      </Typography>
      <Typography
        variant="body1"
        style={{
          color: '#555',
          marginBottom: '20px',
        }}
      >
        {t('homePage.studentHubDescription')}
      </Typography>
      <Button
        variant="contained"
        fullWidth
        onClick={() => navigate('/register')}
        style={{
          backgroundColor: '#ff7043',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: '10px',
          fontWeight: 'bold',
          textTransform: 'none',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = '#e65c28')
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = '#ff7043')
        }
      >
        {t('homePage.studentHubButton')}
      </Button>
    </CardContent>
  </Card>
</Grid>

          </>
        )}
      </Grid>
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
    background: 'rgba(255, 255, 255, 0.1)',
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
    color: '#fff',
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
