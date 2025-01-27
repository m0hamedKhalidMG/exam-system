import React from 'react';
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
import { InputLabel, FormControl } from "@mui/material";

import { Menu as MenuIcon } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutAdmin } from '../redux/adminSlice';
import { logoutStudent } from '../redux/studentSlice';
import { useTranslation } from 'react-i18next';
import logo from '../assets/logooo.png';

const Navbar = () => {
  const { t, i18n } = useTranslation(); // Translation hook

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
        <Toolbar style={styles.toolbar}>
          <Box style={styles.logoContainer}>
            <img src={logo} alt={t('navbar.title')} style={styles.logo} />
          </Box>
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
                    {/* <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        handleHistoryClick();
                      }}
                    >
                      {t('navbar.history')}
                    </MenuItem> */}
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
                  {/* <Button
                    style={styles.historyButton}
                    onClick={handleHistoryClick}
                  >
                    {t('navbar.history')}
                  </Button> */}
                  <Typography style={styles.name}>
                    {studentProfile.username}
                  </Typography>
                  <Avatar
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
    backgroundColor: "#f5f5f5", // Light background
    borderRadius: "8px",
    fontSize: "14px",
    color: "#333",
  },
  navbar: { backgroundColor: '#1565c0' },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyButton: {
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'none',
  },
  logoContainer: { flex: 0, display: 'flex', alignItems: 'center' },
  logo: { height: '50px', objectFit: 'contain', marginRight: '15px' },
  rightSection: { display: 'flex', alignItems: 'center', gap: '15px' },
  name: { fontSize: '16px', color: '#fff' },
  avatar: { cursor: 'pointer', backgroundColor: '#ffffff', color: '#1565c0' },
  logoutButton: { color: '#fff', fontWeight: 'bold' },
  languageSelector: { marginLeft: 'auto', color: '#fff' },
};

export default Navbar;
