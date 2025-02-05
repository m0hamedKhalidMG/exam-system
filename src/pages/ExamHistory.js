import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import { GetApp } from "@mui/icons-material";

const ExamHistoryCard = ({ student, onImageClick }) => {
    const getGrade = (score, total) => {
        if (total === 0) return "غير متاح"; // Handle zero division case
        const percentage = (score / total) * 100;
      
        if (percentage >= 90) return "ممتاز";
        if (percentage >= 75) return "جيد جدًا";
        if (percentage >= 60) return "جيد";
        if (percentage >= 50) return "مقبول";
        return "راسب";
      };
      

  return (
    <TableRow>
      <TableCell>
        <img
          src={student.userId.profileImage}
          alt="Student"
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            cursor: "pointer",
            border: "2px solid gray",
          }}
          onClick={() => onImageClick(student.userId.profileImage)}
        />
      </TableCell>
      <TableCell>{student.userId.name}</TableCell>
      <TableCell>{`${getGrade(student.score,student.total)}`}</TableCell>
      <TableCell>{student.score}</TableCell>
      <TableCell>{student.total - student.score}</TableCell>
      <TableCell>{`${student.timeexam} ثانيه`}</TableCell>
    </TableRow>
  );
};

const ExamHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://exam-server-psi.vercel.app/api/exam/history", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setHistory(data.history);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching history:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Grid container spacing={2} style={{ padding: "20px" }}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h4">📜 سجل الامتحانات</Typography>
            {loading ? (
              <CircularProgress />
            ) : history.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>الصورة</TableCell>
                    <TableCell>الاسم</TableCell>
                    <TableCell>الدرجة</TableCell>
                    <TableCell>✅ صحيحة</TableCell>
                    <TableCell>❌ خاطئة</TableCell>
                    <TableCell>⏳ الوقت</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map((student) => (
                    <ExamHistoryCard
                      key={student._id}
                      student={student}
                      onImageClick={setModalImage}
                    />
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography variant="h6">لا توجد بيانات متاحة.</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Image Modal */}
      <Dialog open={!!modalImage} onClose={() => setModalImage(null)}>
        <DialogContent>
          <img
            src={modalImage}
            alt="Student"
            style={{ width: "100%", height: "auto", borderRadius: "8px" }}
          />
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default ExamHistory;
