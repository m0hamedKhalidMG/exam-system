import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const Leaderboard = () => {
  const { t } = useTranslation();

  const students = [
    { id: 1, name: 'John Doe', score: 95 },
    { id: 2, name: 'Jane Smith', score: 90 },
    { id: 3, name: 'Alice Johnson', score: 85 },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h3" gutterBottom>
        {t('leaderboard.title')}
      </Typography>
      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('leaderboard.rank')}</TableCell>
                  <TableCell>{t('leaderboard.name')}</TableCell>
                  <TableCell>{t('leaderboard.score')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student, index) => (
                  <TableRow key={student.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
