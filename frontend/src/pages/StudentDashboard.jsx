import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { StarRatingInput } from "../components/StarRating";
import Alert from "../components/Alert";
import {
  getFacultiesList,
  getCoursesForFaculty,
  submitStudentFeedback,
  getStudentFeedbackHistory,
  updateUserProfile,
} from "../utils/storage";

export default function StudentDashboard({ user, onLogout, onUpdateUser }) {
  const [activeTab, setActiveTab] = useState("feedback");
  const [alert, setAlert] = useState(null);

  // Submit Feedback State
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [ratings, setRatings] = useState({
    teaching: 0,
    communication: 0,
    helpfulness: 0,
    knowledge: 0,
    organization: 0,
    availability: 0,
    fairness: 0,
  });
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // History State
  const [history, setHistory] = useState([]);

  // Profile State
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileDept, setProfileDept] = useState(user?.department || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);

  useEffect(() => {
    setFaculties(getFacultiesList());
    loadHistory();
  }, [user]);

  useEffect(() => {
    if (selectedFaculty) {
      const courseList = getCoursesForFaculty(selectedFaculty);
      setCourses(courseList);
      setSelectedCourse("");
    } else {
      setCourses([]);
      setSelectedCourse("");
    }
  }, [selectedFaculty]);

  const loadHistory = () => {
    if (user?.email) {
      setHistory(getStudentFeedbackHistory(user.email));
    }
  };

  const handleRatingChange = (category, value) => {
    setRatings((prev) => ({ ...prev, [category]: value }));
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!selectedFaculty || !selectedCourse) {
      setAlert({
        type: "error",
        message: "Please select both a faculty member and a course.",
      });
      return;
    }

    const unrated = Object.entries(ratings).filter(
      ([_, val]) => !val || val === 0,
    );
    if (unrated.length > 0) {
      setAlert({
        type: "error",
        message: "Please provide a rating for all 7 evaluation criteria.",
      });
      return;
    }

    setSubmitting(true);
    const result = await submitStudentFeedback({
      studentEmail: user.email,
      studentName: user.name,
      facultyId: selectedFaculty,
      courseId: selectedCourse,
      ratings,
      comments,
    });
    setSubmitting(false);

    if (result.success) {
      setAlert({
        type: "success",
        message:
          "Feedback submitted successfully! Thank you for your contribution.",
      });
      // Reset form
      setSelectedFaculty("");
      setSelectedCourse("");
      setRatings({
        teaching: 0,
        communication: 0,
        helpfulness: 0,
        knowledge: 0,
        organization: 0,
        availability: 0,
        fairness: 0,
      });
      setComments("");
      loadHistory();
    } else {
      setAlert({
        type: "error",
        message: "Failed to submit feedback. Please try again.",
      });
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!profileName.trim()) {
      setAlert({ type: "error", message: "Full Name cannot be empty." });
      return;
    }

    setUpdatingProfile(true);
    const result = await updateUserProfile(user.email, {
      name: profileName,
      department: profileDept,
      currentPassword,
      newPassword,
    });
    setUpdatingProfile(false);

    if (result.success) {
      setAlert({ type: "success", message: result.message });
      setCurrentPassword("");
      setNewPassword("");
      onUpdateUser({ ...user, name: profileName, department: profileDept });
    } else {
      setAlert({ type: "error", message: result.message });
    }
  };

  const navLinks = [
    {
      id: "feedback",
      label: "Submit Feedback",
      icon: "fa-solid fa-pen-to-square",
    },
    {
      id: "history",
      label: "Feedback History",
      icon: "fa-solid fa-clock-rotate-left",
    },
    { id: "profile", label: "My Profile", icon: "fa-regular fa-user" },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar
        user={user}
        links={navLinks}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setAlert(null);
        }}
        onLogout={onLogout}
        brandTitle="EduFeedback"
      />

      <main className="dashboard-main-content">
        <header className="dashboard-top-header">
          <div className="header-titles">
            <h1>Student Dashboard</h1>
            <p className="welcome-tagline">
              Welcome back, <strong>{user?.name || "Student"}</strong>! Submit
              feedback and review your submissions.
            </p>
          </div>
        </header>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {/* Tab 1: Submit Feedback */}
        {activeTab === "feedback" && (
          <section className="dashboard-card">
            <div className="card-section-header">
              <h2>Submit Faculty Feedback</h2>
              <p className="section-desc">
                Evaluate your instructor across seven core teaching dimensions.
                All feedback is anonymized when presented to faculty.
              </p>
            </div>

            <form
              onSubmit={handleFeedbackSubmit}
              className="feedback-submission-form"
            >
              <div className="form-grid-two">
                <div className="form-group">
                  <label htmlFor="faculty-select">
                    Select Faculty Member *
                  </label>
                  <select
                    id="faculty-select"
                    value={selectedFaculty}
                    onChange={(e) => setSelectedFaculty(e.target.value)}
                    required
                  >
                    <option value="">-- Choose Faculty --</option>
                    {faculties.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="course-select">Select Course *</label>
                  <select
                    id="course-select"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    disabled={!selectedFaculty}
                    required
                  >
                    <option value="">
                      {!selectedFaculty
                        ? "-- Select a faculty first --"
                        : "-- Choose Course --"}
                    </option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="ratings-fieldset">
                <h3>Evaluation Criteria (1 to 5 Stars)</h3>

                <div className="criteria-grid">
                  <StarRatingInput
                    label="1. Teaching Quality"
                    value={ratings.teaching}
                    onChange={(v) => handleRatingChange("teaching", v)}
                  />
                  <StarRatingInput
                    label="2. Communication Skills"
                    value={ratings.communication}
                    onChange={(v) => handleRatingChange("communication", v)}
                  />
                  <StarRatingInput
                    label="3. Helpfulness & Mentorship"
                    value={ratings.helpfulness}
                    onChange={(v) => handleRatingChange("helpfulness", v)}
                  />
                  <StarRatingInput
                    label="4. Knowledge of Subject Matter"
                    value={ratings.knowledge}
                    onChange={(v) => handleRatingChange("knowledge", v)}
                  />
                  <StarRatingInput
                    label="5. Course Content Organization"
                    value={ratings.organization}
                    onChange={(v) => handleRatingChange("organization", v)}
                  />
                  <StarRatingInput
                    label="6. Availability Outside Class"
                    value={ratings.availability}
                    onChange={(v) => handleRatingChange("availability", v)}
                  />
                  <StarRatingInput
                    label="7. Fairness in Grading"
                    value={ratings.fairness}
                    onChange={(v) => handleRatingChange("fairness", v)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="feedback-comments">
                  Additional Qualitative Comments
                </label>
                <textarea
                  id="feedback-comments"
                  rows={4}
                  placeholder="Share constructive comments, course highlights, or areas for improvement..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-submit-lg"
                disabled={submitting}
              >
                <i className="fa-regular fa-paper-plane"></i>
                <span>
                  {submitting ? "Submitting Feedback..." : "Submit Feedback"}
                </span>
              </button>
            </form>
          </section>
        )}

        {/* Tab 2: Feedback History */}
        {activeTab === "history" && (
          <section className="dashboard-card">
            <div className="card-section-header">
              <h2>Your Feedback History</h2>
              <p className="section-desc">
                Record of all feedback you have submitted to date.
              </p>
            </div>

            {history.length === 0 ? (
              <div className="empty-state-box">
                <i className="fa-regular fa-folder-open empty-icon"></i>
                <p>No feedback submitted yet.</p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setActiveTab("feedback")}
                >
                  Submit Your First Feedback
                </button>
              </div>
            ) : (
              <div className="history-cards-list">
                {history.map((fb) => (
                  <div key={fb.id} className="history-item-card">
                    <div className="history-card-header">
                      <div>
                        <h3>{fb.facultyName}</h3>
                        <span className="course-tag">
                          {fb.courseName} ({fb.courseCode})
                        </span>
                      </div>
                      <span className="history-date">
                        {new Date(fb.date).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="rating-pill-badges">
                      <span className="pill-badge">
                        Teaching: <strong>{fb.ratings.teaching}★</strong>
                      </span>
                      <span className="pill-badge">
                        Communication:{" "}
                        <strong>{fb.ratings.communication}★</strong>
                      </span>
                      <span className="pill-badge">
                        Helpfulness: <strong>{fb.ratings.helpfulness}★</strong>
                      </span>
                      {fb.ratings.knowledge && (
                        <span className="pill-badge">
                          Knowledge: <strong>{fb.ratings.knowledge}★</strong>
                        </span>
                      )}
                      {fb.ratings.organization && (
                        <span className="pill-badge">
                          Organization:{" "}
                          <strong>{fb.ratings.organization}★</strong>
                        </span>
                      )}
                      {fb.ratings.availability && (
                        <span className="pill-badge">
                          Availability:{" "}
                          <strong>{fb.ratings.availability}★</strong>
                        </span>
                      )}
                      {fb.ratings.fairness && (
                        <span className="pill-badge">
                          Fairness: <strong>{fb.ratings.fairness}★</strong>
                        </span>
                      )}
                    </div>

                    {fb.comments && (
                      <div className="history-comments-quote">
                        <p>"{fb.comments}"</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Tab 3: My Profile */}
        {activeTab === "profile" && (
          <section className="dashboard-card max-w-700">
            <div className="card-section-header">
              <h2>My Profile</h2>
              <p className="section-desc">
                Manage your account credentials and personal details.
              </p>
            </div>

            <form onSubmit={handleProfileSubmit} className="profile-edit-form">
              <div className="form-group">
                <label htmlFor="student-profile-name">Full Name</label>
                <input
                  id="student-profile-name"
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="student-profile-email">Email Address</label>
                <input
                  id="student-profile-email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="input-disabled"
                />
                <small className="help-text">
                  Email address is managed by administration.
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="student-profile-dept">Department</label>
                <input
                  id="student-profile-dept"
                  type="text"
                  value={profileDept}
                  onChange={(e) => setProfileDept(e.target.value)}
                  placeholder="e.g. Computer Science"
                />
              </div>

              <div className="password-update-box">
                <h3>Change Password</h3>
                <div className="form-group">
                  <label htmlFor="current-pw">Current Password</label>
                  <input
                    id="current-pw"
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new-pw">New Password</label>
                  <input
                    id="new-pw"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={updatingProfile}
              >
                {updatingProfile ? "Saving..." : "Save Profile Changes"}
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
