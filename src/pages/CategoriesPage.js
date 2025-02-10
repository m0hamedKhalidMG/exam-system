import React from "react";
import { useNavigate } from "react-router-dom";
import "./CategoriesPage.css"; // Import the CSS file

const categories = [
  { id: "1", title: "التدريب والتأهيل البصري", description: "السرعة والخيال الذهني "},
  { id: "3", title: "اختبار قياس وتحديد المستوى", description: "مستويات متقدمة _مشاركة في البطولات ✅المحلية-الدولية-العالمية" },
  { id: "2", title: "التحدي والمنافسة", description: "أحصل على الجوائز والتكريمات" },
];

const CategoriesPage = () => {
  const navigate = useNavigate();

  const handleSelectCategory = (examId) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const emailStudent = userInfo?.email;

    if (!emailStudent) {
      alert("يجب تسجيل البريد الإلكتروني أولًا!");
      return;
    }

    if (examId === "1") {
      navigate("/level-selection", { state: { examId } });
      return;
    }

    navigate("/verify-code", { state: { emailStudent, examId } });
  };

  return (
    <div className="categories-container">
      <h1 className="title">اختَر فئتك</h1>
      <div className="categories-grid">
        {categories.map((category) => (
          <div key={category.id} className="category-card">
            <h2 className="category-title">{category.title}</h2>
            <p className="category-description">{category.description}</p>
            <button className="explore-button" onClick={() => handleSelectCategory(category.id)}>
              استكشاف
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
