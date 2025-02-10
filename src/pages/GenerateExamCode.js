import React, { useState } from "react";
import axios from "axios";
import { MenuItem, Select } from "@mui/material"; // Import Select & MenuItem
import "./GenerateExamCode.css";

const GenerateExamCode = () => {
  const [emailStudent, setEmailStudent] = useState("");
  const [examId, setExamId] = useState(""); // Changed from text input to Select
  const [generatedCode, setGeneratedCode] = useState(null);
  const [error, setError] = useState("");

  const handleGenerateCode = async () => {
    if (!emailStudent || !examId) {
      setError("يجب إدخال البريد الإلكتروني واختيار فئة الامتحان");
      return;
    }

    try {
      const response = await axios.post("https://exam-server-psi.vercel.app/generate-code", {
        emailStudent,
        examId,
      });

      setGeneratedCode(response.data.code);
      setError("");
    } catch (error) {
      setError(error.response?.data?.error || "حدث خطأ أثناء إنشاء الكود");
    }
  };

  return (
    <div className="generate-code-container">
      <h2>توليد كود الامتحان</h2>

      <input
        type="email"
        value={emailStudent}
        onChange={(e) => setEmailStudent(e.target.value)}
        placeholder="البريد الإلكتروني للطالب"
        className="input-field"
      />

      <Select
        value={examId}
        onChange={(e) => setExamId(e.target.value)}
        displayEmpty
        className="select-field"
      >
        <MenuItem value="1">اختر فئة الامتحان</MenuItem>
        <MenuItem value="2">التحدي والمنافسة</MenuItem>
        <MenuItem value="3">اختبار قياس وتحديد المستوى</MenuItem>
      </Select>

      <button onClick={handleGenerateCode} className="generate-button">
        إنشاء الكود
      </button>

      {generatedCode && (
        <div className="generated-code">
          <p>تم إنشاء الكود بنجاح!</p>
          <h3>{generatedCode}</h3>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default GenerateExamCode;
