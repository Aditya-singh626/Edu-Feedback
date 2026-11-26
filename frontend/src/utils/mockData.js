export const DEMO_FACULTIES = [
  { id: 'f1', name: 'Dr. John Smith', department: 'Computer Science', title: 'Associate Professor' },
  { id: 'f2', name: 'Prof. Jane Doe', department: 'Mathematics', title: 'Professor' },
  { id: 'f3', name: 'Dr. Robert Johnson', department: 'Physics', title: 'Assistant Professor' },
  { id: 'f4', name: 'Dr. Michael Williams', department: 'Chemistry', title: 'Associate Professor' },
  { id: 'f5', name: 'Prof. Sarah Brown', department: 'Biology', title: 'Professor' },
  { id: 'f6', name: 'Dr. David Miller', department: 'Engineering', title: 'Assistant Professor' }
];

export const DEMO_COURSES = {
  f1: [
    { id: 'c1', name: 'Introduction to Programming', code: 'CS101' },
    { id: 'c2', name: 'Data Structures', code: 'CS201' },
    { id: 'c7', name: 'Software Engineering', code: 'CS301' },
    { id: 'c8', name: 'Algorithms', code: 'CS202' }
  ],
  f2: [
    { id: 'c3', name: 'Calculus I', code: 'MATH101' },
    { id: 'c4', name: 'Linear Algebra', code: 'MATH201' },
    { id: 'c9', name: 'Differential Equations', code: 'MATH301' },
    { id: 'c10', name: 'Statistics', code: 'MATH202' }
  ],
  f3: [
    { id: 'c5', name: 'Mechanics', code: 'PHY101' },
    { id: 'c6', name: 'Electromagnetism', code: 'PHY201' },
    { id: 'c11', name: 'Quantum Physics', code: 'PHY301' },
    { id: 'c12', name: 'Thermodynamics', code: 'PHY202' }
  ],
  f4: [
    { id: 'c13', name: 'General Chemistry', code: 'CHEM101' },
    { id: 'c14', name: 'Organic Chemistry', code: 'CHEM201' },
    { id: 'c15', name: 'Biochemistry', code: 'CHEM301' }
  ],
  f5: [
    { id: 'c16', name: 'Cell Biology', code: 'BIO101' },
    { id: 'c17', name: 'Molecular Biology', code: 'BIO201' },
    { id: 'c18', name: 'Genetics', code: 'BIO301' }
  ],
  f6: [
    { id: 'c19', name: 'Statics', code: 'ENG101' },
    { id: 'c20', name: 'Dynamics', code: 'ENG201' },
    { id: 'c21', name: 'Fluid Mechanics', code: 'ENG301' }
  ]
};

export const DEMO_USERS = [
  // Faculty users
  {
    id: 'u-f1',
    name: 'Dr. John Smith',
    email: 'john.smith@example.com',
    password: 'faculty123',
    userType: 'faculty',
    department: 'Computer Science',
    title: 'Associate Professor'
  },
  {
    id: 'u-f2',
    name: 'Prof. Jane Doe',
    email: 'jane.doe@example.com',
    password: 'faculty123',
    userType: 'faculty',
    department: 'Mathematics',
    title: 'Professor'
  },
  {
    id: 'u-f3',
    name: 'Dr. Robert Johnson',
    email: 'robert.johnson@example.com',
    password: 'faculty123',
    userType: 'faculty',
    department: 'Physics',
    title: 'Assistant Professor'
  },
  {
    id: 'u-f4',
    name: 'Dr. Michael Williams',
    email: 'michael.williams@example.com',
    password: 'faculty123',
    userType: 'faculty',
    department: 'Chemistry',
    title: 'Associate Professor'
  },
  {
    id: 'u-f5',
    name: 'Prof. Sarah Brown',
    email: 'sarah.brown@example.com',
    password: 'faculty123',
    userType: 'faculty',
    department: 'Biology',
    title: 'Professor'
  },
  {
    id: 'u-f6',
    name: 'Dr. David Miller',
    email: 'david.miller@example.com',
    password: 'faculty123',
    userType: 'faculty',
    department: 'Engineering',
    title: 'Assistant Professor'
  },
  // Student users
  {
    id: 'u-s1',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    password: 'student123',
    userType: 'student',
    department: 'Computer Science'
  },
  {
    id: 'u-s2',
    name: 'Bob Williams',
    email: 'bob.williams@example.com',
    password: 'student123',
    userType: 'student',
    department: 'Mathematics'
  },
  {
    id: 'u-s3',
    name: 'Carol Brown',
    email: 'carol.brown@example.com',
    password: 'student123',
    userType: 'student',
    department: 'Physics'
  },
  {
    id: 'u-s4',
    name: 'David Lee',
    email: 'david.lee@example.com',
    password: 'student123',
    userType: 'student',
    department: 'Computer Science'
  },
  {
    id: 'u-s5',
    name: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    password: 'student123',
    userType: 'student',
    department: 'Mathematics'
  },
  // Admin user
  {
    id: 'u-admin',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    userType: 'admin',
    department: 'Administration',
    title: 'System Administrator'
  }
];

