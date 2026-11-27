import { DEMO_FACULTIES, DEMO_COURSES, DEMO_USERS, DEMO_FEEDBACK } from './mockData';

export function initializeStorage() {
  if (!localStorage.getItem('faculties')) {
    localStorage.setItem('faculties', JSON.stringify(DEMO_FACULTIES));
  }
  if (!localStorage.getItem('courses')) {
    localStorage.setItem('courses', JSON.stringify(DEMO_COURSES));
  }
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(DEMO_USERS));
  }
  if (!localStorage.getItem('feedback')) {
    localStorage.setItem('feedback', JSON.stringify(DEMO_FEEDBACK));
  }
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem('currentUser');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
}

/**
 * Purely simulated backend login using frontend mockData and localStorage
 */
export async function loginUser(email, password, userType) {
  initializeStorage();

  // Simulate network response latency
  await new Promise(resolve => setTimeout(resolve, 300));

  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(
    u => u.email.toLowerCase() === (email || '').trim().toLowerCase() &&
         u.password === password &&
         u.userType === userType
  );

  if (user) {
    const sessionUser = {
      userId: user.id || 'u-' + Date.now(),
      name: user.name,
      email: user.email,
      userType: user.userType,
      department: user.department || 'General',
      title: user.title || (user.userType === 'faculty' ? 'Faculty Member' : ''),
      token: 'simulated-token-' + Math.random().toString(36).substring(2),
      isLoggedIn: true
    };
    setCurrentUser(sessionUser);
    return { success: true, user: sessionUser };
  }

  return { success: false, message: 'Invalid email, password, or user role.' };
}

export async function logoutUser() {
  setCurrentUser(null);
}

export function getFacultiesList() {
  initializeStorage();
  return JSON.parse(localStorage.getItem('faculties') || '[]');
}

export function getCoursesForFaculty(facultyId) {
  initializeStorage();
  const allCourses = JSON.parse(localStorage.getItem('courses') || '{}');
  return allCourses[facultyId] || [];
}

export async function submitStudentFeedback(feedbackData) {
  initializeStorage();
  const allFeedback = JSON.parse(localStorage.getItem('feedback') || '[]');

  const newFeedback = {
    id: 'fb-' + Date.now(),
    studentEmail: feedbackData.studentEmail,
    studentName: feedbackData.studentName || 'Student',
    facultyId: feedbackData.facultyId,
    courseId: feedbackData.courseId,
    ratings: feedbackData.ratings,
    comments: feedbackData.comments || '',
    date: new Date().toISOString()
  };

  allFeedback.unshift(newFeedback);
  localStorage.setItem('feedback', JSON.stringify(allFeedback));

  return { success: true, feedback: newFeedback };
}

