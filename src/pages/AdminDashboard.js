import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Modal,
  Box,
} from '@mui/material';
import axios from 'axios';

import {
  AddCircleOutline,
  RemoveCircleOutline,
  Delete,
  Edit,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import {
  addQuestion,
  addExam,
  loadExam,
  deleteExam,
  updateExam,
} from '../redux/adminSlice';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const exams = useSelector((state) => state.admin.exams);
  const questions = useSelector((state) => state.admin.questions);
  const students = useSelector((state) => state.admin.students);

  // Fetch all exams and add them to Redux store on component mount
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage

        if (!token) {
          alert('Authentication token is missing. Please log in again.');
          return;
        }

        const response = await axios.get('https://exam-server-psi.vercel.app/api/exam', {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to Authorization header
          },
        });
        if (response.status === 200 && Array.isArray(response.data)) {
         // response.data.forEach((exam) => {
          //console.log(response.data)
            dispatch(loadExam(response.data)); // Add each exam to the Redux store
        //  });
        } else {
          alert('Failed to fetch exams. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching exams:', error.response?.data || error.message);
        alert('An error occurred while fetching exams. Please try again.');
      }
    };

    fetchExams();
  }, [dispatch]); // Dependency array ensures this runs only on component mount

  const [questionData, setQuestionData] = useState({
    level: '',
    ageGroup: '',
    startTime: '',
    endTime: '',
    duration: '',
    questions: [],
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    numbers: [{ id: 1, value: '' }],
    operations: [],
    correctAnswer: '',
  });

  const [openModal, setOpenModal] = useState(false);
  const [modalAction, setModalAction] = useState('');
  const [selectedExam, setSelectedExam] = useState(null);

  // Calculate the correct answer dynamically
  useEffect(() => {
    if (
      currentQuestion.numbers.length > 1 &&
      currentQuestion.operations.every((op) => op)
    ) {
      try {
        const expression = currentQuestion.numbers
          .map((num, index) =>
            index < currentQuestion.operations.length
              ? `${num.value} ${currentQuestion.operations[index]}`
              : num.value
          )
          .join(' ');
        const evalResult = eval(expression);
        setCurrentQuestion({ ...currentQuestion, correctAnswer: evalResult });
      } catch {
        setCurrentQuestion({
          ...currentQuestion,
          correctAnswer: t('adminDashboard.invalidExpression'),
        });
      }
    }
  }, [currentQuestion.numbers, currentQuestion.operations, t]);

  const handleAddNumber = () => {
    setCurrentQuestion({
      ...currentQuestion,
      numbers: [
        ...currentQuestion.numbers,
        { id: currentQuestion.numbers.length + 1, value: '' },
      ],
      operations: [...currentQuestion.operations, ''],
    });
  };

  const handleRemoveNumber = (id) => {
    setCurrentQuestion({
      ...currentQuestion,
      numbers: currentQuestion.numbers.filter((num) => num.id !== id),
      operations: currentQuestion.operations.slice(0, -1),
    });
  };

  const handleNumberChange = (id, value) => {
    setCurrentQuestion({
      ...currentQuestion,
      numbers: currentQuestion.numbers.map((num) =>
        num.id === id ? { ...num, value } : num
      ),
    });
  };

  const handleOperationChange = (index, value) => {
    setCurrentQuestion({
      ...currentQuestion,
      operations: currentQuestion.operations.map((op, i) =>
        i === index ? value : op
      ),
    });
  };

  const handleAddQuestion = () => {
    if (
      currentQuestion.numbers.length > 1 &&
      currentQuestion.operations.length > 0 &&
      currentQuestion.correctAnswer !== ''
    ) {
      setQuestionData({
        ...questionData,
        questions: [...questionData.questions, currentQuestion],
      });
      setCurrentQuestion({
        numbers: [{ id: 1, value: '' }],
        operations: [],
        correctAnswer: '',
      });
    } else {
      alert(t('adminDashboard.invalidQuestionAlert'));
    }
  };

  const handleScheduleExam = () => {
    if (
      questionData.level &&
      questionData.ageGroup &&
      questionData.startTime &&
      questionData.endTime &&
      questionData.duration &&
      questionData.questions.length > 0
    ) {
      dispatch(
        addExam({
          ...questionData,
          id: Date.now(),
        })
      );
      alert('Exam scheduled successfully!');
      setQuestionData({
        level: '',
        ageGroup: '',
        startTime: '',
        endTime: '',
        duration: '',
        questions: [],
      });
    } else {
      alert('Please fill out all fields and add at least one question.');
    }
  };

  const handleDeleteExam = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  
      if (!token) {
        alert('Authentication token is missing. Please log in again.');
        return;
      }
  
      // Make the DELETE request to the backend
      await axios.delete(
        `https://exam-server-psi.vercel.app/api/exam/delete/${id}`, // Backend API endpoint
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add Bearer token to the headers
            'Content-Type': 'application/json', // Set content type
          },
        }
      );
  
      //console.log(`Exam with ID ${id} deleted successfully.`);
      dispatch(deleteExam(id)); // Remove the exam from Redux store
      alert('Exam deleted successfully!');
    } catch (error) {
      console.error('Error deleting exam:', error);
      alert('Failed to delete the exam. Please try again.');
    }
  };
  

  const handleEditExam = (id) => {
    const examToEdit = exams.find((exam) => exam._id === id);
    if (examToEdit) {
      setSelectedExam(examToEdit);
      setModalAction('edit');
      setOpenModal(true);
    }
  };

  const updateQuestionInExam = (index, value) => {
    const updatedQuestions = [...selectedExam.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], text: value }; // Update the text property
    setSelectedExam({ ...selectedExam, questions: updatedQuestions });
  };

  const deleteQuestionInExam = (index) => {
    const updatedQuestions = selectedExam.questions.filter(
      (_, i) => i !== index
    );
    setSelectedExam({ ...selectedExam, questions: updatedQuestions });
  };

  const saveEditedExam = async (id) => { // Add `async` here
    try {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
  
      if (!token) {
        alert('Authentication token is missing. Please log in again.');
        return;
      }
  
      // Make the API call to update the exam
      const response = await axios.put(
        `https://exam-server-psi.vercel.app/api/exam/update/${selectedExam._id}`, // Backend API URL
        selectedExam, // Pass the updated exam data
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add Bearer token in headers
            'Content-Type': 'application/json', // Set content type
          },
        }
      );
  const id=selectedExam._id
      //console.log('Response from backend:', response.data.exam); // Log backend response
      //console.log(id)
      setSelectedExam(response.data.exam);
      // Dispatch the updated exam to the Redux store
      dispatch(
        updateExam({
          id,
          updatedExam: response.data.exam, 
        })
      );
  
      alert('Exam updated successfully!');
      setOpenModal(false);
    } catch (error) {
      console.error('Error updating exam:', error);
      alert('Failed to update exam. Please try again.');
    }
  };
  
  const calculateAnswer = (numbers, operations) => {
    try {
      const expression = numbers
        .map((num, idx) =>
          idx < operations.length
            ? `${num.value} ${operations[idx]}`
            : num.value
        )
        .join(' ');
      return eval(expression) || '';
    } catch {
      return 'Invalid Expression';
    }
  };

  return (
    <div style={styles.container}>
      <Typography variant="h3" gutterBottom align="center" style={styles.title}>
        {t('adminDashboard.title')}
      </Typography>

      <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
  <Card style={styles.card}>
    <CardContent>
      <Typography variant="h5" gutterBottom style={styles.cardTitle}>
        {t('adminDashboard.createExam')}
      </Typography>
      <Select
        value={questionData.ageGroup}
        onChange={(e) =>
          setQuestionData({ ...questionData, ageGroup: e.target.value })
        }
        displayEmpty
        fullWidth
        style={styles.input}
      >
        <MenuItem value="">
          {t('adminDashboard.selectAgeGroup')}
        </MenuItem>
        <MenuItem value="7">{t('ageGroup.7')}</MenuItem>
        <MenuItem value="8-10">{t('ageGroup.8_10')}</MenuItem>
        <MenuItem value="10+">{t('ageGroup.10Plus')}</MenuItem>
      </Select>
      <Select
        value={questionData.level}
        onChange={(e) =>
          setQuestionData({ ...questionData, level: e.target.value })
        }
        displayEmpty
        fullWidth
        style={styles.input}
      >
        <MenuItem value="">{t('adminDashboard.selectLevel')}</MenuItem>
        <MenuItem value="A">{t('level.A')}</MenuItem>
        <MenuItem value="B">{t('level.B')}</MenuItem>
        <MenuItem value="C">{t('level.C')}</MenuItem>
      </Select>
      <TextField
        label={t('adminDashboard.startDate')}
        type="date"
        fullWidth
        value={questionData.startDate}
        onChange={(e) =>
          setQuestionData({ ...questionData, startDate: e.target.value })
        }
        InputLabelProps={{
          shrink: true,
        }}
        style={styles.input}
      />
      <TextField
        label={t('adminDashboard.startTime')}
        type="time"
        fullWidth
        value={questionData.startTime}
        onChange={(e) =>
          setQuestionData({ ...questionData, startTime: e.target.value })
        }
        InputLabelProps={{
          shrink: true,
        }}
        style={styles.input}
      />
      <TextField
        label={t('adminDashboard.endDate')}
        type="date"
        fullWidth
        value={questionData.endDate}
        onChange={(e) =>
          setQuestionData({ ...questionData, endDate: e.target.value })
        }
        InputLabelProps={{
          shrink: true,
        }}
        style={styles.input}
      />
      <TextField
        label={t('adminDashboard.endTime')}
        type="time"
        fullWidth
        value={questionData.endTime}
        onChange={(e) =>
          setQuestionData({ ...questionData, endTime: e.target.value })
        }
        InputLabelProps={{
          shrink: true,
        }}
        style={styles.input}
      />
      <TextField
        label={t('adminDashboard.duration')}
        fullWidth
        value={questionData.duration}
        onChange={(e) =>
          setQuestionData({ ...questionData, duration: e.target.value })
        }
        style={styles.input}
      />
   <Button
  variant="contained"
  color="primary"
  fullWidth
  onClick={async () => {
    if (
      questionData.level &&
      questionData.ageGroup &&
      questionData.startDate &&
      questionData.startTime &&
      questionData.endDate &&
      questionData.endTime &&
      questionData.duration &&
      questionData.questions.length > 0
    ) {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage

        if (!token) {
          alert('Authentication token is missing. Please log in again.');
          return;
        }

        // Combine date and time fields into ISO strings for backend
        const examData = {
          ...questionData,
          // startDateTime: `${questionData.startDate}T${questionData.startTime}:00`,
          // endDateTime: `${questionData.endDate}T${questionData.endTime}:00`,
        };

        //console.log('Exam Data:', examData);

        // Call the backend API
        const response = await axios.post(
          'https://exam-server-psi.vercel.app/api/exam/create',
          examData,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add token to Authorization header
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 201) {
          //console.log('Exam created successfully:', response.data.exam);

          // Dispatch action to add exam locally
          dispatch(
            addExam({
              ...questionData,
              id: Date.now(),
            })
          );

          alert(t('adminDashboard.examScheduled'));

          // Reset the form data
          setQuestionData({
            level: '',
            ageGroup: '',
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            duration: '',
            questions: [],
          });
        } else {
          alert('Failed to create the exam. Please try again.');
        }
      } catch (error) {
        console.error('Error creating exam:', error.response?.data || error.message);
        alert('An error occurred while creating the exam. Please try again.');
      }
    } else {
      alert(t('adminDashboard.incompleteExamAlert'));
    }
  }}
  style={styles.button}
