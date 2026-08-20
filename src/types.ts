export type UserRole = 'client' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  passwordHash?: string;
  salt?: string;
  role: UserRole;
  avatar?: string;
  company?: string;
  jobTitle?: string;
  location?: string;
  bio?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  address?: string;
  savedProjectIds?: string[];
  createdAt: string;
  updatedAt?: string;
  lastLoginAt?: string;
  status?: 'active' | 'deactivated' | 'suspended' | 'deleted';
  isEmailVerified: boolean;
}

export type ClientProjectStatus =
  | 'Enquiry'
  | 'Requirement Discussion'
  | 'Quotation Sent'
  | 'Quotation Accepted'
  | 'Planning'
  | 'In Progress'
  | 'Testing'
  | 'Completed'
  | 'On Hold'
  | 'Cancelled';

export interface ProjectMilestone {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  completed: boolean;
  dueDate?: string;
  completedAt?: string;
  order: number;
}

export interface ProjectUpdate {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  author: string;
}

export interface ClientProjectDocument {
  id: string;
  name: string;
  url: string;
  size?: string;
  date: string;
}

export interface ClientProject {
  id: string;
  userId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  projectName: string;
  description: string;
  requirements?: string;
  features?: string[];
  technology?: string[];
  startDate: string;
  expectedCompletion: string;
  completedDate?: string;
  status: ClientProjectStatus;
  progress: number; // 0 to 100
  assignedDeveloper: string;
  milestones: ProjectMilestone[];
  recentUpdates: ProjectUpdate[];
  documents?: ClientProjectDocument[];
  quotationId?: string;
  invoiceId?: string;
  notesVisibleToClient?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectCategory = 
  | 'All'
  | 'Web Development'
  | 'Full Stack'
  | 'PHP'
  | 'MERN'
  | 'WordPress'
  | 'E-commerce'
  | 'Business Website';

export interface Project {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  clientName: string;
  clientType?: string;
  technologies: string[];
  features: string[];
  challenges: string;
  solution: string;
  results: string;
  projectDuration: string;
  completionDate: string;
  images: string[];
  gallery?: string[];
  thumbnail: string;
  liveUrl: string;
  githubUrl?: string;
  videoUrl?: string;
  isFeatured: boolean;
  isPublished: boolean;
  status?: 'In Progress' | 'Completed' | 'Archived' | 'Live';
  viewsCount: number;
  role: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  icon: string;
  shortDescription: string;
  description: string;
  features: string[];
  technologies: string[];
  startingPrice?: string;
  deliveryDays?: string;
  isPopular?: boolean;
  isPublished?: boolean;
  displayOrder?: number;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'CMS & Tools' | 'Other';
  proficiency: number; // 0-100
  iconName?: string;
  isPublished?: boolean;
  displayOrder?: number;
}

export type LeadStatus = 
  | 'New'
  | 'Contacted'
  | 'Qualified'
  | 'Requirement Discussion'
  | 'Proposal Sent'
  | 'Negotiation'
  | 'Won'
  | 'Project Won'
  | 'Lost'
  | 'Follow-up';

export type LeadSource = 
  | 'Website Form'
  | 'WhatsApp'
  | 'Email'
  | 'Referral'
  | 'LinkedIn'
  | 'Direct'
  | string;

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  whatsapp?: string;
  source: string;
  projectType?: string;
  requirement?: string;
  budget?: string;
  estimatedBudget?: string;
  deadline?: string;
  status: LeadStatus;
  notes?: string;
  createdDate?: string;
  lastContacted?: string;
  followUpDate?: string;
}

export interface ClientRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  projectsCount: number;
  totalQuotes?: number;
  totalPaid: number;
  totalBilled?: number;
  status: 'Active' | 'Lead' | 'Past' | 'Archived';
  notes: string;
  createdAt: string;
  projectsList?: string[];
}

export type EnquiryStatus = 
  | 'New'
  | 'In Review'
  | 'Contacted'
  | 'Discussion'
  | 'Proposal Sent'
  | 'Quoted'
  | 'Negotiation'
  | 'Approved'
  | 'In Development'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled'
  | 'Closed';

export interface EnquiryNote {
  id?: string;
  text: string;
  date: string;
  author: string;
}

export interface Enquiry {
  id: string;
  userId?: string;
  clientName?: string;
  name?: string;
  clientEmail?: string;
  email?: string;
  clientPhone?: string;
  phone?: string;
  company?: string;
  projectType?: string;
  projectTitle?: string;
  serviceCategory?: string;
  budget?: string;
  budgetRange?: string;
  deadline?: string;
  preferredTimeline?: string;
  description?: string;
  projectDescription?: string;
  requiredFeatures?: string[];
  features?: string[];
  referenceUrl?: string;
  preferredContactMethod?: 'email' | 'whatsapp' | 'phone';
  status: EnquiryStatus;
  internalNotes?: EnquiryNote[];
  notes?: EnquiryNote[];
  createdAt: string;
  updatedAt?: string;
  quoteId?: string;
}

export type ProjectEnquiry = Enquiry;

export type QuoteStatus = 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired' | 'Changes Requested';

export interface QuoteItem {
  id?: string;
  description: string;
  quantity?: number;
  unitPrice?: number;
  rate?: number;
  amount: number;
}

export type QuotationItem = QuoteItem;

