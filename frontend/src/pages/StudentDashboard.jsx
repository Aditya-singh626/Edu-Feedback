import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { StarRatingInput } from "../components/StarRating";
import Alert from "../components/Alert";
import Footer from "../components/Footer";
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
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Dashboard</h1>
              <p className="text-sm text-slate-500 mt-1">
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
          <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80 mb-6">
            <div className="mb-5 pb-3 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">Submit Faculty Feedback</h2>
              <p className="text-xs text-slate-500 mt-1">
                Evaluate your instructor across seven core teaching dimensions.
                All feedback is anonymized when presented to faculty.
              </p>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="faculty-select" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Select Faculty Member *
                  </label>
                  <select
                    id="faculty-select"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
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

                <div>
                  <label htmlFor="course-select" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Select Course *
                  </label>
                  <select
                    id="course-select"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition"
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

              <div className="my-6">
                <h3 className="text-base font-semibold text-slate-900 mb-3">Evaluation Criteria (1 to 5 Stars)</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
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

              <div>
                <label htmlFor="feedback-comments" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Additional Qualitative Comments
                </label>
                <textarea
                  id="feedback-comments"
                  rows={4}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                  placeholder="Share constructive comments, course highlights, or areas for improvement..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
          <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80 mb-6">
            <div className="mb-5 pb-3 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">Your Feedback History</h2>
              <p className="text-xs text-slate-500 mt-1">
                Record of all feedback you have submitted to date.
              </p>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-10 px-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
                <i className="fa-regular fa-folder-open text-4xl text-slate-300 mb-3 block"></i>
                <p className="text-xs text-slate-500 mb-4">No feedback submitted yet.</p>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm transition cursor-pointer"
                  onClick={() => setActiveTab("feedback")}
                >
                  Submit Your First Feedback
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((fb) => (
                  <div key={fb.id} className="bg-slate-50/70 border border-slate-200 border-l-4 border-l-indigo-600 rounded-xl p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-2.5">
                      <div>
                        <h3 className="text-base font-semibold text-indigo-700">{fb.facultyName}</h3>
                        <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-md mt-0.5">
                          {fb.courseName} ({fb.courseCode})
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {new Date(fb.date).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 my-3">
                      <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-full text-xs text-slate-600">
                        Teaching: <strong className="text-amber-600 font-semibold">{fb.ratings.teaching}★</strong>
                      </span>
                      <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-full text-xs text-slate-600">
                        Communication:{" "}
                        <strong className="text-amber-600 font-semibold">{fb.ratings.communication}★</strong>
                      </span>
                      <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-full text-xs text-slate-600">
                        Helpfulness: <strong className="text-amber-600 font-semibold">{fb.ratings.helpfulness}★</strong>
                      </span>
                      {fb.ratings.knowledge && (
                        <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-full text-xs text-slate-600">
                          Knowledge: <strong className="text-amber-600 font-semibold">{fb.ratings.knowledge}★</strong>
                        </span>
                      )}
                      {fb.ratings.organization && (
                        <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-full text-xs text-slate-600">
                          Organization:{" "}
                          <strong className="text-amber-600 font-semibold">{fb.ratings.organization}★</strong>
                        </span>
                      )}
                      {fb.ratings.availability && (
                        <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-full text-xs text-slate-600">
                          Availability:{" "}
                          <strong className="text-amber-600 font-semibold">{fb.ratings.availability}★</strong>
                        </span>
                      )}
                      {fb.ratings.fairness && (
                        <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-full text-xs text-slate-600">
                          Fairness: <strong className="text-amber-600 font-semibold">{fb.ratings.fairness}★</strong>
                        </span>
                      )}
                    </div>

                    {fb.comments && (
                      <div className="mt-3 pt-2.5 border-t border-dashed border-slate-200 text-xs italic text-slate-600">
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
          <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80 mb-6 max-w-2xl">
            <div className="mb-5 pb-3 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">My Profile</h2>
              <p className="text-xs text-slate-500 mt-1">
                Manage your account credentials and personal details.
              </p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label htmlFor="student-profile-name" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  id="student-profile-name"
                  type="text"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="student-profile-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  id="student-profile-email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full rounded-lg border border-slate-300 bg-slate-100 px-3.5 py-2 text-sm text-slate-400 cursor-not-allowed"
                />
                <small className="block text-xs text-slate-400 mt-1">
                  Email address is managed by administration.
                </small>
              </div>

              <div>
                <label htmlFor="student-profile-dept" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Department
                </label>
                <input
                  id="student-profile-dept"
                  type="text"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                  value={profileDept}
                  onChange={(e) => setProfileDept(e.target.value)}
                  placeholder="e.g. Computer Science"
                />
              </div>

              <div className="my-5 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h3 className="text-sm font-semibold text-slate-800">Change Password</h3>
                <div>
                  <label htmlFor="current-pw" className="block text-xs font-medium text-slate-600 mb-1">
                    Current Password
                  </label>
                  <input
                    id="current-pw"
                    type="password"
                    placeholder="Enter current password"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="new-pw" className="block text-xs font-medium text-slate-600 mb-1">
                    New Password
                  </label>
                  <input
                    id="new-pw"
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
                disabled={updatingProfile}
              >
                {updatingProfile ? "Saving..." : "Save Profile Changes"}
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
