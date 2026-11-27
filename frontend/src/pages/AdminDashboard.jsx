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
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
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

      <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-50">
        <header className="mb-6 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Administrator Portal</h1>
            <p className="text-sm text-slate-500 mt-1">
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
            <div className="bg-white border border-slate-200 rounded-xl p-4 mb-5 flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label htmlFor="admin-dept-filter" className="block text-xs font-semibold text-slate-600 mb-1.5">Department:</label>
                <select
                  id="admin-dept-filter"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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

              <div className="flex-1 min-w-[200px]">
                <label htmlFor="admin-rating-filter" className="block text-xs font-semibold text-slate-600 mb-1.5">Minimum Rating:</label>
                <select
                  id="admin-rating-filter"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {facultyList.length === 0 ? (
                <div className="col-span-full text-center py-10 px-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
                  <i className="fa-regular fa-user-xmark text-4xl text-slate-300 mb-3 block"></i>
                  <p className="text-xs text-slate-500">No faculty members match your filter criteria.</p>
                </div>
              ) : (
                facultyList.map((faculty) => (
                  <div key={faculty.id} className="bg-white border border-slate-200 border-t-4 border-t-indigo-600 rounded-xl p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition duration-200 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-base font-semibold text-indigo-700">{faculty.name}</h3>
                        <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded font-medium">
                          {faculty.department}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mb-3">{faculty.title}</p>

                      <div className="bg-slate-50 p-2.5 rounded-lg flex items-center justify-between mb-3.5 border border-slate-100">
                        <StarDisplay rating={faculty.avgRating} size="medium" />
                        <span className="text-xs text-slate-400">
                          <i className="fa-regular fa-comment-dots"></i>{" "}
                          {faculty.feedbackCount} reviews
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-xs rounded-lg shadow-sm hover:shadow transition mt-3 cursor-pointer"
                      onClick={() => handleViewDetailed(faculty.id)}
                    >
                      <i className="fa-regular fa-eye"></i> View Detailed Feedback
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
            <div className="mb-4">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 text-xs font-medium rounded-lg transition cursor-pointer"
                onClick={() => setActiveTab("overview")}
              >
                <i className="fa-solid fa-arrow-left"></i> Back to Faculty Overview
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5 flex justify-between items-center flex-wrap gap-4 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">{selectedFaculty?.name} - Detailed Feedback</h2>
                <p className="text-xs text-slate-500">
                  <strong>Department:</strong> {selectedFaculty?.department}{" "}
                  &nbsp;|&nbsp;
                  <strong> Title:</strong> {selectedFaculty?.title}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <label htmlFor="quick-fac-switch">Switch Faculty:</label>
                <select
                  id="quick-fac-switch"
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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

            <div className="bg-white border border-slate-200 rounded-xl p-4 mb-5 flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label htmlFor="detailed-course-select" className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Filter by Course:
                </label>
                <select
                  id="detailed-course-select"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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

              <div className="flex-1 min-w-[200px]">
                <label htmlFor="detailed-date-select" className="block text-xs font-semibold text-slate-600 mb-1.5">Time Period:</label>
                <select
                  id="detailed-date-select"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={detailedDateFilter}
                  onChange={(e) => setDetailedDateFilter(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="recent">Last 30 Days</option>
                  <option value="semester">Current Semester</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {detailedFeedbackList.length === 0 ? (
                <div className="text-center py-10 px-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
                  <i className="fa-regular fa-comment-slash text-4xl text-slate-300 mb-3 block"></i>
                  <p className="text-xs text-slate-500">
                    No individual feedback submissions found matching criteria.
                  </p>
                </div>
              ) : (
                detailedFeedbackList.map((item) => (
                  <div key={item.id} className="bg-white border border-slate-200 border-l-4 border-l-indigo-600 rounded-xl p-5 shadow-sm">
                    <div className="flex justify-between mb-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-800 text-sm">
                          <i className="fa-regular fa-user"></i> {item.studentName}
                        </span>
                        <span className="text-slate-400 text-xs">
                          ({item.studentDepartment})
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">{item.formattedDate}</span>
                    </div>

                    <div className="text-xs font-medium text-indigo-600 mb-3">
                      <strong>Course:</strong> {item.courseName} ({item.courseCode})
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-3.5">
                      <div className="bg-slate-50 border border-slate-200 rounded p-1.5 text-[11px] flex justify-between items-center">
                        <span className="text-slate-500">Teaching:</span>
                        <strong className="text-amber-600 font-semibold">{item.ratings.teaching}.0★</strong>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded p-1.5 text-[11px] flex justify-between items-center">
                        <span className="text-slate-500">Communication:</span>
                        <strong className="text-amber-600 font-semibold">{item.ratings.communication}.0★</strong>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded p-1.5 text-[11px] flex justify-between items-center">
                        <span className="text-slate-500">Helpfulness:</span>
                        <strong className="text-amber-600 font-semibold">{item.ratings.helpfulness}.0★</strong>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded p-1.5 text-[11px] flex justify-between items-center">
                        <span className="text-slate-500">Knowledge:</span>
                        <strong className="text-amber-600 font-semibold">
                          {item.ratings.knowledge
                            ? `${item.ratings.knowledge}.0★`
                            : "N/A"}
                        </strong>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded p-1.5 text-[11px] flex justify-between items-center">
                        <span className="text-slate-500">Organization:</span>
                        <strong className="text-amber-600 font-semibold">
                          {item.ratings.organization
                            ? `${item.ratings.organization}.0★`
                            : "N/A"}
                        </strong>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded p-1.5 text-[11px] flex justify-between items-center">
                        <span className="text-slate-500">Availability:</span>
                        <strong className="text-amber-600 font-semibold">
                          {item.ratings.availability
                            ? `${item.ratings.availability}.0★`
                            : "N/A"}
                        </strong>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded p-1.5 text-[11px] flex justify-between items-center">
                        <span className="text-slate-500">Fairness:</span>
                        <strong className="text-amber-600 font-semibold">
                          {item.ratings.fairness
                            ? `${item.ratings.fairness}.0★`
                            : "N/A"}
                        </strong>
                      </div>
                    </div>

                    {item.comments && (
                      <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-700 border border-slate-100">
                        <span className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Student Comments:</span>
                        <p className="italic">"{item.comments}"</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-base mb-3 bg-indigo-50 text-indigo-600">
                  <i className="fa-solid fa-chalkboard-user"></i>
                </div>
                <h4 className="text-xs font-medium text-slate-500 mb-2">Total Faculties</h4>
                <div className="text-3xl font-bold text-slate-900 tracking-tight">{sysStats.totalFaculties}</div>
                <span className="text-[11px] text-slate-400 mt-2 block">
                  Across 6 academic departments
                </span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-base mb-3 bg-emerald-50 text-emerald-600">
                  <i className="fa-solid fa-user-graduate"></i>
                </div>
                <h4 className="text-xs font-medium text-slate-500 mb-2">Total Students</h4>
                <div className="text-3xl font-bold text-slate-900 tracking-tight">{sysStats.totalStudents}</div>
                <span className="text-[11px] text-slate-400 mt-2 block">
                  Registered student evaluators
                </span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-base mb-3 bg-amber-50 text-amber-600">
                  <i className="fa-solid fa-book"></i>
                </div>
                <h4 className="text-xs font-medium text-slate-500 mb-2">Total Courses</h4>
                <div className="text-3xl font-bold text-slate-900 tracking-tight">{sysStats.totalCourses}</div>
                <span className="text-[11px] text-slate-400 mt-2 block">
                  Active course catalogs
                </span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-base mb-3 bg-purple-50 text-purple-600">
                  <i className="fa-solid fa-comments"></i>
                </div>
                <h4 className="text-xs font-medium text-slate-500 mb-2">Total Feedback</h4>
                <div className="text-3xl font-bold text-slate-900 tracking-tight">{sysStats.totalFeedback}</div>
                <span className="text-[11px] text-slate-400 mt-2 block">
                  Submitted evaluations
                </span>
              </div>
            </div>

            <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80 mb-6">
              <div className="mb-5 pb-3 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-900">Department Analytics Breakdown</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Average ratings and engagement metrics per faculty division.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {sysStats.departmentStats.map((dept, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-semibold text-slate-800">{dept.name}</h3>
                        <span className="bg-amber-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">{dept.avgRating} ★</span>
                      </div>

                      <div className="space-y-1.5 mb-3 text-xs text-slate-600">
                        <div className="flex justify-between">
                          <span>Faculty Members:</span>
                          <strong className="text-slate-800">{dept.facultyCount}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Courses Taught:</span>
                          <strong className="text-slate-800">{dept.courseCount}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Feedback Submissions:</span>
                          <strong className="text-slate-800">{dept.feedbackCount}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-300"
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
          <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80 mb-6 max-w-2xl">
            <div className="mb-5 pb-3 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">Administrator Profile</h2>
              <p className="text-xs text-slate-500 mt-1">
                Update administrative credentials and contact information.
              </p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label htmlFor="admin-name" className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
                <input
                  id="admin-name"
                  type="text"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="admin-email" className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <input
                  id="admin-email"
                  type="email"
                  value={user?.email || "admin@example.com"}
                  disabled
                  className="w-full rounded-lg border border-slate-300 bg-slate-100 px-3.5 py-2 text-sm text-slate-400 cursor-not-allowed"
                />
              </div>

              <div className="my-5 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h3 className="text-sm font-semibold text-slate-800">Change Administrator Password</h3>
                <div>
                  <label htmlFor="admin-current-pw" className="block text-xs font-medium text-slate-600 mb-1">Current Password</label>
                  <input
                    id="admin-current-pw"
                    type="password"
                    placeholder="Enter current password"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="admin-new-pw" className="block text-xs font-medium text-slate-600 mb-1">New Password</label>
                  <input
                    id="admin-new-pw"
                    type="password"
                    placeholder="Enter new password"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-sm rounded-lg shadow-sm hover:shadow transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