>
  {t('adminDashboard.scheduleExam')}
</Button>

    </CardContent>
  </Card>
</Grid>


        <Grid item xs={12} md={6}>
          <Card style={styles.card}>
            <CardContent>
              <Typography variant="h5" gutterBottom style={styles.cardTitle}>
                {t('adminDashboard.addQuestion')}
              </Typography>
              {currentQuestion.numbers.map((num) => (
                <div key={num.id} style={styles.optionContainer}>
                  <TextField
                    label={`${t('adminDashboard.number')} ${num.id}`}
                    fullWidth
                    value={num.value}
                    onChange={(e) => handleNumberChange(num.id, e.target.value)}
                    style={styles.input}
                  />
                  {num.id > 1 && (
                    <IconButton
                      color="primary"
                      onClick={() => handleRemoveNumber(num.id)}
                      style={styles.iconButton}
                    >
                      <RemoveCircleOutline />
                    </IconButton>
                  )}
                </div>
              ))}
              {currentQuestion.numbers.length > 1 &&
                currentQuestion.numbers.length - 1 ===
                  currentQuestion.operations.length &&
                currentQuestion.numbers.map((_, index) =>
                  index < currentQuestion.numbers.length - 1 ? (
                    <Select
                      key={`operation-${index}`}
                      value={currentQuestion.operations[index] || ''}
                      onChange={(e) =>
                        handleOperationChange(index, e.target.value)
                      }
                      displayEmpty
                      fullWidth
                      style={styles.input}
                    >
                      <MenuItem value="">
                        {t('adminDashboard.selectOperation')}
                      </MenuItem>
                      <MenuItem value="+">{t('operations.addition')}</MenuItem>
                      <MenuItem value="-">
                        {t('operations.subtraction')}
                      </MenuItem>
                      <MenuItem value="*">
                        {t('operations.multiplication')}
                      </MenuItem>
                      <MenuItem value="/">{t('operations.division')}</MenuItem>
                    </Select>
                  ) : null
                )}
              <Button
                variant="outlined"
                color="primary"
                onClick={handleAddNumber}
                style={styles.addButton}
              >
                {t('adminDashboard.addNumber')}
              </Button>
              <TextField
                label={t('adminDashboard.correctAnswer')}
                fullWidth
                value={currentQuestion.correctAnswer}
                disabled
                style={styles.input}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleAddQuestion}
                style={styles.button}
              >
                {t('adminDashboard.addQuestion')}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card style={styles.card}>
            <CardContent>
              <Typography variant="h5" gutterBottom style={styles.cardTitle}>
                {t('adminDashboard.existingExams')}
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('adminDashboard.ageGroup')}</TableCell>
                    <TableCell>{t('adminDashboard.level')}</TableCell>
                    <TableCell>{t('adminDashboard.startTime')}</TableCell>
                    <TableCell>{t('adminDashboard.endTime')}</TableCell>
                    <TableCell>{t('adminDashboard.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {exams.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell>{exam.ageGroup}</TableCell>
                      <TableCell>{exam.class}</TableCell>
                      <TableCell>{exam.startDateTime}</TableCell>
                      <TableCell>{exam.endDateTime}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleEditExam(exam._id)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() => handleDeleteExam(exam._id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>


        {openModal && (
          <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <Box style={styles.modalBox}>
              <Typography variant="h5" gutterBottom>
                {modalAction === 'edit'
                  ? t('adminDashboard.editExam')
                  : t('adminDashboard.viewExam')}
              </Typography>
              {modalAction === 'edit' && selectedExam && (
 <div style={styles.scrollableContent}>   
                <TextField
                    label={t('adminDashboard.ageGroup')}
                    value={selectedExam.ageGroup}
                    onChange={(e) =>
                      setSelectedExam({
                        ...selectedExam,
                        ageGroup: e.target.value,
                      })
                    }
                    fullWidth
                    style={styles.input}
                  />
                  <TextField
                    label={t('adminDashboard.level')}
                    value={selectedExam.class}
                    onChange={(e) =>
                      setSelectedExam({
                        ...selectedExam,
                        class: e.target.value,
                      })
                    }
                    fullWidth
                    style={styles.input}
                  />
                  <TextField
                    label={t('adminDashboard.startTime')}
                    value={selectedExam.startDateTime}
                    onChange={(e) =>
                      setSelectedExam({
                        ...selectedExam,
                        startDateTime: e.target.value,
                      })
                    }
                    fullWidth
                    style={styles.input}
                  />
                  <TextField
                    label={t('adminDashboard.endTime')}
                    value={selectedExam.endDateTime}
                    onChange={(e) =>
                      setSelectedExam({
                        ...selectedExam,
                        endDateTime: e.target.value,
                      })
                    }
                    fullWidth
                    style={styles.input}
                  />
                  <Typography variant="h6" gutterBottom>
                    {t('adminDashboard.questions')}
                  </Typography>
                  {selectedExam.questions.map((question, idx) => (
                    <div key={idx} style={{ marginBottom: '20px' }}>
                      <Typography variant="h6">{`${t(
                        'adminDashboard.question'
                      )} ${idx + 1}`}</Typography>
                      {question.numbers.map((num, numIdx) => (
                        <div key={numIdx} style={styles.optionContainer}>
                          <TextField
                            label={`${t('adminDashboard.number')} ${
                              numIdx + 1
                            }`}
                            fullWidth
                            value={num.value || ''}
                            onChange={(e) => {
                              const updatedQuestions = [
                                ...selectedExam.questions,
                              ];
                              const updatedNumbers = [...question.numbers];
                              updatedNumbers[numIdx] = {
                                ...updatedNumbers[numIdx],
                                value: e.target.value,
                              };
                              const updatedQuestion = {
                                ...question,
                                numbers: updatedNumbers,
                              };
                              updatedQuestion.correctAnswer = calculateAnswer(
                                updatedQuestion.numbers,
                                updatedQuestion.operations
                              );
                              updatedQuestions[idx] = updatedQuestion;
                              setSelectedExam({
                                ...selectedExam,
                                questions: updatedQuestions,
                              });
                            }}
                            style={styles.input}
                          />
                          {numIdx > 0 && (
                            <IconButton
                              color="primary"
                              onClick={() => {
                                const updatedQuestions = [
                                  ...selectedExam.questions,
                                ];
                                const updatedNumbers = question.numbers.filter(
                                  (_, i) => i !== numIdx
                                );
                                const updatedQuestion = {
                                  ...question,
                                  numbers: updatedNumbers,
                                };
                                updatedQuestion.correctAnswer = calculateAnswer(
                                  updatedQuestion.numbers,
                                  updatedQuestion.operations
                                );
                                updatedQuestions[idx] = updatedQuestion;
                                setSelectedExam({
                                  ...selectedExam,
                                  questions: updatedQuestions,
                                });
                              }}
                            >
                              <RemoveCircleOutline />
                            </IconButton>
                          )}
                        </div>
                      ))}
                      {question.numbers.length > 1 &&
                        question.operations.map((op, opIdx) => (
                          <Select
                            key={opIdx}
                            value={op || ''}
                            onChange={(e) => {
                              const updatedQuestions = [
                                ...selectedExam.questions,
                              ];
                              const updatedOperations = [
                                ...question.operations,
                              ];
                              updatedOperations[opIdx] = e.target.value;
                              const updatedQuestion = {
                                ...question,
                                operations: updatedOperations,
                              };
                              updatedQuestion.correctAnswer = calculateAnswer(
                                updatedQuestion.numbers,
                                updatedQuestion.operations
                              );
                              updatedQuestions[idx] = updatedQuestion;
                              setSelectedExam({
                                ...selectedExam,
                                questions: updatedQuestions,
                              });
                            }}
                            displayEmpty
                            fullWidth
                            style={styles.input}
                          >
                            <MenuItem value="">
                              {t('adminDashboard.selectOperation')}
                            </MenuItem>
                            <MenuItem value="+">
                              {t('adminDashboard.add')}
                            </MenuItem>
                            <MenuItem value="-">
                              {t('adminDashboard.subtract')}
                            </MenuItem>
                            <MenuItem value="*">
                              {t('adminDashboard.multiply')}
                            </MenuItem>
                            <MenuItem value="/">
                              {t('adminDashboard.divide')}
                            </MenuItem>
                          </Select>
                        ))}
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                          const updatedQuestions = [...selectedExam.questions];
                          const updatedNumbers = [
                            ...question.numbers,
                            { id: question.numbers.length + 1, value: '' },
                          ];
                          const updatedOperations = [
                            ...question.operations,
                            '',
                          ];
                          const updatedQuestion = {
                            ...question,
                            numbers: updatedNumbers,
                            operations: updatedOperations,
                          };
                          updatedQuestion.correctAnswer = calculateAnswer(
                            updatedQuestion.numbers,
                            updatedQuestion.operations
                          );
                          updatedQuestions[idx] = updatedQuestion;
                          setSelectedExam({
                            ...selectedExam,
                            questions: updatedQuestions,
                          });
                        }}
                        style={styles.addButton}
                      >
                        {t('adminDashboard.addNumber')}
                      </Button>
                      <TextField
                        label={t('adminDashboard.correctAnswer')}
                        fullWidth
                        value={question.correctAnswer || ''}
                        disabled
                        style={styles.input}
                      />
                <Button
  variant="outlined"
  color="secondary"
  onClick={async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the token
      if (!token) {
        alert('Authentication token is missing. Please log in again.');
        return;
      }

      // Send a DELETE request to the backend
      const response = await axios.delete(
        `https://exam-server-psi.vercel.app/api/exam/${selectedExam._id}/question/${idx}`, // Backend API URL
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add Bearer token
            'Content-Type': 'application/json',
          },
        }
      );
const id=  response.data.exam._id;
      // Update the selected exam questions after successful deletion
      dispatch(
        updateExam({
        id,
          updatedExam: response.data.exam, 
        })
      );
  
      setSelectedExam(response.data.exam);
      alert('Question deleted successfully!');
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Failed to delete the question. Please try again.');
    }
  }}
  style={{ marginTop: '10px' }}
>
  {t('adminDashboard.deleteQuestion')}
</Button>

                    </div>
                  ))}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => saveEditedExam(selectedExam._id)}
                    style={styles.button}
                  >
                    {t('adminDashboard.saveChanges')}
                  </Button>
                </div>
              )}
            </Box>
          </Modal>
        )}
      </Grid>
    </div>
  );
};

