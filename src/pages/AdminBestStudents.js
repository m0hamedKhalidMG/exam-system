import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Grid, Avatar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import axios from "axios";

const AdminBestStudents = () => {
  const { t } = useTranslation(); // Translation hook
  const [bestStudents, setBestStudents] = useState([]); // State to store student data

  useEffect(() => {
    // Function to fetch data and handle token storage
    const fetchStudentData = async () => {
      try {
        // Get token from local storage
        const token = localStorage.getItem("token");

        // Set token in local storage (you might already have it, but adding here for clarity)
        localStorage.setItem("auth_token", token);

        // Send the request using axios
        const response = await axios.get("http://localhost:5000/api/exam/getbest", {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to the request header
          },
        });
        
        // Update state with the fetched student data
        console.log(response.data.studentExam)
        setBestStudents(response.data.studentExam);

      } catch (error) {
        console.error("Error fetching best students:", error);
      }
    };

    // Call the fetch function
    fetchStudentData();
  }, []); // Empty dependency array to run only once when component mounts

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <CardContent>
          <Typography variant="h4" align="center" style={styles.title}>
            {t('adminBestStudents.title')}
          </Typography>
          <Grid container spacing={3}>
            {bestStudents.map((student) => (
              <Grid item xs={12} sm={6} md={4} key={student.id}>
                <Card style={styles.studentCard}>
                  <CardContent>
                    <Avatar
                    //  src={student.image}
                      alt={student.userId.name}
                      style={styles.avatar}
                    >
                      {student.userId.name.charAt(0)}
                    </Avatar>
                    <Typography variant="h6" align="center">
                      {student.userId.name}
                    </Typography>
                    <Typography variant="body1" align="center">
                      {t('adminBestStudents.averageScore')}:{' '}
                      {student.score}
                    </Typography>
                    <Typography variant="body2" align="center">
                      {t('adminBestStudents.age')}: {student.userId.age}
                    </Typography>
                    <Typography variant="body2" align="center">
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
    padding: '20px',
    background:
      'linear-gradient(135deg, rgba(25, 118, 210, 0.9), rgba(37, 206, 209, 0.8))',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    maxWidth: '800px',
    width: '100%',
    padding: '20px',
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '10px',
  },
  title: {
    marginBottom: '20px',
    color: '#1565c0',
  },
  studentCard: {
    textAlign: 'center',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    padding: '20px',
  },
  avatar: {
    width: '80px',
    height: '80px',
    margin: '0 auto',
    marginBottom: '10px',
    backgroundColor: '#1565c0',
    color: '#fff',
  },
};

export default AdminBestStudents;
