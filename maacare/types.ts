
export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  PREGNANCY_TRACKER = 'PREGNANCY_TRACKER',
  SYMPTOM_CHECKER = 'SYMPTOM_CHECKER',
  PRENATAL_YOGA = 'PRENATAL_YOGA',
  CHILD_CARE_GUIDE = 'CHILD_CARE_GUIDE',
  SELF_CARE = 'SELF_CARE',
  NUTRITION_GUIDE = 'NUTRITION_GUIDE',
  AI_COMPANION = 'AI_COMPANION',
  PARENTS_PARK = 'PARENTS_PARK',
  FAMILY_PLANNING = 'FAMILY_PLANNING',
  CONTRACEPTION = 'CONTRACEPTION',
  VACCINATIONS = 'VACCINATIONS',
  DOCTOR_REGISTER = 'DOCTOR_REGISTER',
  DOCTOR_PROFILE = 'DOCTOR_PROFILE',
  EXPERT_CONSULTATION = 'EXPERT_CONSULTATION',
  MY_APPOINTMENTS = 'MY_APPOINTMENTS',
  VIDEO_CONSULTATION = 'VIDEO_CONSULTATION',
  ABOUT_US = 'ABOUT_US',
  AUTH = 'AUTH',
  PROFILE = 'PROFILE',
  SUBSCRIPTIONS = 'SUBSCRIPTIONS',
  SETTINGS = 'SETTINGS',
  PRIVACY_POLICY = 'PRIVACY_POLICY'
}

export interface UserProfile {
  name: string;
  email: string;
  stage: string;
  avatar: string;
  plan: 'Basic' | 'Premium' | 'Family';
  joinDate: string;
  isDoctor?: boolean;
  specialty?: string;
  bio?: string;
  license?: string;
}

export interface Appointment {
  id: string;
  expertId: number;
  expertName: string;
  expertImage: string;
  specialty: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  price: string;
  cancellationReason?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageUrl?: string;
}

export interface YogaPose {
  name: string;
  benefit: string;
  trimester: 1 | 2 | 3 | 'all';
  image: string;
}

export interface NutritionTip {
  category: string;
  content: string;
  icon: string;
}

export interface ForumPost {
  id: string;
  author: string;
  authorAvatar?: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  tags?: string[];
  time: string;
  isAiGenerated?: boolean;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
}
