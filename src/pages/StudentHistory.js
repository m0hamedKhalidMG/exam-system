import React, { useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Button,
  Modal,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const StudentHistory = () => {
  const { t } = useTranslation();
  const history = useSelector((state) => state.student.exams);
  const [selectedExam, setSelectedExam] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleViewDetails = (exam) => {
    setSelectedExam(exam);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedExam(null);
    setOpenModal(false);
  };

  return (
    <div style={styles.container}>
      <Box style={styles.centerBox}>
        <Typography variant="h4" align="center" style={styles.title}>
          {t('studentHistory.title')}
        </Typography>
        {history.length === 0 ? (
          <Card style={styles.noHistoryCard}>
            <CardContent>
              <Typography
                variant="body1"
                align="center"
                style={styles.noHistory}
              >
                {t('studentHistory.noHistory')}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Card style={styles.historyCard}>
            <CardContent>
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                style={styles.historyTitle}
              >
                {t('studentHistory.recordsTitle')}
              </Typography>
              <List>
                {history.map((item, index) => {
                  const score = item.answers.filter(
                    (answer, idx) =>
                      answer === item.questions[idx]?.correctAnswer.toString()
                  ).length;
                  const totalQuestions = item.questions.length;

                  return (
                    <React.Fragment key={index}>
                      <ListItem style={styles.listItem}>
                        <Grid container alignItems="center">
                          <Grid item xs={4}>
                            <Typography variant="h6" style={styles.level}>{`${t(
                              'studentHistory.level'
                            )}: ${item.level}`}</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography style={styles.details}>
                              📅 {new Date(item.date).toLocaleDateString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography style={styles.details}>
                              🏆 {t('studentHistory.score')}: {score} /{' '}
                              {totalQuestions}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} style={{ marginTop: '10px' }}>
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={() => handleViewDetails(item)}
                              style={styles.button}
                            >
                              {t('studentHistory.viewDetails')}
                            </Button>
                          </Grid>
                        </Grid>
                      </ListItem>
                      {index < history.length - 1 && <Divider />}
                    </React.Fragment>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Modal for Exam Details */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        style={styles.modalContainer}
      >
        <Box style={styles.modalBox}>
          <Typography variant="h5" align="center" style={styles.modalTitle}>
            {t('studentHistory.modalTitle')}
          </Typography>
          {selectedExam && (
            <List>
              {selectedExam.questions.map((question, idx) => {
                const isCorrect =
                  selectedExam.answers[idx] ===
                  question.correctAnswer.toString();
                return (
                  <React.Fragment key={idx}>
                    <ListItem>
                      <ListItemText
                        primary={`Q${idx + 1}: ${question.numbers
                          .map(
                            (num, numIdx) =>
                              `${num.value}${question.operations[numIdx] || ''}`
                          )
                          .join(' ')}`}
                        secondary={
                          <>
                            <Typography>
                              <strong>{t('studentHistory.yourAnswer')}:</strong>{' '}
                              {selectedExam.answers[idx]}
                              {isCorrect ? ' ✅' : ' ❌'}
                            </Typography>
                            <Typography>
                              <strong>
                                {t('studentHistory.correctAnswer')}:
                              </strong>{' '}
                              {question.correctAnswer}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {idx < selectedExam.questions.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </List>
          )}
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handleCloseModal}
            style={styles.closeButton}
          >
            {t('studentHistory.closeButton')}
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

const styles = {
  container: {
    background:
      'linear-gradient(135deg, rgba(63, 81, 181, 0.8), rgba(37, 206, 209, 0.8))',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  centerBox: {
    width: '100%',
    maxWidth: '800px',
    textAlign: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#ffffff',
    textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5)',
    marginBottom: '20px',
  },
  noHistoryCard: {
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '15px',
    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)',
    padding: '20px',
    margin: '0 auto',
    width: '100%',
    maxWidth: '600px',
  },
  noHistory: {
    color: '#d32f2f',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  historyCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '15px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
    padding: '30px',
    margin: '0 auto',
    width: '100%',
    maxWidth: '800px',
  },
  historyTitle: {
    color: '#1565c0',
    fontWeight: '600',
    marginBottom: '15px',
  },
  listItem: {
    padding: '10px 0',
  },
  level: {
    fontWeight: 'bold',
    color: '#0d47a1',
  },
  details: {
    fontSize: '14px',
    color: '#555',
    textAlign: 'center',
  },
  button: {
    fontWeight: 'bold',
    padding: '5px 10px',
    textTransform: 'none',
  },
  modalContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    background: '#ffffff',
    borderRadius: '15px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
    width: '80%',
    maxWidth: '600px',
    padding: '20px',
    outline: 'none',
  },
  modalTitle: {
    marginBottom: '15px',
    color: '#1565c0',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: '20px',
    backgroundColor: '#d32f2f',
    color: '#ffffff',
  },
};

export default StudentHistory;
