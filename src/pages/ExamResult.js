import React ,{useEffect,useState}from 'react';
import {
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const ExamResult = () => {
  const { t } = useTranslation(); // Translation hook
  const navigate = useNavigate();
  const location = useLocation();
  const { level, answers } = location.state || {};
  const profile = JSON.parse(localStorage.getItem('userInfo'));
 const [imgprofile, setProfileimg] = useState(null);
  console.log(profile.username)
  const exams = useSelector((state) => state.admin.exams);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get token from local storage
        const token = localStorage.getItem('token');
        
        // Fetch user profile
        const response = await axios.get('https://exam-server-psi.vercel.app/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userProfile = response.data.user.profileImage;
      console.log(userProfile)
        setProfileimg(userProfile || '');
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

useEffect(() => {
    console.log(exams)
    if (!exams || exams.length === 0) {
      navigate('/');
    }
  }, [exams, navigate]);
  const currentExam = exams.find((exam) => exam.class === level);
  const questions = currentExam?.questions || [];
  const totalQuestions = questions.length;
console.log(questions)
  const score = answers.reduce((correct, answer, index) => {
    const correctAnswer = questions[index]?.correctAnswer?.toString();
    return correct + (answer === correctAnswer ? 1 : 0);
  }, 0);

  const feedback =
    score / totalQuestions > 0.8
      ? t('examResult.feedback.excellent')
      : score / totalQuestions > 0.5
      ? t('examResult.feedback.good')
      : t('examResult.feedback.practice');

  const handleViewHistory = () => {
    navigate('/history');
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <CardContent>
          <Box style={styles.header}>
            <Avatar
              src={imgprofile}
              alt={profile?.username}
              style={styles.avatar}
            >
              {profile?.username?.[0] || 'U'}
            </Avatar>
            <Typography variant="h4" align="center" style={styles.title}>
              {t('examResult.title')}
            </Typography>
          </Box>
          <Divider style={styles.divider} />
          <Box style={styles.summary}>
            <Typography variant="h6" style={styles.text}>
              <strong>{t('examResult.name')}:</strong>{' '}
              {profile?.username || 'Unknown'}
            </Typography>
            <Typography variant="h6" style={styles.text}>
              <strong>{t('examResult.level')}:</strong> {level || 'N/A'}
            </Typography>
            <Typography variant="h6" style={styles.text}>
              <strong>{t('examResult.score')}:</strong> {score} /{' '}
              {totalQuestions}
            </Typography>
            <Typography variant="h6" style={styles.text}>
              <strong>{t('examResult.feedbackTitle')}:</strong> {feedback}
            </Typography>
          </Box>
          <Divider style={styles.divider} />
          <Typography variant="h5" align="center" style={styles.detailTitle}>
            {t('examResult.questionBreakdown')}
          </Typography>
          <List>
            {questions.map((question, index) => {
              const isCorrect =
                answers[index] === question.correctAnswer?.toString();
              return (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={`${t('examResult.question')} ${
                        index + 1
                      }: ${question.numbers
                        .map(
                          (num, idx) =>
                            `${num.value}${question.operations[idx] || ''}`
                        )
                        .join(' ')}`}
                      secondary={
                        <>
                          <Typography>
                            <strong>{t('examResult.yourAnswer')}:</strong>{' '}
                            {answers[index]}{' '}
                            {isCorrect
                              ? t('examResult.correct')
                              : t('examResult.incorrect')}
                          </Typography>
                          <Typography>
                            <strong>{t('examResult.correctAnswer')}:</strong>{' '}
                            {question.correctAnswer}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < questions.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={styles.button}
            onClick={handleViewHistory}
          >
            {t('examResult.viewHistoryButton')}
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
    maxWidth: '700px',
    width: '100%',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '15px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
    padding: '20px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '20px',
  },
  avatar: {
    width: '120px',
    height: '120px',
    backgroundColor: '#1565c0',
    fontSize: '40px',
    color: '#fff',
  },
  title: {
    fontWeight: 'bold',
    color: '#1565c0',
  },
  summary: {
    marginBottom: '20px',
  },
  text: {
    marginBottom: '10px',
    fontSize: '16px',
    color: '#333',
  },
  detailTitle: {
    fontWeight: 'bold',
    color: '#1565c0',
    marginBottom: '10px',
  },
  divider: {
    margin: '20px 0',
  },
  button: {
    marginTop: '20px',
    backgroundColor: '#1565c0',
    color: '#fff',
    padding: '10px',
  },
};

export default ExamResult;
