import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { StarDisplay } from "../components/StarRating";
import Alert from "../components/Alert";
import {
  getFacultiesList,
  getCoursesForFaculty,
  getFacultyFeedbackSummary,
  updateUserProfile,
} from "../utils/storage";

export default function FacultyDashboard({ user, onLogout, onUpdateUser }) {
  const [activeTab, setActiveTab] = useState("feedback");
  const [alert, setAlert] = useState(null);

  // Faculty mapping
  const [facultyId, setFacultyId] = useState("f1");
  const [courses, setCourses] = useState([]);
  const [courseFilter, setCourseFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Summary statistics
  const [stats, setStats] = useState({
    feedbackCount: 0,
    teachingAvg: "0.0",
    communicationAvg: "0.0",
    helpfulnessAvg: "0.0",
    overallAvg: "0.0",
    anonymousComments: [],
  });

  // Profile state
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileDept, setProfileDept] = useState(user?.department || "");
  const [profileTitle, setProfileTitle] = useState(user?.title || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    // Resolve faculty id by email or default to f1
    const faculties = getFacultiesList();
    const match = faculties.find(
      (f) =>
        f.email?.toLowerCase() === user?.email?.toLowerCase() ||
        f.name?.toLowerCase() === user?.name?.toLowerCase(),
    );

    const resolvedId = match ? match.id : getFacultyIdByEmail(user?.email);
    setFacultyId(resolvedId);

    const fCourses = getCoursesForFaculty(resolvedId);
    setCourses(fCourses);
  }, [user]);

  useEffect(() => {
    if (facultyId) {
      const summary = getFacultyFeedbackSummary(
        facultyId,
        courseFilter,
        dateFilter,
      );
      setStats(summary);
    }
  }, [facultyId, courseFilter, dateFilter]);

  function getFacultyIdByEmail(email = "") {
    const map = {
      "john.smith@example.com": "f1",
      "jane.doe@example.com": "f2",
      "robert.johnson@example.com": "f3",
      "michael.williams@example.com": "f4",
      "sarah.brown@example.com": "f5",
      "david.miller@example.com": "f6",
    };
    return map[email.toLowerCase()] || "f1";
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!profileName.trim()) {
      setAlert({ type: "error", message: "Name cannot be empty." });
      return;
    }

    setSavingProfile(true);
    const result = await updateUserProfile(user.email, {
      name: profileName,
      department: profileDept,
      title: profileTitle,
      currentPassword,
      newPassword,
    });
    setSavingProfile(false);

    if (result.success) {
      setAlert({ type: "success", message: result.message });
      setCurrentPassword("");
      setNewPassword("");
      onUpdateUser({
        ...user,
        name: profileName,
        department: profileDept,
        title: profileTitle,
      });
    } else {
      setAlert({ type: "error", message: result.message });
    }
  };

  const navLinks = [
    {
      id: "feedback",
      label: "View Feedback",
      icon: "fa-regular fa-comment-dots",
    },
    { id: "courses", label: "My Courses", icon: "fa-solid fa-book-open" },
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
            <h1>Faculty Dashboard</h1>
            <p className="welcome-tagline">
              Welcome back, <strong>{user?.name || "Faculty Member"}</strong>!
              Explore student insights and course analytics.
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

        {/* Tab 1: View Feedback */}
        {activeTab === "feedback" && (
          <div>
            <div className="privacy-banner">
              <i className="fa-solid fa-shield-halved"></i>
              <div>
                <strong>Student Privacy Protected:</strong>
                <span>
                  {" "}
                  All feedback and ratings are completely anonymized to
                  encourage open, constructive, and honest dialogue.
                </span>
              </div>
            </div>

            <div className="filters-card">
              <div className="filter-item">
                <label htmlFor="course-filter-select">Filter by Course:</label>
                <select
                  id="course-filter-select"
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                >
                  <option value="all">All Courses</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-item">
                <label htmlFor="date-filter-select">Time Period:</label>
                <select
                  id="date-filter-select"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="recent">Last 30 Days</option>
                  <option value="semester">Current Semester</option>
                </select>
              </div>
            </div>

            <div className="stats-metric-grid">
              <div className="metric-card">
                <h4>Teaching Quality</h4>
                <StarDisplay rating={stats.teachingAvg} size="large" />
                <span className="metric-count-label">
                  Based on {stats.feedbackCount} reviews
                </span>
              </div>

              <div className="metric-card">
                <h4>Communication</h4>
                <StarDisplay rating={stats.communicationAvg} size="large" />
                <span className="metric-count-label">
                  Based on {stats.feedbackCount} reviews
                </span>
              </div>

              <div className="metric-card">
                <h4>Helpfulness & Mentoring</h4>
                <StarDisplay rating={stats.helpfulnessAvg} size="large" />
                <span className="metric-count-label">
                  Based on {stats.feedbackCount} reviews
                </span>
              </div>

              <div className="metric-card highlight-card">
                <h4>Overall Evaluation</h4>
                <StarDisplay rating={stats.overallAvg} size="large" />
                <span className="metric-count-label">
                  Cumulative score across 7 metrics
                </span>
              </div>
            </div>

            <section className="dashboard-card comments-card-wrapper">
              <div className="card-section-header">
                <h2>
                  Anonymous Student Comments ({stats.anonymousComments.length})
                </h2>
                <p className="section-desc">
                  Qualitative observations and suggestions submitted by your
                  students.
                </p>
              </div>

              {stats.anonymousComments.length === 0 ? (
                <div className="empty-state-box">
                  <i className="fa-regular fa-comment-slash empty-icon"></i>
                  <p>
                    No qualitative comments available for the selected filters.
                  </p>
                </div>
              ) : (
                <div className="comments-stream">
                  {stats.anonymousComments.map((comm, idx) => (
                    <div key={idx} className="comment-quote-card">
                      <p className="comment-body">"{comm.text}"</p>
                      <div className="comment-metadata">
                        <span className="meta-course-pill">
                          {comm.courseName}
                        </span>
                        <span className="meta-date">{comm.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* Tab 2: My Courses */}
        {activeTab === "courses" && (
          <section className="dashboard-card">
            <div className="card-section-header">
              <h2>My Assigned Courses</h2>
              <p className="section-desc">
                Overview of your active lecture modules and feedback volume.
              </p>
            </div>

            <div className="courses-grid">
              {courses.map((course) => {
                const courseFeedback = getFacultyFeedbackSummary(
                  facultyId,
                  course.id,
                  "all",
                );
                return (
                  <div key={course.id} className="course-profile-card">
                    <div className="course-badge">{course.code}</div>
                    <h3>{course.name}</h3>
                    <div className="course-stats-row">
                      <div className="course-stat">
                        <span className="stat-label">Enrolled:</span>
                        <span className="stat-value">40+</span>
                      </div>
                      <div className="course-stat">
                        <span className="stat-label">Feedback:</span>
                        <span className="stat-value">
                          {courseFeedback.feedbackCount}
                        </span>
                      </div>
                      <div className="course-stat">
                        <span className="stat-label">Avg:</span>
                        <span className="stat-value">
                          {courseFeedback.overallAvg}★
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-outline btn-block mt-3"
                      onClick={() => {
                        setCourseFilter(course.id);
                        setActiveTab("feedback");
                      }}
                    >
                      <i className="fa-solid fa-arrow-right"></i> View Course
                      Feedback
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Tab 3: My Profile */}
        {activeTab === "profile" && (
          <section className="dashboard-card max-w-700">
            <div className="card-section-header">
              <h2>Faculty Profile Details</h2>
              <p className="section-desc">
                Keep your academic title and department affiliation up to date.
              </p>
            </div>

            <form onSubmit={handleProfileSubmit} className="profile-edit-form">
              <div className="form-group">
                <label htmlFor="fac-name">Full Name</label>
                <input
                  id="fac-name"
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="fac-email">Email Address</label>
                <input
                  id="fac-email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="input-disabled"
                />
              </div>

              <div className="form-group">
                <label htmlFor="fac-dept">Department</label>
                <input
                  id="fac-dept"
                  type="text"
                  value={profileDept}
                  onChange={(e) => setProfileDept(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="fac-title">Academic Title / Rank</label>
                <input
                  id="fac-title"
                  type="text"
                  placeholder="e.g. Associate Professor"
                  value={profileTitle}
                  onChange={(e) => setProfileTitle(e.target.value)}
                />
              </div>

              <div className="password-update-box">
                <h3>Change Account Password</h3>
                <div className="form-group">
                  <label htmlFor="fac-current-pw">Current Password</label>
                  <input
                    id="fac-current-pw"
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="fac-new-pw">New Password</label>
                  <input
                    id="fac-new-pw"
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
                disabled={savingProfile}
              >
                {savingProfile ? "Saving..." : "Update Faculty Profile"}
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
