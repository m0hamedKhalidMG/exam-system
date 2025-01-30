import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogContent,
  IconButton,
  Grid,
  useMediaQuery,
  Hidden,
} from '@mui/material';
import { Block, GetApp, Done } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import jsPDF from 'jspdf';
import { Chart } from 'react-google-charts';
import { useTranslation } from 'react-i18next';
import axios from "axios";
import { useTheme } from '@mui/material/styles';

const AdminViewStudents = () => {
  const { t } = useTranslation(); // Translation hook
  const students = useSelector((state) => state.admin.students);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch students from backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
  
        if (!token) {
          alert('Authentication token is missing. Please log in again.');
          return;
        }
        const response = await axios.get("http://localhost:5000/api/user/students", {
          headers: {
            Authorization: `Bearer ${token}`, // Add Bearer token in headers
            'Content-Type': 'application/json', // Set content type
          },
        });
        console.log(response.data)
        dispatch({ type: "admin/setStudents", payload: response.data });
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [dispatch]);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpen(true);
  };

  const handleBlockStudent = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert(t("adminViewStudents.alerts.authMissing"));
        return;
      }
  
      const response = await axios.post(
        `http://localhost:5000/api/user/suspend/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      alert(response.data.message);
      dispatch({ type: "admin/blockStudent", payload: id }); // Update local state
    } catch (error) {
      console.error("Error blocking student:", error);
      alert(t("adminViewStudents.alerts.errorBlocking"));
    }
  };
  
  const handleUnblockStudent = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert(t("adminViewStudents.alerts.authMissing"));
        return;
      }
  
      const response = await axios.post(
        `http://localhost:5000/api/user/unsuspend/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      alert(response.data.message);
      dispatch({ type: "admin/unblockStudent", payload: id }); // Update local state
    } catch (error) {
      console.error("Error unblocking student:", error);
      alert(t("adminViewStudents.alerts.errorUnblocking"));
    }
  };
  
  const downloadPDF = () => {
    const doc = new jsPDF();
    const leftMargin = 10;
    const topMargin = 10;
    const cellPadding = 2;
    const cellWidth = [40, 20, 60, 40, 20];
    let y = topMargin + 20;

    doc.setFontSize(18);
    doc.setTextColor(33, 33, 33);
    doc.text("Student Details Report", leftMargin, topMargin + 10);

    const headers = ["Name", "Age", "Email", "whatsappNumber", "Blocked"];
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    let x = leftMargin;

    headers.forEach((header, index) => {
      doc.rect(x, y, cellWidth[index], 10);
      doc.text(header, x + cellPadding, y + 7);
      x += cellWidth[index];
    });

    y += 12;

    doc.setFont("helvetica", "normal");
    students.forEach((student) => {
      x = leftMargin;
      const row = [
        String(student.name),
        String(student.age),
        String(student.email),
        String(student.whatsappNumber),
        String(student.suspended ? "Yes" : "No"),
      ];
      row.forEach((text, index) => {
        doc.rect(x, y, cellWidth[index], 10);
        const splitText = doc.splitTextToSize(text, cellWidth[index] - 2 * cellPadding);
        doc.text(splitText, x + cellPadding, y + 7);
        x += cellWidth[index];
      });
      y += 12;

      if (y > 250) {
        doc.addPage();
        y = topMargin + 20;
      }
    });

    doc.save("students_report.pdf");
  };
  
  const performanceChartData = [
    [
      t("adminViewStudents.chart.labels.student"),
      t("adminViewStudents.chart.labels.examsTaken"),
      t("adminViewStudents.chart.labels.examsPassed"),
      t("adminViewStudents.chart.labels.averageScore"),
    ],
    ...students.map((student) => [
      student.name,
      student.examsTaken || 0,
      student.examsPassed || 0,
      student.averageScore || 0,
    ]),
  ];

  const blockedData = [
    [
      t("adminViewStudents.chart.labels.status"),
      t("adminViewStudents.chart.labels.count"),
    ],
    [
      t("adminViewStudents.status.blocked"),
      students.filter((s) => s.suspended).length,
    ],
    [
      t("adminViewStudents.status.active"),
      students.filter((s) => !s.suspended).length,
    ],
  ];

  const chartOptions = {
    title: t("adminViewStudents.chart.performanceTitle"),
    vAxis: { title: t("adminViewStudents.chart.labels.countScore") },
    hAxis: { title: t("adminViewStudents.chart.labels.student") },
    legend: { position: "bottom" },
    seriesType: "bars",
    series: { 2: { type: "line" } },
  };

  const pieChartOptions = {
    title: t("adminViewStudents.chart.blockedTitle"),
    is3D: true,
    colors: ["#d32f2f", "#4caf50"],
  };

  return (
    <Grid container spacing={2} style={{ padding: "20px" }}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h4">
              {t("adminViewStudents.title")}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={downloadPDF}
            >
              <GetApp style={{ marginRight: "10px" }} />
              {t("adminViewStudents.downloadButton")}
            </Button>
            <Table>
              <TableHead>
                <TableRow>
                  <Hidden smDown>
                    <TableCell>{t("adminViewStudents.table.image")}</TableCell>
                  </Hidden>
                  <TableCell>{t("adminViewStudents.table.name")}</TableCell>
                  <Hidden smDown>
                    <TableCell>{t("adminViewStudents.table.email")}</TableCell>
                  </Hidden>
                  <TableCell>{t("adminViewStudents.table.phone")}</TableCell>
                  <Hidden smDown>
                    <TableCell>{t("adminViewStudents.table.age")}</TableCell>
                  </Hidden>
                  <TableCell>{t("adminViewStudents.table.blocked")}</TableCell>
                  <TableCell>{t("adminViewStudents.table.actions")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <Hidden smDown>
                      <TableCell>
                        <img
                          src={student.profileImage}
                          alt={student.name}
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            cursor: "pointer",
                          }}
                          onClick={() => handleImageClick(student.profileImage)}
                        />
                      </TableCell>
                    </Hidden>
                    <TableCell>{student.name}</TableCell>
                    <Hidden smDown>
                      <TableCell>{student.email}</TableCell>
                    </Hidden>
                    <TableCell>{student.whatsappNumber}</TableCell>
                    <Hidden smDown>
                      <TableCell>{student.age}</TableCell>
                    </Hidden>
                    <TableCell>
                      {student.suspended
                        ? t("adminViewStudents.status.yes")
                        : t("adminViewStudents.status.no")}
                    </TableCell>
                    <TableCell>
                      {student.suspended ? (
                        <IconButton
                          color="success"
                          onClick={() => handleUnblockStudent(student._id)}
                        >
                          <Done />
                        </IconButton>
                      ) : (
                        <IconButton
                          color="secondary"
                          onClick={() => handleBlockStudent(student._id)}
                        >
                          <Block />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Grid>

      {/* Image Modal */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <img
            src={selectedImage}
            alt="Student"
            style={{ width: "100%", height: "auto", borderRadius: "8px" }}
          />
        </DialogContent>
      </Dialog>
{/* 
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h5">
              {t("adminViewStudents.chart.performanceTitle")}
            </Typography>
            <Chart
              chartType="ComboChart"
              data={performanceChartData}
              options={chartOptions}
              width="100%"
              height="400px"
            />
          </CardContent>
        </Card>
      </Grid> */}

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h5">
              {t("adminViewStudents.chart.blockedTitle")}
            </Typography>
            <Chart
              chartType="PieChart"
              data={blockedData}
              options={pieChartOptions}
              width="100%"
              height="400px"
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AdminViewStudents;