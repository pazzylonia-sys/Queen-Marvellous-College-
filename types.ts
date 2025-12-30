
export enum AppView {
  HOME = 'home',
  ADMISSIONS = 'admissions',
  STAFF = 'staff',
  ADMIN = 'admin',
  ABOUT = 'about'
}

export interface SiteConfig {
  collegeName: string;
  shortName: string;
  tagline: string;
  mission: string;
  vision: string;
  logoUrl?: string;
  admissionYear: string;
}

export interface AdmissionForm {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  previousSchool?: string;
  gradeLevel: string; // Current Grade
  admissionClass: string; // Class applied for (e.g. JSS 1)
  passportPhoto: string; // Base64 string
  status: 'Pending' | 'Approved' | 'Rejected';
  dateApplied: string;
}

export interface StaffProfile {
  id: string;
  name: string;
  role: string;
  department: string;
  imageUrl: string;
  email?: string;
  phone?: string;
  qualifications?: string[];
  bio?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'Urgent' | 'News' | 'Event' | 'General';
}

export interface MediaAsset {
  id: string;
  url: string;
  alt: string;
  isSystem?: boolean;
  label?: string;
}

export interface CustomQuote {
  text: string;
  author: string;
  isOverride: boolean;
}