const styles = {
  
  modalTitle: {
    textAlign: 'center',
    fontWeight: 700,
    color: '#333333',
  },
  input: {
    marginBottom: '16px',
  },
  button: {
    marginTop: '16px',
  },
  container: {
    background:
      'linear-gradient(135deg, rgba(25, 118, 210, 0.9), rgba(37, 206, 209, 0.8))',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  },
  title: {
    fontWeight: 'bold',
    color: '#fff',
    textShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '15px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
    padding: '20px',
  },
  cardTitle: {
    fontWeight: '500',
    color: '#1565c0',
  },
  input: {
    marginBottom: '15px',
  },
  button: {
    fontWeight: 'bold',
    marginTop: '15px',
    backgroundColor: '#1565c0',
    color: '#fff',
    padding: '10px',
    borderRadius: '10px',
    '&:hover': {
      backgroundColor: '#0d47a1',
    },
  },
  optionContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  iconButton: {
    marginLeft: '10px',
  },
  addButton: {
    marginBottom: '15px',
  },
  modalBox: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%', // Adaptable to different screen sizes
    maxWidth: '600px', // Limit maximum width for large screens
    maxHeight: '80vh', // Constrain height for better usability
    backgroundColor: '#ffffff', // Clean, professional white background
    borderRadius: '12px', // Rounded corners for a modern feel
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)', // Deep shadow for depth
    padding: '24px', // Comfortable padding for content spacing
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto', // Allow vertical scrolling for large content
    border: '1px solid #e0e0e0', // Subtle border for structure
    zIndex: 1050, // Ensure it stays above other elements
    animation: 'fadeIn 0.3s ease', // Smooth fade-in animation
  },
  
  // Add this keyframes animation for the smooth effect
  scrollableContent: {
    maxHeight: '70vh', // Constrain content height within the modal
    overflowY: 'auto',
    padding: '12px', // Prevent content from touching the scrollbar
    marginRight: '-12px', // Align scrollbar visually
    scrollbarColor: '#1565c0 #e0e0e0', // Custom scrollbar colors
    scrollbarWidth: 'thin', // Makes the scrollbar thin and modern
  },
  
  // Custom Scroll Style (Add this for modern and cross-browser scroll aesthetics)
  '::-webkit-scrollbar': {
    width: '8px', // Width of the scrollbar
  },
  
  '::-webkit-scrollbar-thumb': {
    backgroundColor: '#1565c0', // Scroll thumb color
    borderRadius: '8px', // Rounded scroll thumb
    border: '2px solid #ffffff', // Adds a white space around the thumb
  },
  
  '::-webkit-scrollbar-thumb:hover': {
    backgroundColor: '#0d47a1', // Darker shade on hover
  },
  
  '::-webkit-scrollbar-track': {
    backgroundColor: '#f5f5f5', // Subtle track color for contrast
    borderRadius: '8px',
  },
  
  questionEdit: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
}; 


export default AdminDashboard;
