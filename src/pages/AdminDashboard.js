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
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Checkbox,
} from '@mui/material';
import axios from 'axios';
import {
  AddCircleOutline,
  RemoveCircleOutline,
  Delete,
  Edit,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { addExam, loadExam, deleteExam, updateExam } from '../redux/adminSlice';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const exams = useSelector((state) => state.admin.exams);

  // -----------------------------
  //  FETCH ALL EXAMS ON LOAD
  // -----------------------------
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Authentication token is missing. Please log in again.');
          return;
        }
        const response = await axios.get(
          'https://exam-server-psi.vercel.app/api/exam',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.status === 200 && Array.isArray(response.data)) {
          dispatch(loadExam(response.data));
        } else {
          alert('Failed to fetch exams. Please try again.');
        }
      } catch (error) {
        console.error(
          'Error fetching exams:',
          error.response?.data || error.message
        );
        alert('An error occurred while fetching exams. Please try again.');
      }
    };
    fetchExams();
  }, [dispatch]);

  // ------------------------------------------
  //  STATE FOR NEW EXAM & QUESTIONS
  // ------------------------------------------
  const [questionData, setQuestionData] = useState({
    level: '',
    ageGroup: '',
    selectExamCategory: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    duration: '',
    questions: [],
    generationMethod: 'manual', // 'manual' or 'automatic'
  });

  // ------------------------------------------
  //  MANUAL QUESTION CREATION
  // ------------------------------------------
  const [currentQuestion, setCurrentQuestion] = useState({
    numbers: [{ id: 1, value: '' }],
    operations: [],
    correctAnswer: '',
  });

  // ------------------------------------------
  //  AUTOMATIC QUESTION CONFIGURATION
  // ------------------------------------------
  // الحقول الآن تُحدد عدد الديجيت لكل رقم، وعدد الأرقام في السؤال
  const [autoGenConfig, setAutoGenConfig] = useState({
    minDigits: 1, // أدنى عدد ديجيت (لا يقل عن 1)
    maxDigits: 2, // أعلى عدد ديجيت (لا يقل عن minDigits)
    numberCount: 2, // عدد الأرقام في السؤال (الحد الأدنى 2)
    questionsPerPage: 5,
    numberOfPages: 1,
    operations: {
      plus: true,
      minus: false,
      multiply: false,
      divide: false,
    },
  });

  // ------------------------------------------
  //  PREVIEW FOR AUTO-GENERATED QUESTIONS
  // ------------------------------------------
  const [autoGenPreview, setAutoGenPreview] = useState([]);

  // ------------------------------------------
  //  AUTO-CALCULATE CORRECT ANSWER (MANUAL)
  // ------------------------------------------
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

  // ------------------------------------------
  //  HANDLERS: MANUAL QUESTION
  // ------------------------------------------
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

  // ------------------------------------------
  //  HANDLERS: AUTOMATIC QUESTION GENERATION
  // ------------------------------------------
  // نستخدم الحقول الجديدة لتوليد كل سؤال بعدد الأرقام المحدد،
  // ولكل رقم يتم اختيار عدد ديجيت عشوائي بين minDigits وmaxDigits
  const handleAutoGeneration = () => {
    const {
      minDigits,
      maxDigits,
      numberCount,
      questionsPerPage,
      numberOfPages,
      operations,
    } = autoGenConfig;
    // التأكد من أن minDigits لا يقل عن 1
    const validMinDigits = Math.max(1, minDigits);
    // التأكد من أن maxDigits لا يقل عن validMinDigits
    const validMaxDigits =
      maxDigits < validMinDigits ? validMinDigits : maxDigits;

    const allowedOps = [];
    if (operations.plus) allowedOps.push('+');
    if (operations.minus) allowedOps.push('-');
    if (operations.multiply) allowedOps.push('*');
    if (operations.divide) allowedOps.push('/');

    if (allowedOps.length === 0) {
      alert('Please select at least one operation for auto-generation.');
      return;
    }

    // التأكد من أن عدد الأسئلة في كل صفحة وعدد الصفحات لا يقل عن 1
    const validQuestionsPerPage = Math.max(1, questionsPerPage);
    const validNumberOfPages = Math.max(1, numberOfPages);

    const totalQuestionsToGenerate = validQuestionsPerPage * validNumberOfPages;
    const generatedQuestions = [];

    // دالة توليد رقم بعدد ديجيت معين
    const generateNumberWithDigits = (digits) => {
      const min = Math.pow(10, digits - 1);
      const max = Math.pow(10, digits) - 1;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    for (let i = 0; i < totalQuestionsToGenerate; i++) {
      const numbers = [];
      for (let j = 0; j < numberCount; j++) {
        // اختيار عدد ديجيت عشوائي بين validMinDigits و validMaxDigits
        const digits =
          Math.floor(Math.random() * (validMaxDigits - validMinDigits + 1)) +
          validMinDigits;
        numbers.push({
          id: j + 1,
          value: generateNumberWithDigits(digits).toString(),
        });
      }
      const ops = [];
      for (let j = 0; j < numberCount - 1; j++) {
        const randomOp =
          allowedOps[Math.floor(Math.random() * allowedOps.length)];
        ops.push(randomOp);
      }

      const questionObj = { numbers, operations: ops, correctAnswer: '' };
      try {
        const expression = numbers
          .map((num, index) =>
            index < ops.length ? `${num.value} ${ops[index]}` : num.value
          )
          .join(' ');
        const evalResult = eval(expression);
        questionObj.correctAnswer = evalResult.toString();
      } catch {
        questionObj.correctAnswer = '';
      }
      generatedQuestions.push(questionObj);
    }
    setAutoGenPreview(generatedQuestions);
  };

  const handleConfirmAutoGen = () => {
    setQuestionData({ ...questionData, questions: autoGenPreview });
    setAutoGenPreview([]);
  };

  const handleDiscardAutoGen = () => {
    setAutoGenPreview([]);
  };

  // ------------------------------------------
  //  CREATE EXAM (POST TO BACKEND)
  // ------------------------------------------
  const handleCreateExam = async () => {
    if (
      !questionData.level ||
      !questionData.ageGroup ||
      !questionData.selectExamCategory ||
      !questionData.startDate ||
      !questionData.startTime ||
      !questionData.endDate ||
      !questionData.endTime ||
      !questionData.duration
    ) {
      alert(t('adminDashboard.incompleteExamAlert'));
      return;
    }
    if (questionData.questions.length === 0) {
      alert('Please add at least one question (manually or automatically).');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication token is missing. Please log in again.');
        return;
      }
      const examData = { ...questionData };
      const response = await axios.post(
        'https://exam-server-psi.vercel.app/api/exam/create',
        examData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 201) {
        dispatch(addExam(response.data.exam));
        alert(t('adminDashboard.examScheduled'));
        setQuestionData({
          level: '',
          ageGroup: '',
          selectExamCategory: '',
          startDate: '',
          startTime: '',
          endDate: '',
          endTime: '',
          duration: '',
          questions: [],
          generationMethod: 'manual',
        });
      } else {
        alert('Failed to create the exam. Please try again.');
      }
    } catch (error) {
      console.error(
        'Error creating exam:',
        error.response?.data || error.message
      );
      alert('An error occurred while creating the exam. Please try again.');
    }
  };

  // ------------------------------------------
  //  DELETE EXAM
  // ------------------------------------------
  const handleDeleteExam = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication token is missing. Please log in again.');
        return;
      }
      await axios.delete(
        `https://exam-server-psi.vercel.app/api/exam/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      dispatch(deleteExam(id));
      alert('Exam deleted successfully!');
    } catch (error) {
      console.error('Error deleting exam:', error);
      alert('Failed to delete the exam. Please try again.');
    }
  };

  // ------------------------------------------
  //  EDIT EXAM (MODAL)
  // ------------------------------------------
  const [openModal, setOpenModal] = useState(false);
  const [modalAction, setModalAction] = useState('');
  const [selectedExam, setSelectedExam] = useState(null);

  const handleEditExam = (id) => {
    const examToEdit = exams.find((exam) => exam._id === id);
    if (examToEdit) {
      setSelectedExam(examToEdit);
      setModalAction('edit');
      setOpenModal(true);
    }
  };

  const saveEditedExam = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication token is missing. Please log in again.');
        return;
      }
      const response = await axios.put(
        `https://exam-server-psi.vercel.app/api/exam/update/${selectedExam._id}`,
        selectedExam,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const updatedExam = response.data.exam;
      dispatch(updateExam({ id, updatedExam }));
      alert('Exam updated successfully!');
      setOpenModal(false);
    } catch (error) {
      console.error('Error updating exam:', error);
      alert('Failed to update exam. Please try again.');
    }
  };

  // Helper to recalc the correct answer in the modal
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
        {/* CREATE EXAM (LEFT SIDE) */}
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
                value={questionData.selectExamCategory}
                onChange={(e) =>
                  setQuestionData({
                    ...questionData,
                    selectExamCategory: e.target.value,
                  })
                }
                displayEmpty
                fullWidth
                style={styles.input}
              >
                <MenuItem value="">اختر فئة الامتحان</MenuItem>
                <MenuItem value="1">التدريب والتأهيل البصري</MenuItem>
                <MenuItem value="2">التحدي والمنافسة</MenuItem>
                <MenuItem value="3">اختبار قياس وتحديد المستوى</MenuItem>
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
                  setQuestionData({
                    ...questionData,
                    startDate: e.target.value,
                  })
                }
                InputLabelProps={{ shrink: true }}
                style={styles.input}
              />
              <TextField
                label={t('adminDashboard.startTime')}
                type="time"
                fullWidth
                value={questionData.startTime}
                onChange={(e) =>
                  setQuestionData({
                    ...questionData,
                    startTime: e.target.value,
                  })
                }
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
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
              <FormControl component="fieldset" style={styles.input}>
                <FormLabel component="legend">
                  هل تريد إدخال الأسئلة يدوياً أم تلقائياً؟
                </FormLabel>
                <RadioGroup
                  row
                  value={questionData.generationMethod}
                  onChange={(e) =>
                    setQuestionData({
                      ...questionData,
                      generationMethod: e.target.value,
                      questions: [],
                    })
                  }
                >
                  <FormControlLabel
                    value="manual"
                    control={<Radio color="primary" />}
                    label="يدوياً (Manual)"
                  />
                  <FormControlLabel
                    value="automatic"
                    control={<Radio color="primary" />}
                    label="تلقائياً (Automatic)"
                  />
                </RadioGroup>
              </FormControl>
              {questionData.generationMethod === 'automatic' && (
                <Card style={{ padding: '16px', marginBottom: '16px' }}>
                  <Typography variant="h6" gutterBottom>
                    إعداد الأسئلة التلقائية
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <TextField
                        label="أقل ديجيت"
                        type="number"
                        fullWidth
                        value={autoGenConfig.minDigits}
                        onChange={(e) => {
                          const newVal = Math.max(
                            1,
                            parseInt(e.target.value, 10)
                          );
                          setAutoGenConfig({
                            ...autoGenConfig,
                            minDigits: newVal,
                          });
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label="أعلى ديجيت"
                        type="number"
                        fullWidth
                        value={autoGenConfig.maxDigits}
                        onChange={(e) => {
                          const newVal = parseInt(e.target.value, 10);
                          setAutoGenConfig({
                            ...autoGenConfig,
                            maxDigits:
                              newVal < autoGenConfig.minDigits
                                ? autoGenConfig.minDigits
                                : newVal,
                          });
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label="عدد الأرقام في السؤال"
                        type="number"
                        fullWidth
                        value={autoGenConfig.numberCount}
                        onChange={(e) =>
                          setAutoGenConfig({
                            ...autoGenConfig,
                            numberCount: Math.max(
                              2,
                              parseInt(e.target.value, 10)
                            ),
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="عدد الأسئلة في كل صفحة"
                        type="number"
                        fullWidth
                        value={autoGenConfig.questionsPerPage}
                        onChange={(e) =>
                          setAutoGenConfig({
                            ...autoGenConfig,
                            questionsPerPage: Math.max(
                              1,
                              parseInt(e.target.value, 10)
                            ),
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="عدد الصفحات"
                        type="number"
                        fullWidth
                        value={autoGenConfig.numberOfPages}
                        onChange={(e) =>
                          setAutoGenConfig({
                            ...autoGenConfig,
                            numberOfPages: Math.max(
                              1,
                              parseInt(e.target.value, 10)
                            ),
                          })
                        }
                      />
                    </Grid>
                  </Grid>
                  <Box mt={2}>
                    <Typography>العمليات:</Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={autoGenConfig.operations.plus}
                          onChange={(e) =>
                            setAutoGenConfig({
                              ...autoGenConfig,
                              operations: {
                                ...autoGenConfig.operations,
                                plus: e.target.checked,
                              },
                            })
                          }
                        />
                      }
                      label="جمع (+)"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={autoGenConfig.operations.minus}
                          onChange={(e) =>
                            setAutoGenConfig({
                              ...autoGenConfig,
                              operations: {
                                ...autoGenConfig.operations,
                                minus: e.target.checked,
                              },
                            })
                          }
                        />
                      }
                      label="طرح (-)"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={autoGenConfig.operations.multiply}
                          onChange={(e) =>
                            setAutoGenConfig({
                              ...autoGenConfig,
                              operations: {
                                ...autoGenConfig.operations,
                                multiply: e.target.checked,
                              },
                            })
                          }
                        />
                      }
                      label="ضرب (×)"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={autoGenConfig.operations.divide}
                          onChange={(e) =>
                            setAutoGenConfig({
                              ...autoGenConfig,
                              operations: {
                                ...autoGenConfig.operations,
                                divide: e.target.checked,
                              },
                            })
                          }
                        />
                      }
                      label="قسمة (÷)"
                    />
                  </Box>
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{ marginTop: '16px' }}
                    onClick={handleAutoGeneration}
                  >
                    توليد الأسئلة تلقائياً
                  </Button>
                  {autoGenPreview.length > 0 && (
                    <Card style={{ marginTop: '16px', padding: '10px' }}>
                      <Typography variant="h6" gutterBottom>
                        تم توليد {autoGenPreview.length} سؤال، يرجى المراجعة
                      </Typography>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>المسألة</TableCell>
                            <TableCell>الإجابة الصحيحة</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {autoGenPreview.map((q, idx) => {
                            const expression = q.numbers
                              .map((num, index) =>
                                index < q.operations.length
                                  ? `${num.value} ${q.operations[index]}`
                                  : num.value
                              )
                              .join(' ');
                            return (
                              <TableRow key={idx}>
                                <TableCell>{expression}</TableCell>
                                <TableCell>{q.correctAnswer}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                      <Box mt={2} display="flex" justifyContent="space-between">
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={handleConfirmAutoGen}
                        >
                          تأكيد الأسئلة
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={handleDiscardAutoGen}
                        >
                          تجاهل
                        </Button>
                      </Box>
                    </Card>
                  )}
                </Card>
              )}
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleCreateExam}
                style={styles.button}
              >
                {t('adminDashboard.scheduleExam')}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        {questionData.generationMethod === 'manual' && (
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
                      onChange={(e) =>
                        handleNumberChange(num.id, e.target.value)
                      }
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
                        <MenuItem value="+">
                          {t('operations.addition')}
                        </MenuItem>
                        <MenuItem value="-">
                          {t('operations.subtraction')}
                        </MenuItem>
                        <MenuItem value="*">
                          {t('operations.multiplication')}
                        </MenuItem>
                        <MenuItem value="/">
                          {t('operations.division')}
                        </MenuItem>
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
        )}
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
                    <TableRow key={exam._id}>
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
                            const token = localStorage.getItem('token');
                            if (!token) {
                              alert(
                                'Authentication token is missing. Please log in again.'
                              );
                              return;
                            }
                            const response = await axios.delete(
                              `https://exam-server-psi.vercel.app/api/exam/${selectedExam._id}/question/${idx}`,
                              {
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                  'Content-Type': 'application/json',
                                },
                              }
                            );
                            const updatedExam = response.data.exam;
                            dispatch(
                              updateExam({ id: updatedExam._id, updatedExam })
                            );
                            setSelectedExam(updatedExam);
                            alert('Question deleted successfully!');
                          } catch (error) {
                            console.error('Error deleting question:', error);
                            alert(
                              'Failed to delete the question. Please try again.'
                            );
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
  cardTitle: { fontWeight: '500', color: '#1565c0' },
  input: { marginBottom: '15px' },
  button: {
    fontWeight: 'bold',
    marginTop: '15px',
    backgroundColor: '#1565c0',
    color: '#fff',
    padding: '10px',
    borderRadius: '10px',
    '&:hover': { backgroundColor: '#0d47a1' },
  },
  optionContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  iconButton: { marginLeft: '10px' },
  addButton: { marginBottom: '15px' },
  modalBox: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '80vh',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    border: '1px solid #e0e0e0',
    zIndex: 1050,
    animation: 'fadeIn 0.3s ease',
  },
  scrollableContent: {
    maxHeight: '70vh',
    overflowY: 'auto',
    padding: '12px',
    marginRight: '-12px',
    scrollbarColor: '#1565c0 #e0e0e0',
    scrollbarWidth: 'thin',
  },
};

export default AdminDashboard;
