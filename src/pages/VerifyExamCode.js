import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Card, CardContent } from "@mui/material";
import { useLocation } from "react-router-dom";
import "./VerifyExamCode.css"; // Updated CSS
import { useNavigate } from 'react-router-dom';

const VerifyExamCode = () => {
  const location = useLocation();
  const { emailStudent, examId } = location.state || {};
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleVerifyCode = async () => {
    if (!emailStudent || !examId || !code) {
      setError("يجب إدخال جميع البيانات للتحقق من الكود");
      return;
    }

    try {
      const response = await axios.post("https://exam-server-psi.vercel.app/verify-code", {
        emailStudent,
        examId,
        code,
      });

      setMessage(response.data.message);
      navigate("/level-selection",{ state: { examId } }); // Pass examId to next page

      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "حدث خطأ أثناء التحقق من الكود");
      setMessage("");
    }
  };

  return (
    <div className="verify-code-container">
      <Card className="verify-card">
        <CardContent>
          <Typography variant="h5" className="title">
            التحقق من كود الامتحان
          </Typography>

          <TextField
            type="text"
            label="أدخل كود التحقق"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            fullWidth
            className="input-field"
          />

          <Button
            onClick={handleVerifyCode}
            variant="contained"
            color="primary"
            className="verify-button"
          >
            التحقق من الكود
          </Button>

          {message && <Typography className="success-message">{message}</Typography>}
          {error && <Typography className="error-message">{error}</Typography>}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyExamCode;
