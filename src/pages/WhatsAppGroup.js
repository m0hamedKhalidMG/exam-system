import React from 'react';
import { Typography, Card, CardContent, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const WhatsAppGroup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleJoinGroup = () => {
    // Redirect to the WhatsApp group link
    window.open(
      'https://chat.whatsapp.com/BOdJl7oXah597SnENWH6PL', // Replace with your actual WhatsApp group link
      '_blank'
    );
  };

  const handleContinue = () => {
    navigate('/Categories'); // Navigate to the next page
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <CardContent>
          <Typography variant="h4" align="center" style={styles.title}>
            {t('whatsappGroup.title')}
          </Typography>
          <Typography variant="body1" align="center" style={styles.subtitle}>
            {t('whatsappGroup.subtitle')}
          </Typography>
          <Box style={styles.buttonContainer}>
            <Button
              onClick={handleJoinGroup}
              variant="contained"
              color="primary"
              style={styles.button}
            >
              {t('whatsappGroup.joinButton')}
            </Button>
            <Button
              onClick={handleContinue}
              variant="outlined"
              color="primary"
              style={styles.buttonOutlined}
            >
              {t('whatsappGroup.continueButton')}
            </Button>
          </Box>
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
    maxWidth: '500px',
    width: '100%',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
    padding: '30px',
  },
  title: {
    fontWeight: 'bold',
    color: '#1565c0',
    marginBottom: '20px',
  },
  subtitle: {
    color: '#555',
    marginBottom: '20px',
    lineHeight: '1.5',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
    marginTop: '20px',
  },
  button: {
    backgroundColor: '#1565c0',
    color: '#fff',
    padding: '10px 20px',
    flexGrow: 1,
    '&:hover': {
      backgroundColor: '#0d47a1',
    },
  },
  buttonOutlined: {
    flexGrow: 1,
    padding: '10px 20px',
    border: '2px solid #1565c0',
    color: '#1565c0',
    '&:hover': {
      backgroundColor: '#f1f8ff',
    },
  },
};

export default WhatsAppGroup;
