import React, { useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  Select,
} from '@mui/material';
import { WhatsApp } from '@mui/icons-material';

import { InputLabel, FormControl } from "@mui/material";
import { Menu as MenuIcon } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutAdmin } from '../redux/adminSlice';
import { logoutStudent } from '../redux/studentSlice';
import { useTranslation } from 'react-i18next';
import logo from '../assets/logooo.png'; // Ensure the logo path is correct
import { useSelector } from 'react-redux';

const Navbar = () => {
  const { t, i18n } = useTranslation(); // Translation hook
  const profile = useSelector((state) => state.student.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [menuAnchor, setMenuAnchor] = React.useState(null);

  // Get user data from localStorage
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // Determine admin and student status
  const adminLoggedIn = userInfo?.role === 'admin';
  const studentProfile = userInfo?.role === 'user' ? userInfo : null;

  const handleLogout = () => {
    if (adminLoggedIn) {
      dispatch(logoutAdmin());
    } else if (studentProfile) {
      dispatch(logoutStudent());
    }
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo'); // Clear localStorage
    navigate('/');
  };

  const handleAvatarClick = () => {
    navigate('/profile');
  };

  const handleHistoryClick = () => {
    navigate('/history');
  };

  const handleHomeClick = () => {
    navigate('/');
    handleMenuClose();
  };

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  return (
    <>
      {/* This Toolbar is invisible but ensures spacing */}
      <Toolbar />

      <AppBar position="fixed" style={styles.navbar}>
      <Toolbar>
        {/* Logo and other content */}
        <Box style={styles.logoContainer}>
            <img
              src={logo}
              alt={t('navbar.title')}
              style={styles.logo}
            />

          {/* WhatsApp Icon as a link */}
          <a href="https://wa.me/message/BE6N3ZPIZO5PL1" target="_blank" rel="noopener noreferrer">
            <IconButton>
              <WhatsApp style={{ color: '#25D366' }} />
            </IconButton>
          </a>
        </Box>
          {/* Middle Text */}
          <Typography variant="h6" style={styles.middleText}>
            التعليم المبرمج - الحساب الذهني
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuOpen}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
              >
                {adminLoggedIn && (
                  <>
                    <MenuItem onClick={handleMenuClose}>{t('navbar.admin')}</MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        handleLogout();
                      }}
                    >
                      {t('navbar.logout')}
                    </MenuItem>
                  </>
                )}
                {studentProfile && (
                  <>
                    <MenuItem onClick={handleHomeClick}>{t('navbar.home')}</MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                      {studentProfile.username}
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        handleAvatarClick();
                      }}
                    >
                      {t('navbar.profile')}
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        handleLogout();
                      }}
                    >
                      {t('navbar.logout')}
                    </MenuItem>
                  </>
                )}
                <FormControl style={styles.formControl}>
                  <Select
                    value={i18n.language || ""}
                    onChange={(e) => changeLanguage(e.target.value)}
                    style={styles.select}
                    displayEmpty
                  >
                    <MenuItem value="en">{t("navbar.english")}</MenuItem>
                    <MenuItem value="ar">{t("navbar.arabic")}</MenuItem>
                  </Select>
                </FormControl>
              </Menu>
            </>
          ) : (
            <Box style={styles.rightSection}>
              {adminLoggedIn && (
                <>
                  <Typography style={styles.name}>{t('navbar.admin')}</Typography>
                  <Avatar style={styles.avatar}>A</Avatar>
                  <Button style={styles.logoutButton} onClick={handleLogout}>
                    {t('navbar.logout')}
                  </Button>
                </>
              )}
              {studentProfile && (
                <>
                  <Button style={styles.historyButton} onClick={handleHomeClick}>
                    {t('navbar.home')}
                  </Button>
                  <Typography style={styles.name}>
                    {studentProfile.username}
                  </Typography>
                  <Avatar
                    src={profile?.profileImage}
                    style={styles.avatar}
                    onClick={handleAvatarClick}
                  >
                    {studentProfile.username[0]}
                  </Avatar>
                  <Button
                    style={styles.logoutButton}
                    onClick={handleLogout}
                  >
                    {t('navbar.logout')}
                  </Button>
                </>
              )}
              <Select
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
                style={styles.languageSelector}
              >
                <MenuItem value="en">{t('navbar.english')}</MenuItem>
                <MenuItem value="ar">{t('navbar.arabic')}</MenuItem>
              </Select>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

const styles = {
  formControl: {
    minWidth: "20px",
    marginBottom: "16px",
  },
  select: {
    padding: "5px",
    backgroundColor: "#000", // Light background
    borderRadius: "8px",
    fontSize: "14px",
    color: "#333",
  },
  navbar: {
    background: '#FFFFFF', // Set navbar background to white
    color: '#000000', // Ensure text is visible on a white background
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Optional shadow for better visibility
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 16px', // Add padding to the toolbar
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    flex: 1, // Allows it to take space
  },
  logo: {
    height: '80px', // Increase height
    width: 'auto', // Maintain aspect ratio
    maxWidth: '180px', // Ensure it doesn't get too big
    objectFit: 'contain', // Ensures proper fitting
  },
  middleText: {
    flex: 9, // Takes up remaining space
    textAlign: 'center', // Centers the text
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#000',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  name: {
    fontSize: '16px',
    color: '#000',
  },
  avatar: {
    cursor: 'pointer',
    backgroundColor: '#000',
    color: '#1565c0',
  },
  logoutButton: {
    color: '#000',
    fontWeight: 'bold',
  },
  languageSelector: {
    marginLeft: 'auto',
    color: '#000',
  },
  whatsappLink: {
    position: 'absolute',
    top: '50%',
    left: '10%',
    transform: 'translate(-50%, -50%)',
    zIndex: -1, // Puts the icon behind the logo
  },
  whatsappIcon: {
    fontSize: '60px', // Adjust the icon size as needed
    color: '#25D366', // WhatsApp green color
  },
};

export default Navbar;