import React from 'react';
import { Typography, Box } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      style={styles.footer}
    >
      <Typography variant="h6" align="center">
        مؤسس التعليم المبرمج الحساب الذهني في اليمن
        المدرب أواب الخضر
      </Typography>
    </Box>
  );
};

const styles = {
  footer: {
    color: '#ffffff', // Light gray background
    padding: '20px',
    marginTop: 'auto', // Pushes the footer to the bottom
    textAlign: 'center',
  },
};

export default Footer;