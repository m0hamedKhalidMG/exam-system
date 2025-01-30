import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Grid, Avatar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import axios from "axios";

const AdminBestStudents = () => {
  const { t } = useTranslation();
  const [bestStudents, setBestStudents] = useState([]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem("token");
        localStorage.setItem("auth_token", token);

        const response = await axios.get("http://localhost:5000/api/exam/getbest", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBestStudents(response.data.studentExam);
      } catch (error) {
        console.error("Error fetching best students:", error);
      }
    };

    fetchStudentData();
  }, []);

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <CardContent>
          <Typography variant="h4" align="center" style={styles.title}>
            {t('adminBestStudents.title')}
          </Typography>
          <Grid container spacing={4}>
            {bestStudents.map((student) => (
              <Grid item xs={12} sm={6} md={4} key={student.id}>
                <Card style={styles.studentCard}>
                  <CardContent>
                    <Avatar
                      src={student.userId.profileImage}
                      alt={student.userId.name}
                      style={styles.avatar}
                    >
                      {student.userId.name.charAt(0)}
                    </Avatar>
                    <Typography variant="h6" align="center" style={styles.name}>
                      {student.userId.name}
                    </Typography>
                    <Typography variant="body1" align="center" style={styles.score}>
                      {t('adminBestStudents.averageScore')}: {student.score}
                    </Typography>
                    <Typography variant="body2" align="center" style={styles.text}>
                      {t('adminBestStudents.age')}: {student.userId.age}
                    </Typography>
                    <Typography variant="body2" align="center" style={styles.text}>
                      {t('adminBestStudents.email')}: {student.userId.email}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px 20px',
    background: 'linear-gradient(135deg, #1976D2, #25CED1)',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    maxWidth: '900px',
    width: '100%',
    padding: '30px',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '15px',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
  },
  title: {
    marginBottom: '30px',
    color: '#0D47A1',
    fontWeight: 'bold',
  },
  studentCard: {
    textAlign: 'center',
    background: 'rgba(255, 255, 255, 1)',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 18px rgba(0, 0, 0, 0.2)',
    },
  },
  avatar: {
    width: '90px',
    height: '90px',
    margin: '0 auto 15px',
    backgroundColor: '#0D47A1',
    color: '#fff',
    fontSize: '36px',
  },
  name: {
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: '8px',
  },
  score: {
    fontWeight: 'bold',
    fontSize: '16px',
    color: '#388E3C',
    marginBottom: '8px',
  },
  text: {
    fontSize: '14px',
    color: '#333',
  },
};

export default AdminBestStudents;