export const DEMO_FEEDBACK = [
  {
    id: 'fb1',
    studentEmail: 'alice.johnson@example.com',
    studentName: 'Alice Johnson',
    facultyId: 'f1',
    courseId: 'c1',
    ratings: {
      teaching: 5,
      communication: 4,
      helpfulness: 5,
      knowledge: 5,
      organization: 4,
      availability: 5,
      fairness: 5
    },
    comments: 'Very knowledgeable and always willing to help students. Clear explanations of core coding principles.',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'fb2',
    studentEmail: 'bob.williams@example.com',
    studentName: 'Bob Williams',
    facultyId: 'f1',
    courseId: 'c2',
    ratings: {
      teaching: 4,
      communication: 5,
      helpfulness: 4,
      knowledge: 5,
      organization: 5,
      availability: 4,
      fairness: 4
    },
    comments: 'Explains complex topics in an understandable way. Data structures lectures were engaging!',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'fb3',
    studentEmail: 'carol.brown@example.com',
    studentName: 'Carol Brown',
    facultyId: 'f2',
    courseId: 'c3',
    ratings: {
      teaching: 5,
      communication: 5,
      helpfulness: 4,
      knowledge: 5,
      organization: 5,
      availability: 4,
      fairness: 5
    },
    comments: 'Excellent teaching methods, makes calculus and higher math genuinely interesting.',
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'fb4',
    studentEmail: 'david.lee@example.com',
    studentName: 'David Lee',
    facultyId: 'f3',
    courseId: 'c5',
    ratings: {
      teaching: 4,
      communication: 3,
      helpfulness: 5,
      knowledge: 5,
      organization: 4,
      availability: 4,
      fairness: 4
    },
    comments: 'Great with practical physics examples, although lectures move quite fast.',
    date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'fb5',
    studentEmail: 'emma.wilson@example.com',
    studentName: 'Emma Wilson',
    facultyId: 'f4',
    courseId: 'c13',
    ratings: {
      teaching: 5,
      communication: 4,
      helpfulness: 5,
      knowledge: 5,
      organization: 5,
      availability: 5,
      fairness: 5
    },
    comments: 'Very organized lab demonstrations and crystal clear theory breakdown.',
    date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'fb6',
    studentEmail: 'alice.johnson@example.com',
    studentName: 'Alice Johnson',
    facultyId: 'f5',
    courseId: 'c16',
    ratings: {
      teaching: 5,
      communication: 5,
      helpfulness: 5,
      knowledge: 5,
      organization: 4,
      availability: 5,
      fairness: 5
    },
    comments: 'Passionate about biological sciences, interactive classroom discussions.',
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'fb7',
    studentEmail: 'bob.williams@example.com',
    studentName: 'Bob Williams',
    facultyId: 'f6',
    courseId: 'c19',
    ratings: {
      teaching: 4,
      communication: 4,
      helpfulness: 4,
      knowledge: 5,
      organization: 4,
      availability: 4,
      fairness: 4
    },
    comments: 'Solid engineering fundamentals. Assignments are challenging but prepare you well.',
    date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'fb8',
    studentEmail: 'carol.brown@example.com',
    studentName: 'Carol Brown',
    facultyId: 'f3',
    courseId: 'c6',
    ratings: {
      teaching: 5,
      communication: 4,
      helpfulness: 4,
      knowledge: 5,
      organization: 5,
      availability: 4,
      fairness: 4
    },
    comments: 'Explains electromagnetism concepts clearly with visual aids and real-world experiments.',
    date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'fb9',
    studentEmail: 'david.lee@example.com',
    studentName: 'David Lee',
    facultyId: 'f2',
    courseId: 'c4',
    ratings: {
      teaching: 4,
      communication: 5,
      helpfulness: 5,
      knowledge: 5,
      organization: 5,
      availability: 5,
      fairness: 5
    },
    comments: 'Always available during office hours to guide students through difficult matrix problem sets.',
    date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'fb10',
    studentEmail: 'emma.wilson@example.com',
    studentName: 'Emma Wilson',
    facultyId: 'f1',
    courseId: 'c8',
    ratings: {
      teaching: 5,
      communication: 4,
      helpfulness: 5,
      knowledge: 5,
      organization: 5,
      availability: 4,
      fairness: 5
    },
    comments: 'Excellent at breaking down dynamic programming and graph algorithms.',
    date: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const DEMO_QUICK_ACCOUNTS = [
  { label: 'Faculty: Dr. John Smith', email: 'john.smith@example.com', password: 'faculty123', userType: 'faculty', dept: 'Computer Science' },
  { label: 'Student: Alice Johnson', email: 'alice.johnson@example.com', password: 'student123', userType: 'student', dept: 'Computer Science' },
  { label: 'Admin: System Admin', email: 'admin@example.com', password: 'admin123', userType: 'admin', dept: 'Administration' }
];
