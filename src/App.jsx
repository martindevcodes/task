import { useState } from "react";
import "./App.css";

function App() {
  const initialFormState = {
    name: "",
    email: "",
    ageGroup: "",
    feedback: "",
    contactPermission: ""
  };

  const [formData, setFormData] = useState(initialFormState);
  const [feedbackList, setFeedbackList] = useState([]);
  const [errors, setErrors] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error while typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Simple validation
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.ageGroup) newErrors.ageGroup = "Select an age group";

    if (!formData.feedback.trim()) newErrors.feedback = "Feedback is required";

    if (!formData.contactPermission)
      newErrors.contactPermission = "Select yes or no";

    return newErrors;
  };
// Add this function inside your component

// Count completed fields and return percentage
const getProgress = () => {
  const totalFields = 5; // name, email, ageGroup, feedback, contactPermission
  let completed = 0;

  if (formData.name.trim()) completed++;
  if (formData.email.trim() && /\S+@\S+\.\S+/.test(formData.email)) completed++;
  if (formData.ageGroup) completed++;
  if (formData.feedback.trim()) completed++;
  if (formData.contactPermission) completed++;

  return Math.round((completed / totalFields) * 100);
};

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (editingIndex !== null) {
      const updatedList = [...feedbackList];
      updatedList[editingIndex] = formData;
      setFeedbackList(updatedList);
      setEditingIndex(null);
    } else {
      setFeedbackList((prev) => [...prev, formData]);
    }

    setFormData(initialFormState);
    setErrors({});
  };

  // Handle reset
  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
  };

  // Delete feedback
  const handleDelete = (index) => {
    const updatedList = feedbackList.filter((_, i) => i !== index);
    setFeedbackList(updatedList);
  };

  // Edit feedback
  const handleEdit = (index) => {
    setFormData(feedbackList[index]);
    setEditingIndex(index);
  };

  return (
    <>
    <div className="progress-container">
  <div
    className="progress-bar"
    style={{ width: `${getProgress()}%` }}
  ></div>
  <p>{getProgress()}% Completed</p>
</div>

      <form className="feedback-form" onSubmit={handleSubmit}>
        <h2>Customer Feedback</h2>

        <input
          name="name"
          type="text"
          placeholder="Enter your name"
          className="form-input"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <p className="error">{errors.name}</p>}

        <input
          name="email"
          type="email"
          placeholder="Enter your email"
          className="form-input"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <select
          name="ageGroup"
          className="form-input"
          value={formData.ageGroup}
          onChange={handleChange}
        >
          <option value="">Select your age group</option>
          <option value="18-24">18 – 24</option>
          <option value="25-34">25 – 34</option>
          <option value="35-44">35 – 44</option>
          <option value="45-54">45 – 54</option>
          <option value="55+">55+</option>
        </select>
        {errors.ageGroup && <p className="error">{errors.ageGroup}</p>}

        <textarea
          name="feedback"
          placeholder="Write your feedback here..."
          className="form-textarea"
          rows="4"
          value={formData.feedback}
          onChange={handleChange}
        />
        {errors.feedback && <p className="error">{errors.feedback}</p>}

        <div className="radio-group">
          <p>May we contact you?</p>

          <label>
            <input
              type="radio"
              name="contactPermission"
              value="YES"
              checked={formData.contactPermission === "YES"}
              onChange={handleChange}
            />
            Yes
          </label>

          <label>
            <input
              type="radio"
              name="contactPermission"
              value="NO"
              checked={formData.contactPermission === "NO"}
              onChange={handleChange}
            />
            No
          </label>
          {errors.contactPermission && (
            <p className="error">{errors.contactPermission}</p>
          )}
        </div>

        <div className="button-group">
          <button type="submit" className="submit-btn">
            {editingIndex !== null ? "Update" : "Submit"}
          </button>
          <button type="button" className="reset-btn" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>

      {/* Feedback List */}
      {feedbackList.length > 0 && (
        <div className="feedback-list">
          <h3>Submitted Feedbacks</h3>
          {feedbackList.map((item, index) => (
            <div key={index} className="feedback-card">
              <p><b>Name:</b> {item.name}</p>
              <p><b>Email:</b> {item.email}</p>
              <p><b>Age Group:</b> {item.ageGroup}</p>
              <p><b>Feedback:</b> {item.feedback}</p>
              <p><b>Contact Permission:</b> {item.contactPermission}</p>

              <div className="card-buttons">
                <button className="edit-btn" onClick={() => handleEdit(index)}>
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default App;
