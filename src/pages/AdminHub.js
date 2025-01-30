import React from 'react';
import { Typography, Card, CardContent, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StarIcon from '@mui/icons-material/Star';
import BarChartIcon from '@mui/icons-material/BarChart';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const AdminHub = () => {
  const { t } = useTranslation(); // Translation hook
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div style={styles.container}>
      <Typography variant="h3" align="center" style={styles.title}>
        {t('adminHub.welcome')}
      </Typography>
      <Typography variant="h5" align="center" style={styles.subtitle}>
        {t('adminHub.prompt')}
      </Typography>
      <Grid container spacing={4} justifyContent="center" style={styles.grid}>
        <Grid item xs={12} md={4}>
          <Card style={styles.card}>
            <CardContent>
              <div style={styles.iconWrapper}>
                <DashboardIcon style={styles.icon} />
              </div>
              <Typography variant="h6" align="center" style={styles.cardTitle}>
                {t('adminHub.manageDashboard')}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleNavigate('/admin')}
                style={styles.button}
              >
                {t('adminHub.goToDashboard')}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card style={styles.card}>
            <CardContent>
              <div style={styles.iconWrapper}>
                <StarIcon style={styles.icon} />
              </div>
              <Typography variant="h6" align="center" style={styles.cardTitle}>
                {t('adminHub.viewBestStudents')}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleNavigate('/best-students')}
                style={styles.button}
              >
                {t('adminHub.viewBestStudents')}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card style={styles.card}>
            <CardContent>
              <div style={styles.iconWrapper}>
                <BarChartIcon style={styles.icon} />
              </div>
              <Typography variant="h6" align="center" style={styles.cardTitle}>
                {t('adminHub.viewStudentsAndCharts')}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleNavigate('/view-students')}
                style={styles.button}
              >
                {t('adminHub.viewStudentsAndCharts')}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card style={styles.card}>
            <CardContent>
              <div style={styles.iconWrapper}>
                <CloudUploadIcon style={styles.icon} />
              </div>
              <Typography variant="h6" align="center" style={styles.cardTitle}>
                {t('adminHub.uploadImage')}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleNavigate('/upload-image')}
                style={styles.button}
              >
                {t('adminHub.uploadImage')}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

const styles = {
  container: {
    background:
      'linear-gradient(135deg, #1E88E5, #6AB7FF)',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '30px 20px',
  },
  title: {
    fontWeight: 700,
    color: '#fff',
    marginBottom: '20px',
    letterSpacing: '1px',
    textShadow: '2px 2px 5px rgba(0, 0, 0, 0.4)',
  },
  subtitle: {
    color: '#e3f2fd',
    marginBottom: '40px',
    fontSize: '1.2rem',
  },
  grid: {
    width: '100%',
    maxWidth: '1000px',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
    padding: '20px',
    textAlign: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    height: '300px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',
    },
  },
  iconWrapper: {
    margin: '0 auto',
    backgroundColor: '#f5f5f5',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '15px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  icon: {
    fontSize: '2.5rem',
    color: '#1E88E5',
  },
  cardTitle: {
    fontWeight: 600,
    color: '#424242',
    marginBottom: '20px',
    fontSize: '1.2rem',
  },
  button: {
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: '#1E88E5',
    color: '#fff',
    marginTop: '10px',
    padding: '10px 20px',
    textTransform: 'capitalize',
    borderRadius: '20px',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#1565c0',
    },
  },
};

export default AdminHub;