export function getStudentFeedbackHistory(studentEmail) {
  initializeStorage();
  const allFeedback = JSON.parse(localStorage.getItem('feedback') || '[]');
  const faculties = getFacultiesList();
  const allCourses = JSON.parse(localStorage.getItem('courses') || '{}');

  return allFeedback
    .filter(fb => fb.studentEmail?.toLowerCase() === studentEmail?.toLowerCase())
    .map(fb => {
      const faculty = faculties.find(f => f.id === fb.facultyId) || { name: 'Faculty' };
      const courses = allCourses[fb.facultyId] || [];
      const course = courses.find(c => c.id === fb.courseId) || { name: 'Course', code: '' };
      return {
        ...fb,
        facultyName: faculty.name,
        courseName: course.name,
        courseCode: course.code
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getFacultyFeedbackSummary(facultyId, courseFilter = 'all', dateFilter = 'all') {
  initializeStorage();
  const allFeedback = JSON.parse(localStorage.getItem('feedback') || '[]');
  const allCourses = JSON.parse(localStorage.getItem('courses') || '{}');
  const facultyCourses = allCourses[facultyId] || [];

  let filtered = allFeedback.filter(fb => fb.facultyId === facultyId);

  if (courseFilter && courseFilter !== 'all') {
    filtered = filtered.filter(fb => fb.courseId === courseFilter);
  }

  if (dateFilter && dateFilter !== 'all') {
    const now = new Date();
    let cutoffDate;
    if (dateFilter === 'recent') {
      cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (dateFilter === 'semester') {
      cutoffDate = new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000);
    }
    if (cutoffDate) {
      filtered = filtered.filter(fb => new Date(fb.date) >= cutoffDate);
    }
  }

  let teachingSum = 0;
  let communicationSum = 0;
  let helpfulnessSum = 0;
  let totalCriteriaSum = 0;
  let totalCriteriaCount = 0;

  filtered.forEach(fb => {
    teachingSum += fb.ratings.teaching || 0;
    communicationSum += fb.ratings.communication || 0;
    helpfulnessSum += fb.ratings.helpfulness || 0;

    const r = fb.ratings;
    const scores = [r.teaching, r.communication, r.helpfulness, r.knowledge, r.organization, r.availability, r.fairness].filter(Boolean);
    const subAvg = scores.reduce((a, b) => a + b, 0) / (scores.length || 1);
    totalCriteriaSum += subAvg;
    totalCriteriaCount++;
  });

  const count = filtered.length;
  const teachingAvg = count ? (teachingSum / count).toFixed(1) : '0.0';
  const communicationAvg = count ? (communicationSum / count).toFixed(1) : '0.0';
  const helpfulnessAvg = count ? (helpfulnessSum / count).toFixed(1) : '0.0';
  const overallAvg = count ? (totalCriteriaSum / count).toFixed(1) : '0.0';

  const anonymousComments = filtered
    .filter(fb => fb.comments && fb.comments.trim().length > 0)
    .map(fb => {
      const course = facultyCourses.find(c => c.id === fb.courseId);
      return {
        text: fb.comments,
        courseName: course ? `${course.name} (${course.code})` : 'Course Feedback',
        date: new Date(fb.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
      };
    });

  return {
    feedbackCount: count,
    teachingAvg,
    communicationAvg,
    helpfulnessAvg,
    overallAvg,
    anonymousComments
  };
}

export function getAllFeedbackForAdmin(facultyId, courseFilter = 'all', dateFilter = 'all') {
  initializeStorage();
  const allFeedback = JSON.parse(localStorage.getItem('feedback') || '[]');
  const allCourses = JSON.parse(localStorage.getItem('courses') || '{}');
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  let filtered = allFeedback.filter(fb => fb.facultyId === facultyId);

  if (courseFilter && courseFilter !== 'all') {
    filtered = filtered.filter(fb => fb.courseId === courseFilter);
  }

  if (dateFilter && dateFilter !== 'all') {
    const now = new Date();
    let cutoffDate;
    if (dateFilter === 'recent') {
      cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (dateFilter === 'semester') {
      cutoffDate = new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000);
    }
    if (cutoffDate) {
      filtered = filtered.filter(fb => new Date(fb.date) >= cutoffDate);
    }
  }

  const facultyCourses = allCourses[facultyId] || [];

  return filtered
    .map(fb => {
      const student = users.find(u => u.email === fb.studentEmail) || {
        name: fb.studentName || 'Student',
        department: 'Student'
      };
      const course = facultyCourses.find(c => c.id === fb.courseId) || { name: 'General Course', code: '' };
      return {
        ...fb,
        studentName: student.name,
        studentDepartment: student.department || 'General',
        courseName: course.name,
        courseCode: course.code,
        formattedDate: new Date(fb.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getAdminOverviewData(departmentFilter = 'all', ratingFilter = 'all') {
  initializeStorage();
  const faculties = getFacultiesList();
  const allFeedback = JSON.parse(localStorage.getItem('feedback') || '[]');

  let overviewList = faculties.map(faculty => {
    const facultyFeedback = allFeedback.filter(f => f.facultyId === faculty.id);
    let avg = 0;
    if (facultyFeedback.length > 0) {
      let totalRating = 0;
      facultyFeedback.forEach(fb => {
        const r = fb.ratings;
        const scores = [r.teaching, r.communication, r.helpfulness, r.knowledge, r.organization, r.availability, r.fairness].filter(Boolean);
        const subAvg = scores.reduce((a, b) => a + b, 0) / (scores.length || 1);
        totalRating += subAvg;
      });
      avg = totalRating / facultyFeedback.length;
    }

    return {
      id: faculty.id,
      name: faculty.name,
      department: faculty.department,
      title: faculty.title,
      avgRating: avg.toFixed(1),
      feedbackCount: facultyFeedback.length
    };
  });

  if (departmentFilter !== 'all') {
    overviewList = overviewList.filter(f => f.department === departmentFilter);
  }

  if (ratingFilter !== 'all') {
    overviewList = overviewList.filter(f => parseFloat(f.avgRating) >= parseFloat(ratingFilter));
  }

  return overviewList;
}

export function getSystemStatistics() {
  initializeStorage();
  const faculties = getFacultiesList();
  const courses = JSON.parse(localStorage.getItem('courses') || '{}');
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const feedback = JSON.parse(localStorage.getItem('feedback') || '[]');

  let totalCourses = 0;
  Object.values(courses).forEach(cList => {
    totalCourses += cList.length;
  });

  const students = users.filter(u => u.userType === 'student');

  // Department breakdown
  const deptMap = {};
  faculties.forEach(f => {
    if (!deptMap[f.department]) {
      deptMap[f.department] = {
        name: f.department,
        facultyCount: 0,
        courseCount: 0,
        feedbackCount: 0,
        totalRatingScore: 0,
        feedbackRatingCount: 0
      };
    }
    deptMap[f.department].facultyCount += 1;
    deptMap[f.department].courseCount += (courses[f.id] || []).length;
  });

  feedback.forEach(fb => {
    const faculty = faculties.find(f => f.id === fb.facultyId);
    if (faculty && deptMap[faculty.department]) {
      deptMap[faculty.department].feedbackCount += 1;
      const r = fb.ratings;
      const scores = [r.teaching, r.communication, r.helpfulness, r.knowledge, r.organization, r.availability, r.fairness].filter(Boolean);
      const subAvg = scores.reduce((a, b) => a + b, 0) / (scores.length || 1);
      deptMap[faculty.department].totalRatingScore += subAvg;
      deptMap[faculty.department].feedbackRatingCount += 1;
    }
  });

  const departmentStats = Object.values(deptMap).map(dept => {
    const avg = dept.feedbackRatingCount > 0 ? (dept.totalRatingScore / dept.feedbackRatingCount).toFixed(1) : '4.5';
    return {
      name: dept.name,
      facultyCount: dept.facultyCount,
      courseCount: dept.courseCount,
      feedbackCount: dept.feedbackCount,
      avgRating: avg
    };
  });

  return {
    totalFaculties: faculties.length,
    totalStudents: Math.max(students.length, 45),
    totalCourses,
    totalFeedback: feedback.length,
    departmentStats
  };
}

export async function updateUserProfile(email, { name, department, title, currentPassword, newPassword }) {
  initializeStorage();
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIdx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

  if (userIdx === -1) {
    return { success: false, message: 'User not found.' };
  }

  if (currentPassword && newPassword) {
    if (users[userIdx].password !== currentPassword) {
      return { success: false, message: 'Current password is incorrect.' };
    }
    users[userIdx].password = newPassword;
  }

  if (name) users[userIdx].name = name;
  if (department) users[userIdx].department = department;
  if (title) users[userIdx].title = title;

  localStorage.setItem('users', JSON.stringify(users));

  const currentUser = getCurrentUser();
  if (currentUser && currentUser.email.toLowerCase() === email.toLowerCase()) {
    const updated = {
      ...currentUser,
      name: name || currentUser.name,
      department: department || currentUser.department,
      title: title || currentUser.title
    };
    setCurrentUser(updated);
  }

  return { success: true, message: 'Profile updated successfully!' };
}
