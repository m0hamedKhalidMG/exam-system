import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  TextField,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addExamToHistory } from '../redux/studentSlice';
import { useTranslation } from 'react-i18next';
import axios from "axios";

const ExamPage = () => {
  const { t } = useTranslation(); // Translation hook
  const exams = useSelector((state) => state.admin.exams); // Fetch exams from Redux
  const location = useLocation();
  const navigate = useNavigate();
  const level = location.state?.level;
  const Age = location.state?.Age; // Get level from navigation state
  const profile = localStorage.getItem('token');
  const befarelevelExams = exams.filter((exam) => exam.class === level);
  const levelExams = befarelevelExams.filter((exam) => exam.ageGroup === Age);
 //console.log(levelExams[0])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(null); // For countdown timer
  const currentExam = levelExams[0]; // Pick the first available exam for this level
  const questions = currentExam?.questions || [];
  const dispatch = useDispatch();
useEffect(() => {
    //console.log(exams)
    if (!exams || exams.length === 0) {
      navigate('/');
    }
  }, [exams, navigate]);
  useEffect(() => {
    if (currentExam?.timer) {
      setTimeRemaining(currentExam.timer * 60); // Set timer in seconds
    }
  }, [currentExam]);

  useEffect(() => {
    if (timeRemaining !== null) {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            alert(t('examPage.timeUpAlert'));
            navigate('/result', { state: { level, answers } });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeRemaining, navigate, answers, level, t]);

  if (!profile) {
    return (
      <div style={styles.container}>
        <Typography variant="h4" style={styles.error}>
          {t('examPage.noProfile')}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/register')}
          style={styles.button}
        >
          {t('examPage.registerButton')}
        </Button>
      </div>
    );
  }

  if (levelExams.length === 0) {
    return (
      <div style={styles.container}>
        <Typography variant="h4" style={styles.error}>
          {t('examPage.noExams')}
        </Typography>
        <Typography variant="body1">{t('examPage.checkBack')}</Typography>
      </div>
    );
  }

  const handleAnswerChange = (value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = value;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
   
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const score = answers.reduce((correct, answer, index) => {
      const correctAnswer = questions[index]?.correctAnswer?.toString();
      return correct + (answer === correctAnswer ? 1 : 0);
    }, 0);
  
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (!token) {
      alert("Authentication token not found. Please log in.");
      return;
    }
  
    try {
      // Send the exam data to the backend
      const response = await axios.post(
        "https://exam-server-psi.vercel.app/api/exam/submit",
        {
          userId: userInfo.id, 
          examId: currentExam._id, 
          timeexam:currentExam.timer*60-timeRemaining,
          answers, 
          score: score, 
          total:questions.length
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
  
      // Dispatch to Redux to update exam history
      dispatch(
        addExamToHistory({
          level,
          answers,
          questions: currentExam.questions,
        })
      );
  
      // Navigate to the results page with state
      navigate("/result", { state: { level, answers } });
  
      alert("Exam submitted successfully!");
    } catch (error) {
      console.error("Error submitting exam:", error);
      if (error.response && error.response.data) {
        alert(`Submission failed: ${error.response.data.message}`);
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <CardContent>
          <Typography variant="h4" style={styles.title}>
            {t('examPage.title', { level })}
          </Typography>
          <Typography variant="h6" style={styles.timer}>
            {t('examPage.timeRemaining', { time: formatTime(timeRemaining) })}
          </Typography>
          {questions.length > 0 && currentQuestion ? (
            <>
              <Box style={styles.questionBox}>
                {currentQuestion.numbers.map((num, idx) => (
                  <Box key={idx}>
                    <Typography style={styles.number}>{num.value}</Typography>
                    {idx < currentQuestion.operations.length && (
                      <Typography style={styles.operation}>
                        {currentQuestion.operations[idx]}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
              <Typography style={styles.questionCount}>
                {t('examPage.questionCount', {
                  current: currentQuestionIndex + 1,
                  total: questions.length,
                })}
              </Typography>
              <TextField
                label={t('examPage.yourAnswer')}
                fullWidth
                value={answers[currentQuestionIndex] || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                style={styles.input}
              />
              <div style={styles.navigation}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleBack}
                  disabled={currentQuestionIndex === 0}
                  style={styles.button}
                >
                  {t('examPage.backButton')}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  style={styles.button}
                >
                  {currentQuestionIndex === questions.length - 1
                    ? t('examPage.submitButton')
                    : t('examPage.nextButton')}
                </Button>
              </div>
            </>
          ) : (
            <Typography variant="h6" style={styles.error}>
              {t('examPage.noQuestions')}
            </Typography>
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
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    padding: '30px',
  },
  title: {
    fontWeight: 'bold',
    color: '#1565c0',
    marginBottom: '20px',
  },
  timer: {
    color: '#d32f2f',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  questionBox: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  number: {
    fontSize: '20px',
    marginBottom: '10px',
  },
  operation: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  questionCount: {
    marginBottom: '20px',
    fontSize: '16px',
    color: '#333',
  },
  input: {
    marginBottom: '20px',
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    marginTop: '10px',
    backgroundColor: '#1565c0',
    color: '#fff',
  },
  error: {
    color: '#d32f2f',
    marginBottom: '20px',
  },
};

export default ExamPage;
