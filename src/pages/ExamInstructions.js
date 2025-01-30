import React from 'react';
import { Typography, Button, Card, CardContent } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
const ExamInstructions = () => {
  const { t } = useTranslation(); // Translation hook
  const navigate = useNavigate();
  const location = useLocation();
  const level = location.state?.level || 'A';
  const exams = useSelector((state) => state.admin.exams);
  const selectedExam = exams.find((exam) => exam.class === level);
  const Age = selectedExam.ageGroup;
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // Get duration from the selected exam
  const duration = selectedExam ? selectedExam.timer : null;

  const instructions = [
    t('examInstructions.levelInfo', { level }),
    t('examInstructions.duration', {
      duration: duration
        ? `${duration} ${t('examInstructions.minutes')}`
        : t('examInstructions.notSpecified'),
    }),
    t('examInstructions.quietEnvironment'),
    t('examInstructions.readQuestions'),
    t('examInstructions.navigateQuestions'),
    t('examInstructions.noChangesAfterSubmit'),
    t('examInstructions.scoreDisplayed'),
  ];
  const token = localStorage.getItem('token');

  // const handleStartExam = () => {
  //   navigate('/exam', { state: { level,Age } });
  // };
  const handleStartExam = async () => {
    try {
      // API call to start the exam
      const response = await axios.post('https://exam-server-psi.vercel.app/api/exam/start', {
        userId: userInfo.id, // Replace with the actual user ID (from state or Redux)
        examId: selectedExam._id, // Replace with the selected exam ID
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Backend returns the `StudentExam` entry
      const { studentExam } = response.data;
  
      // Navigate to the exam page with necessary data
      navigate('/exam', {
        state: {
          level,
          Age,
          startTime: studentExam.startTime,
          endTime: studentExam.endTime,
          studentExamId: studentExam._id,
        },
      });
    } catch (error) {
      console.error('Failed to start exam:', error);
      console.log(error.response.data.message)
      if (error.response.data.message === "You have already started this exam.") {
        alert( "You have already started this exam.");}
        else
      alert('Unable to start the exam. Please try again.');
    }
  };
  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <CardContent>
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            style={styles.title}
          >
            {t('examInstructions.title')}
          </Typography>
          <ul style={styles.list}>
            {instructions.map((instruction, index) => (
              <li key={index} style={styles.item}>
                {instruction}
              </li>
            ))}
          </ul>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleStartExam}
            style={styles.button}
          >
            {t('examInstructions.startButton')}
          </Button>
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
  },
  title: {
    fontWeight: 'bold',
    color: '#1565c0',
    marginBottom: '15px',
  },
  list: {
    listStyleType: 'disc',
    paddingLeft: '20px',
    marginBottom: '20px',
  },
  item: {
    marginBottom: '10px',
    fontSize: '16px',
    color: '#333',
  },
  button: {
    fontWeight: 'bold',
    backgroundColor: '#1565c0',
    color: '#fff',
    borderRadius: '25px',
    padding: '12px 24px',
    transition: 'background 0.3s, transform 0.3s',
    '&:hover': {
      backgroundColor: '#0d47a1',
      transform: 'scale(1.05)',
    },
  },
};

export default ExamInstructions;
