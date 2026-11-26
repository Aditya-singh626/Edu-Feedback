import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { StarDisplay } from "../components/StarRating";
import Alert from "../components/Alert";
import {
  getAdminOverviewData,
  getAllFeedbackForAdmin,
  getSystemStatistics,
  getCoursesForFaculty,
  getFacultiesList,
  updateUserProfile,
} from "../utils/storage";

export default function AdminDashboard({ user, onLogout, onUpdateUser }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [alert, setAlert] = useState(null);

  // Faculty Overview filters
  const [deptFilter, setDeptFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [facultyList, setFacultyList] = useState([]);

  // Detailed Feedback state
  const [selectedFacultyId, setSelectedFacultyId] = useState("f1");
  const [detailedCourseFilter, setDetailedCourseFilter] = useState("all");
  const [detailedDateFilter, setDetailedDateFilter] = useState("all");
  const [detailedFeedbackList, setDetailedFeedbackList] = useState([]);
  const [detailedFacultyCourses, setDetailedFacultyCourses] = useState([]);

  // System stats state
  const [sysStats, setSysStats] = useState({
    totalFaculties: 0,
    totalStudents: 0,
    totalCourses: 0,
    totalFeedback: 0,
    departmentStats: [],
  });

  // Profile state
  const [profileName, setProfileName] = useState(user?.name || "Admin User");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    loadOverview();
    loadSystemStats();
  }, [deptFilter, ratingFilter]);

  useEffect(() => {
    if (selectedFacultyId) {
      loadDetailedFeedback(selectedFacultyId);
    }
  }, [selectedFacultyId, detailedCourseFilter, detailedDateFilter]);

  const loadOverview = () => {
    const list = getAdminOverviewData(deptFilter, ratingFilter);
    setFacultyList(list);
  };

  const loadSystemStats = () => {
    const stats = getSystemStatistics();
    setSysStats(stats);
  };

  const loadDetailedFeedback = (fId) => {
    const fCourses = getCoursesForFaculty(fId);
    setDetailedFacultyCourses(fCourses);
    const feedbackItems = getAllFeedbackForAdmin(
      fId,
      detailedCourseFilter,
      detailedDateFilter,
    );
    setDetailedFeedbackList(feedbackItems);
  };

  const handleViewDetailed = (fId) => {
    setSelectedFacultyId(fId);
    setDetailedCourseFilter("all");
    setDetailedDateFilter("all");
    setActiveTab("detailed");
  };

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
      currentPassword,
      newPassword,
    });
    setSavingProfile(false);

    if (result.success) {
      setAlert({ type: "success", message: result.message });
      setCurrentPassword("");
      setNewPassword("");
      onUpdateUser({ ...user, name: profileName });
    } else {
      setAlert({ type: "error", message: result.message });
    }
  };

  const allFaculties = getFacultiesList();
  const selectedFaculty =
    allFaculties.find((f) => f.id === selectedFacultyId) || allFaculties[0];

  const navLinks = [
    { id: "overview", label: "Faculty Overview", icon: "fa-solid fa-gauge" },
    {
      id: "detailed",
      label: "Detailed Feedback",
      icon: "fa-solid fa-list-check",
    },
    {
      id: "statistics",
      label: "System Analytics",
      icon: "fa-solid fa-chart-pie",
    },
    { id: "profile", label: "Admin Profile", icon: "fa-regular fa-user" },
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
        brandTitle="EduFeedback Admin"
      />

      <main className="dashboard-main-content">
        <header className="dashboard-top-header">
          <div className="header-titles">
            <h1>Administrator Portal</h1>
            <p className="welcome-tagline">
              Comprehensive institutional overview of faculty performance,
              course reviews, and analytics.
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

        {/* Tab 1: Faculty Overview */}
        {activeTab === "overview" && (
          <div>
            <div className="filters-card">
              <div className="filter-item">
                <label htmlFor="admin-dept-filter">Department:</label>
                <select
                  id="admin-dept-filter"
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                >
                  <option value="all">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Engineering">Engineering</option>
                </select>
              </div>

              <div className="filter-item">
                <label htmlFor="admin-rating-filter">Minimum Rating:</label>
                <select
                  id="admin-rating-filter"
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                >
                  <option value="all">All Ratings</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                  <option value="3.0">3.0+ Stars</option>
                </select>
              </div>
            </div>

            <div className="faculty-cards-grid">
              {facultyList.length === 0 ? (
                <div className="empty-state-box full-width">
                  <i className="fa-regular fa-user-xmark empty-icon"></i>
                  <p>No faculty members match your filter criteria.</p>
                </div>
              ) : (
                facultyList.map((faculty) => (
                  <div key={faculty.id} className="faculty-overview-card">
                    <div className="fac-card-header">
                      <h3>{faculty.name}</h3>
                      <span className="fac-dept-badge">
                        {faculty.department}
                      </span>
                    </div>

                    <p className="fac-title-text">{faculty.title}</p>

                    <div className="fac-rating-box">
                      <StarDisplay rating={faculty.avgRating} size="medium" />
                      <span className="fac-total-reviews">
                        <i className="fa-regular fa-comment-dots"></i>{" "}
                        {faculty.feedbackCount} reviews
                      </span>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary btn-block mt-3"
                      onClick={() => handleViewDetailed(faculty.id)}
                    >
                      <i className="fa-regular fa-eye"></i> View Detailed
                      Feedback
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Detailed Feedback */}
        {activeTab === "detailed" && (
          <div>
            <div className="detailed-feedback-toolbar">
              <button
                type="button"
                className="btn btn-outline back-btn"
                onClick={() => setActiveTab("overview")}
              >
                <i className="fa-solid fa-arrow-left"></i> Back to Faculty
                Overview
              </button>
            </div>

            <div className="detailed-faculty-hero-banner">
              <div>
                <h2>{selectedFaculty?.name} - Detailed Feedback</h2>
                <p>
                  <strong>Department:</strong> {selectedFaculty?.department}{" "}
                  &nbsp;|&nbsp;
                  <strong> Title:</strong> {selectedFaculty?.title}
                </p>
              </div>
              <div className="faculty-selector-quick">
                <label htmlFor="quick-fac-switch">Switch Faculty:</label>
                <select
                  id="quick-fac-switch"
                  value={selectedFacultyId}
                  onChange={(e) => setSelectedFacultyId(e.target.value)}
                >
                  {allFaculties.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.department})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="filters-card">
              <div className="filter-item">
                <label htmlFor="detailed-course-select">
                  Filter by Course:
                </label>
                <select
                  id="detailed-course-select"
                  value={detailedCourseFilter}
                  onChange={(e) => setDetailedCourseFilter(e.target.value)}
                >
                  <option value="all">All Courses</option>
                  {detailedFacultyCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-item">
                <label htmlFor="detailed-date-select">Time Period:</label>
                <select
                  id="detailed-date-select"
                  value={detailedDateFilter}
                  onChange={(e) => setDetailedDateFilter(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="recent">Last 30 Days</option>
                  <option value="semester">Current Semester</option>
                </select>
              </div>
            </div>

            <div className="detailed-feedback-items-container">
              {detailedFeedbackList.length === 0 ? (
                <div className="empty-state-box">
                  <i className="fa-regular fa-comment-slash empty-icon"></i>
                  <p>
                    No individual feedback submissions found matching criteria.
                  </p>
                </div>
              ) : (
                detailedFeedbackList.map((item) => (
                  <div key={item.id} className="detailed-feedback-card">
                    <div className="df-header">
                      <div className="df-student-details">
                        <span className="df-student-name">
                          <i className="fa-regular fa-user"></i>{" "}
                          {item.studentName}
                        </span>
                        <span className="df-student-dept">
                          ({item.studentDepartment})
                        </span>
                      </div>
                      <span className="df-date">{item.formattedDate}</span>
                    </div>

                    <div className="df-course-info">
                      <strong>Course:</strong> {item.courseName} (
                      {item.courseCode})
                    </div>

                    <div className="df-ratings-badges-grid">
                      <div className="df-badge">
                        <span>Teaching:</span>
                        <strong>{item.ratings.teaching}.0★</strong>
                      </div>
                      <div className="df-badge">
                        <span>Communication:</span>
                        <strong>{item.ratings.communication}.0★</strong>
                      </div>
                      <div className="df-badge">
                        <span>Helpfulness:</span>
                        <strong>{item.ratings.helpfulness}.0★</strong>
                      </div>
                      <div className="df-badge">
                        <span>Knowledge:</span>
                        <strong>
                          {item.ratings.knowledge
                            ? `${item.ratings.knowledge}.0★`
                            : "N/A"}
                        </strong>
                      </div>
                      <div className="df-badge">
                        <span>Organization:</span>
                        <strong>
                          {item.ratings.organization
                            ? `${item.ratings.organization}.0★`
                            : "N/A"}
                        </strong>
                      </div>
                      <div className="df-badge">
                        <span>Availability:</span>
                        <strong>
                          {item.ratings.availability
                            ? `${item.ratings.availability}.0★`
                            : "N/A"}
                        </strong>
                      </div>
                      <div className="df-badge">
                        <span>Fairness:</span>
                        <strong>
                          {item.ratings.fairness
                            ? `${item.ratings.fairness}.0★`
                            : "N/A"}
                        </strong>
                      </div>
                    </div>

                    {item.comments && (
                      <div className="df-comments-quote">
                        <span className="quote-label">Student Comments:</span>
                        <p>"{item.comments}"</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 3: System Analytics */}
        {activeTab === "statistics" && (
          <div>
            <div className="stats-metric-grid mb-4">
              <div className="metric-card">
                <div className="metric-icon-bubble blue">
                  <i className="fa-solid fa-chalkboard-user"></i>
                </div>
                <h4>Total Faculties</h4>
                <div className="big-stat-number">{sysStats.totalFaculties}</div>
                <span className="metric-count-label">
                  Across 6 academic departments
                </span>
              </div>

              <div className="metric-card">
                <div className="metric-icon-bubble green">
                  <i className="fa-solid fa-user-graduate"></i>
                </div>
                <h4>Total Students</h4>
                <div className="big-stat-number">{sysStats.totalStudents}</div>
                <span className="metric-count-label">
                  Registered student evaluators
                </span>
              </div>

              <div className="metric-card">
                <div className="metric-icon-bubble orange">
                  <i className="fa-solid fa-book"></i>
                </div>
                <h4>Total Courses</h4>
                <div className="big-stat-number">{sysStats.totalCourses}</div>
                <span className="metric-count-label">
                  Active course catalogs
                </span>
              </div>

              <div className="metric-card">
                <div className="metric-icon-bubble purple">
                  <i className="fa-solid fa-comments"></i>
                </div>
                <h4>Total Feedback</h4>
                <div className="big-stat-number">{sysStats.totalFeedback}</div>
                <span className="metric-count-label">
                  Submitted evaluations
                </span>
              </div>
            </div>

            <section className="dashboard-card">
              <div className="card-section-header">
                <h2>Department Analytics Breakdown</h2>
                <p className="section-desc">
                  Average ratings and engagement metrics per faculty division.
                </p>
              </div>

              <div className="dept-stats-grid">
                {sysStats.departmentStats.map((dept, idx) => (
                  <div key={idx} className="dept-stat-card">
                    <div className="dept-card-top">
                      <h3>{dept.name}</h3>
                      <span className="dept-avg-badge">{dept.avgRating} ★</span>
                    </div>

                    <div className="dept-stat-items">
                      <div className="dept-stat-row">
                        <span>Faculty Members:</span>
                        <strong>{dept.facultyCount}</strong>
                      </div>
                      <div className="dept-stat-row">
                        <span>Courses Taught:</span>
                        <strong>{dept.courseCount}</strong>
                      </div>
                      <div className="dept-stat-row">
                        <span>Feedback Submissions:</span>
                        <strong>{dept.feedbackCount}</strong>
                      </div>
                    </div>

                    <div className="dept-progress-bar-container">
                      <div
                        className="dept-progress-bar"
                        style={{
                          width: `${(parseFloat(dept.avgRating) / 5) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Tab 4: My Profile */}
        {activeTab === "profile" && (
          <section className="dashboard-card max-w-700">
            <div className="card-section-header">
              <h2>Administrator Profile</h2>
              <p className="section-desc">
                Update administrative credentials and contact information.
              </p>
            </div>

            <form onSubmit={handleProfileSubmit} className="profile-edit-form">
              <div className="form-group">
                <label htmlFor="admin-name">Name</label>
                <input
                  id="admin-name"
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="admin-email">Email Address</label>
                <input
                  id="admin-email"
                  type="email"
                  value={user?.email || "admin@example.com"}
                  disabled
                  className="input-disabled"
                />
              </div>

              <div className="password-update-box">
                <h3>Change Administrator Password</h3>
                <div className="form-group">
                  <label htmlFor="admin-current-pw">Current Password</label>
                  <input
                    id="admin-current-pw"
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="admin-new-pw">New Password</label>
                  <input
                    id="admin-new-pw"
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
                {savingProfile ? "Saving..." : "Update Admin Profile"}
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
