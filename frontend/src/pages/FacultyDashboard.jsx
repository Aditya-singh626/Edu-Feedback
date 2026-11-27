import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { StarDisplay } from "../components/StarRating";
import Alert from "../components/Alert";
import Footer from "../components/Footer";
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
        brandTitle="EduFeedback"
      />

      <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-50 flex flex-col justify-between">
        <div>
          <header className="mb-6 pb-4 border-b border-slate-200">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-0.5">
                ABESEC Ghaziabad
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Faculty Dashboard</h1>
              <p className="text-sm text-slate-500 mt-1">
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
            <div className="bg-emerald-50 border border-emerald-200 border-l-4 border-l-emerald-500 rounded-lg p-3.5 flex items-center gap-3 mb-5 text-emerald-800 text-xs">
              <i className="fa-solid fa-shield-halved text-lg text-emerald-600"></i>
              <div>
                <strong>Student Privacy Protected:</strong>
                <span>
                  {" "}
                  All feedback and ratings are completely anonymized to
                  encourage open, constructive, and honest dialogue.
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 mb-5 flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label htmlFor="course-filter-select" className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Filter by Course:
                </label>
                <select
                  id="course-filter-select"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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

              <div className="flex-1 min-w-[200px]">
                <label htmlFor="date-filter-select" className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Time Period:
                </label>
                <select
                  id="date-filter-select"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="recent">Last 30 Days</option>
                  <option value="semester">Current Semester</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                <h4 className="text-xs font-medium text-slate-500 mb-2">Teaching Quality</h4>
                <StarDisplay rating={stats.teachingAvg} size="large" />
                <span className="text-[11px] text-slate-400 mt-2 block">
                  Based on {stats.feedbackCount} reviews
                </span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                <h4 className="text-xs font-medium text-slate-500 mb-2">Communication</h4>
                <StarDisplay rating={stats.communicationAvg} size="large" />
                <span className="text-[11px] text-slate-400 mt-2 block">
                  Based on {stats.feedbackCount} reviews
                </span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                <h4 className="text-xs font-medium text-slate-500 mb-2">Helpfulness & Mentoring</h4>
                <StarDisplay rating={stats.helpfulnessAvg} size="large" />
                <span className="text-[11px] text-slate-400 mt-2 block">
                  Based on {stats.feedbackCount} reviews
                </span>
              </div>

              <div className="bg-white border border-slate-200 border-t-4 border-t-indigo-600 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                <h4 className="text-xs font-medium text-slate-500 mb-2">Overall Evaluation</h4>
                <StarDisplay rating={stats.overallAvg} size="large" />
                <span className="text-[11px] text-slate-400 mt-2 block">
                  Cumulative score across 7 metrics
                </span>
              </div>
            </div>

            <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80 mb-6">
              <div className="mb-5 pb-3 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-900">
                  Anonymous Student Comments ({stats.anonymousComments.length})
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Qualitative observations and suggestions submitted by your
                  students.
                </p>
              </div>

              {stats.anonymousComments.length === 0 ? (
                <div className="text-center py-10 px-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
                  <i className="fa-regular fa-comment-slash text-4xl text-slate-300 mb-3 block"></i>
                  <p className="text-xs text-slate-500">
                    No qualitative comments available for the selected filters.
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {stats.anonymousComments.map((comm, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <p className="italic text-sm text-slate-700 mb-2">"{comm.text}"</p>
                      <div className="flex justify-between items-center text-xs">
                        <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded text-[11px] font-medium">
                          {comm.courseName}
                        </span>
                        <span className="text-slate-400">{comm.date}</span>
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
          <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80 mb-6">
            <div className="mb-5 pb-3 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">My Assigned Courses</h2>
              <p className="text-xs text-slate-500 mt-1">
                Overview of your active lecture modules and feedback volume.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map((course) => {
                const courseFeedback = getFacultyFeedbackSummary(
                  facultyId,
                  course.id,
                  "all",
                );
                return (
                  <div key={course.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col">
                    <div className="self-start bg-indigo-50 text-indigo-700 font-semibold text-xs px-2.5 py-0.5 rounded mb-2.5">{course.code}</div>
                    <h3 className="text-base font-semibold text-slate-800 mb-3 flex-1">{course.name}</h3>
                    <div className="flex justify-between py-2 border-y border-slate-100 my-2.5">
                      <div className="flex flex-col text-xs">
                        <span className="text-slate-400">Enrolled:</span>
                        <span className="font-semibold text-slate-800">40+</span>
                      </div>
                      <div className="flex flex-col text-xs">
                        <span className="text-slate-400">Feedback:</span>
                        <span className="font-semibold text-slate-800">
                          {courseFeedback.feedbackCount}
                        </span>
                      </div>
                      <div className="flex flex-col text-xs">
                        <span className="text-slate-400">Avg:</span>
                        <span className="font-semibold text-slate-800">
                          {courseFeedback.overallAvg}★
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-xs font-medium rounded-lg transition mt-3 cursor-pointer"
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
          <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80 mb-6 max-w-2xl">
            <div className="mb-5 pb-3 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">Faculty Profile Details</h2>
              <p className="text-xs text-slate-500 mt-1">
                Keep your academic title and department affiliation up to date.
              </p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label htmlFor="fac-name" className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <input
                  id="fac-name"
                  type="text"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="fac-email" className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <input
                  id="fac-email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full rounded-lg border border-slate-300 bg-slate-100 px-3.5 py-2 text-sm text-slate-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="fac-dept" className="block text-sm font-medium text-slate-700 mb-1.5">Department</label>
                <input
                  id="fac-dept"
                  type="text"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                  value={profileDept}
                  onChange={(e) => setProfileDept(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="fac-title" className="block text-sm font-medium text-slate-700 mb-1.5">Academic Title / Rank</label>
                <input
                  id="fac-title"
                  type="text"
                  placeholder="e.g. Associate Professor"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                  value={profileTitle}
                  onChange={(e) => setProfileTitle(e.target.value)}
                />
              </div>

              <div className="my-5 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h3 className="text-sm font-semibold text-slate-800">Change Account Password</h3>
                <div>
                  <label htmlFor="fac-current-pw" className="block text-xs font-medium text-slate-600 mb-1">Current Password</label>
                  <input
                    id="fac-current-pw"
                    type="password"
                    placeholder="Enter current password"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="fac-new-pw" className="block text-xs font-medium text-slate-600 mb-1">New Password</label>
                  <input
                    id="fac-new-pw"
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
                {savingProfile ? "Saving..." : "Update Faculty Profile"}
              </button>
            </form>
          </section>
        )}
        </div>

        <Footer className="mt-12 pt-6 border-t border-slate-200" />
      </main>
    </div>
  );
}