export interface Quote {
  id: string;
  quotationNumber?: string;
  enquiryId?: string;
  userId?: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientCompany?: string;
  company?: string;
  projectTitle: string;
  description?: string;
  services?: string[];
  currency?: string;
  items: QuoteItem[];
  subtotal: number;
  discount: number;
  tax: number;
  taxRate?: number;
  total: number;
  deliveryTime?: string;
  estimatedDeliveryDays?: string;
  paymentTerms?: string;
  terms?: string;
  notes?: string;
  status: QuoteStatus;
  clientFeedback?: string;
  createdAt: string;
  updatedAt?: string;
  validUntil: string;
}

export type Quotation = Quote;

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  projectType?: string;
  budget?: string;
  status?: 'unread' | 'read' | 'replied' | 'archived';
  isRead?: boolean;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  company: string;
  role?: string;
  avatar?: string;
  review: string;
  rating: number;
  projectTitle: string;
  isPublished: boolean;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  readTime: string;
  isPublished: boolean;
  author: string;
  publishedAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  isPublished: boolean;
  displayOrder?: number;
}

export type FAQItem = FAQ;

export interface MediaItem {
  id: string;
  name?: string;
  title?: string;
  url: string;
  altText?: string;
  size?: number | string;
  mimeType?: string;
  category?: string;
  createdAt?: string;
}

export interface ActivityLog {
  id: string;
  adminEmail?: string;
  action: string;
  entity: string;
  details: string;
  timestamp: string;
  ip?: string;
  ipAddress?: string;
}

export interface WhyHireMeItem {
  id?: string;
  icon?: string;
  title: string;
  desc?: string;
  description?: string;
}

export interface WorkflowStep {
  stepNumber?: number;
  num?: string;
  title: string;
  desc?: string;
  description?: string;
  timeframe?: string;
}

export interface WebsiteContent {
  hero: {
    heading?: string;
    gradientHeading?: string;
    titleLine1?: string;
    titleLine2?: string;
    highlightedWord?: string;
    subtitle: string;
    description?: string;
    primaryCtaText: string;
    primaryCtaUrl?: string;
    secondaryCtaText: string;
    secondaryCtaUrl?: string;
    badgeText: string;
    hourlyRateBadge?: string;
    availability?: string;
    experienceYears?: string;
    completedProjects?: string;
    happyClients?: string;
    rating?: string;
    profileImage?: string;
  };
  about?: {
    sectionTitle: string;
    bioParagraph1: string;
    bioParagraph2: string;
    bulletPoints: string[];
  };
  whyHireMe: WhyHireMeItem[];
  workflow?: WorkflowStep[];
  workflowSteps?: WorkflowStep[];
  ctaSection?: {
    title: string;
    subtitle: string;
    buttonText: string;
    guaranteeText: string;
  };
  sectionHeadings?: {
    projectsTitle: string;
    projectsSubtitle: string;
    servicesTitle: string;
    servicesSubtitle: string;
    skillsTitle: string;
    skillsSubtitle: string;
    testimonialsTitle: string;
    testimonialsSubtitle: string;
    faqsTitle: string;
    faqsSubtitle: string;
    contactTitle: string;
    contactSubtitle: string;
  };
  footer?: {
    aboutText: string;
    copyrightText: string;
    emergencyNote: string;
  };
}

export interface SEOSettings {
  siteTitle?: string;
  metaTitle?: string;
  metaDescription: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  canonicalUrl?: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  sitemapUrl?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: string;
  isPublished?: boolean;
  isActive?: boolean;
  displayOrder?: number;
  order?: number;
}

export interface ChatbotSettings {
  botName: string;
  welcomeMessage: string;
  avatar?: string;
  suggestedQuestions: string[];
  isEnabled?: boolean;
  humanCtaText?: string;
  whatsappCtaText?: string;
  emailCtaText?: string;
  fallbackMessage?: string;
  fallbackWhatsApp?: string;
  customInstructions?: string;
  pricingRules?: string;
}

export type ChatbotConfig = ChatbotSettings;

export interface AdminSecurity {
  adminUsername?: string;
  adminEmail: string;
  passwordHash: string;
  salt?: string;
  sessionTimeoutMinutes: number;
  is2FAEnabled: boolean;
  lastLoginAt?: string;
  failedAttempts: number;
  lockedUntil?: number;
}

export interface SiteSettings {
  profileName: string;
  professionalTitle: string;
  shortBio: string;
  fullBio: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  githubUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  availabilityStatus: 'Available' | 'Busy' | 'Not Available' | 'Booked';
  availabilityMessage: string;
  resumeUrl?: string;
  experienceYears: number;
  completedProjectsCount: number;
  satisfiedClientsCount: number;
  hourlyRate?: string;
  seoTitle: string;
  seoDescription: string;
  logoText: string;
  mainLogoUrl?: string;
  mobileLogoUrl?: string;
  faviconUrl?: string;
  location?: string;
  workingHours?: string;
  timezone?: string;
  themePreference?: 'dark' | 'light' | 'system';
  accentColor?: string;
  isMaintenanceMode?: boolean;
  maintenanceMessage?: string;
}

export interface AppNotification {
  id: string;
  userId?: string;
  type: 'enquiry' | 'quote' | 'message' | 'system' | 'lead';
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: Array<{ label: string; action: 'navigate' | 'filter' | 'whatsapp' | 'email'; payload?: string }>;
}

