import React, { useState, useEffect } from 'react';
import { Typography, Button, Card, CardContent, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useLocation } from "react-router-dom";

import { useSelector, useDispatch } from 'react-redux';
import {
 
  loadExam
 
} from '../redux/adminSlice';
const LevelSelection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const { examId } = location.state || {};
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        const response = await axios.get(
          `http://localhost:5000/api/exam/Examsforstudent/${examId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add Bearer token to the headers
              'Content-Type': 'application/json', // Set content type
            },
          }
        );
        //console.log(response.data)
        setExams(response.data || []); // Adjust based on API response structure
        console.log(response.data)
  dispatch(loadExam(response.data));

        
      } catch (error) {
        console.error('Error fetching exams:', error);
        alert(t('levelSelection.errorFetchingExams'));
      }
    };

    fetchExams();
  }, [dispatch]);

  const handleAgeGroupSelection = (ageGroup) => {
    setSelectedAgeGroup(ageGroup);
    const filteredExamsAge = exams.filter(
      (exam) => exam.ageGroup === ageGroup
    );

    if (filteredExamsAge.length === 0) {
      return;
    }
    dispatch(loadExam(filteredExamsAge));
    //console.log(filteredExamsAge)
  };

  const handleLevelSelection = (level) => {
    const filteredExams = exams.filter(
      (exam) => exam.ageGroup === selectedAgeGroup && exam.class === level
    );

    if (filteredExams.length === 0) {
      alert(t('levelSelection.noExamsAlert'));
      return;
    }
    dispatch(loadExam(filteredExams));
    //console.log(filteredExams)
    navigate('/instructions', { state: { level, ageGroup: selectedAgeGroup } });
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <CardContent>
          <Typography variant="h4" align="center" style={styles.title}>
            {t('levelSelection.title')}
          </Typography>
          <Typography variant="body1" align="center" style={styles.subtitle}>
            {t('levelSelection.subtitle')}
          </Typography>

          {!selectedAgeGroup && (
            <>
              <Typography variant="h5" align="center" style={styles.stepTitle}>
                {t('levelSelection.step1')}
              </Typography>
              <Grid container spacing={3} justifyContent="center">
                {['7', '8-10', '10+'].map((ageGroup) => (
                  <Grid item xs={12} sm={4} key={ageGroup}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => handleAgeGroupSelection(ageGroup)}
                      style={styles.button}
                    >
                      {t(`levelSelection.ageGroup.${ageGroup}`)}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {selectedAgeGroup && (
            <>
              <Typography variant="h5" align="center" style={styles.stepTitle}>
                {t('levelSelection.step2')}
              </Typography>
              <Grid container spacing={3} justifyContent="center">
                {['A', 'B', 'C'].map((level) => (
                  <Grid item xs={12} sm={4} key={level}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => handleLevelSelection(level)}
                      style={styles.button}
                    >
                      {t('levelSelection.level')} {level}
                    </Button>
                  </Grid>
                ))}
              </Grid>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={() => setSelectedAgeGroup(null)}
                style={styles.backButton}
              >
                {t('levelSelection.back')}
              </Button>
            </>
          )}
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
    maxWidth: '600px',
    width: '100%',
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '10px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
    padding: '30px',
    textAlign: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#1565c0',
    marginBottom: '10px',
  },
  subtitle: {
    color: '#333',
    marginBottom: '20px',
  },
  stepTitle: {
    fontWeight: '500',
    color: '#1565c0',
    marginBottom: '15px',
  },
  button: {
    marginTop: '10px',
    backgroundColor: '#1565c0',
    color: '#fff',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '16px',
  },
  backButton: {
    marginTop: '20px',
    color: '#1565c0',
    borderColor: '#1565c0',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '16px',
  },
};

export default LevelSelection;
