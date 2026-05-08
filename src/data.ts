export interface Subject {
  id: string;
  name: string;
  teacher: string;
  emoji: string;
  completedLessons: number;
  totalLessons: number;
}

export interface Assignment {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  description?: string;
  dueDate: Date;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
  maxGrade?: number;
}

export interface ScheduleItem {
  id: string;
  subjectName: string;
  teacher?: string;
  day: string;
  startTime: string;
  endTime: string;
  room?: string;
}

export const subjects: Subject[] = [
  { id: '1', name: 'الرياضيات',       teacher: 'أ. محمد العمري',  emoji: '🧮', completedLessons: 12, totalLessons: 20 },
  { id: '2', name: 'اللغة العربية',   teacher: 'أ. سارة القحطاني',emoji: '📖', completedLessons: 8,  totalLessons: 18 },
  { id: '3', name: 'العلوم',           teacher: 'أ. خالد الزهراني', emoji: '🔬', completedLessons: 6,  totalLessons: 16 },
  { id: '4', name: 'اللغة الإنجليزية',teacher: 'أ. نورة السالم',   emoji: '🌍', completedLessons: 10, totalLessons: 15 },
  { id: '5', name: 'الحاسب الآلي',    teacher: 'أ. فيصل الدوسري', emoji: '💻', completedLessons: 5,  totalLessons: 12 },
  { id: '6', name: 'التربية الإسلامية',teacher:'أ. عبدالله الشمري',emoji: '📝', completedLessons: 14, totalLessons: 14 },
];

const today = new Date();
const addDays = (d: number) => { const n = new Date(today); n.setDate(n.getDate() + d); return n; };

export const assignments: Assignment[] = [
  { id: '1', title: 'حل تمارين الجبر',    subjectId: '1', subjectName: 'الرياضيات',       description: 'حل التمارين من 1 إلى 20 في الكتاب المدرسي', dueDate: addDays(2),  status: 'pending' },
  { id: '2', title: 'قراءة القصيدة',       subjectId: '2', subjectName: 'اللغة العربية',   description: 'قراءة قصيدة المتنبي وتحليلها',              dueDate: addDays(-1), status: 'pending' },
  { id: '3', title: 'تقرير الخلية',        subjectId: '3', subjectName: 'العلوم',           description: 'كتابة تقرير عن تركيب الخلية النباتية',      dueDate: addDays(5),  status: 'submitted' },
  { id: '4', title: 'Essay Writing',       subjectId: '4', subjectName: 'اللغة الإنجليزية',description: 'Write a 300-word essay on technology',       dueDate: addDays(3),  status: 'graded', grade: 92, maxGrade: 100 },
  { id: '5', title: 'مشروع Python',        subjectId: '5', subjectName: 'الحاسب الآلي',    description: 'بناء برنامج بسيط بلغة Python',              dueDate: addDays(7),  status: 'pending' },
];

export const schedule: ScheduleItem[] = [
  { id: '1', subjectName: 'الرياضيات',        teacher: 'أ. محمد العمري',   day: 'الأحد',    startTime: '07:30', endTime: '08:15', room: 'قاعة 101' },
  { id: '2', subjectName: 'اللغة العربية',    teacher: 'أ. سارة القحطاني', day: 'الأحد',    startTime: '08:25', endTime: '09:10', room: 'قاعة 203' },
  { id: '3', subjectName: 'العلوم',            teacher: 'أ. خالد الزهراني', day: 'الاثنين',  startTime: '07:30', endTime: '08:15', room: 'معمل العلوم' },
  { id: '4', subjectName: 'اللغة الإنجليزية', teacher: 'أ. نورة السالم',   day: 'الاثنين',  startTime: '08:25', endTime: '09:10', room: 'قاعة 102' },
  { id: '5', subjectName: 'الحاسب الآلي',     teacher: 'أ. فيصل الدوسري', day: 'الثلاثاء', startTime: '07:30', endTime: '08:15', room: 'معمل الحاسب' },
  { id: '6', subjectName: 'الرياضيات',        teacher: 'أ. محمد العمري',   day: 'الثلاثاء', startTime: '09:20', endTime: '10:05', room: 'قاعة 101' },
  { id: '7', subjectName: 'التربية الإسلامية',teacher: 'أ. عبدالله الشمري',day: 'الأربعاء', startTime: '07:30', endTime: '08:15', room: 'قاعة 301' },
  { id: '8', subjectName: 'اللغة العربية',    teacher: 'أ. سارة القحطاني', day: 'الخميس',   startTime: '07:30', endTime: '08:15', room: 'قاعة 203' },
  { id: '9', subjectName: 'العلوم',            teacher: 'أ. خالد الزهراني', day: 'الخميس',   startTime: '08:25', endTime: '09:10', room: 'معمل العلوم' },
];

export const user = {
  fullName: 'أسرة العلي',
  firstName: 'أسرة',
  email: 'asra@school.edu.sa',
  grade: 'الصف الثالث المتوسط',
};
