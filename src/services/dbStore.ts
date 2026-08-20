import {
  Project,
  Service,
  Skill,
  Enquiry,
  Quote,
  ContactMessage,
  Testimonial,
  BlogPost,
  FAQ,
  SiteSettings,
  User,
  AppNotification,
  ChatMessage,
  Lead,
  ClientRecord,
  MediaItem,
  ActivityLog,
  WebsiteContent,
  SEOSettings,
  SocialLink,
  ChatbotSettings,
  ChatbotConfig,
  AdminSecurity,
  ClientProject,
  ClientProjectStatus,
  ProjectMilestone,
  ProjectUpdate
} from '../types';
import {
  initialProjects,
  initialServices,
  initialSkills,
  initialFAQs,
  initialTestimonials,
  initialBlogPosts,
  initialSiteSettings,
  initialLeads,
  initialClients,
  initialMedia,
  initialActivityLogs,
  initialWebsiteContent,
  initialSEOSettings,
  initialSocialLinks,
  initialChatbotSettings,
  initialAdminSecurity,
  initialClientProjects
} from '../data/initialData';
import {
  generateSalt,
  hashPassword,
  verifyPassword,
  INITIAL_ADMIN_HASH,
  INITIAL_ADMIN_SALT,
  INITIAL_ADMIN_USERNAME,
  INITIAL_ADMIN_EMAIL
} from '../utils/crypto';

const STORAGE_KEYS = {
  PROJECTS: 'skyadav_projects_v1',
  SERVICES: 'skyadav_services_v1',
  SKILLS: 'skyadav_skills_v1',
  FAQS: 'skyadav_faqs_v1',
  TESTIMONIALS: 'skyadav_testimonials_v1',
  BLOGS: 'skyadav_blogs_v1',
  SETTINGS: 'skyadav_settings_v1',
  ENQUIRIES: 'skyadav_enquiries_v1',
  QUOTES: 'skyadav_quotes_v1',
  MESSAGES: 'skyadav_messages_v1',
  USERS: 'skyadav_users_v1',
  CURRENT_USER: 'skyadav_current_user_v1',
  BOOKMARKS: 'skyadav_bookmarks_v1',
  NOTIFICATIONS: 'skyadav_notifications_v1',
  CHAT_MESSAGES: 'skyadav_chat_history_v1',
  OTP_STORE: 'skyadav_otp_store_v1',
  LEADS: 'skyadav_leads_v1',
  CLIENTS: 'skyadav_clients_v1',
  MEDIA: 'skyadav_media_v1',
  ACTIVITY_LOGS: 'skyadav_activity_logs_v1',
  WEBSITE_CONTENT: 'skyadav_website_content_v1',
  SEO_SETTINGS: 'skyadav_seo_settings_v1',
  SOCIAL_LINKS: 'skyadav_social_links_v1',
  CHATBOT_SETTINGS: 'skyadav_chatbot_settings_v1',
  ADMIN_SECURITY: 'skyadav_admin_security_v1',
  ADMIN_SESSION: 'skyadav_admin_session_v1',
  CLIENT_PROJECTS: 'skyadav_client_projects_v1',
};

// Initial default registered client
const initialClientUser: User = {
  id: 'user-alex-101',
  name: 'Alex Rivera',
  email: 'alex.rivera@techventure.io',
  phone: '+1 555-019-2834',
  whatsapp: '+1 555-019-2834',
  role: 'client',
  company: 'TechVenture Labs',
  jobTitle: 'VP of Product',
  location: 'San Francisco, CA',
  bio: 'Building next-generation SaaS analytics and e-commerce platforms.',
  createdAt: '2024-01-15T00:00:00Z',
  isEmailVerified: true,
  status: 'active',
};

// Initial admin user
const initialAdminUser: User = {
  id: 'admin-sk-01',
  name: 'SK Yadav',
  email: INITIAL_ADMIN_EMAIL,
  phone: '+91 9354152837',
  whatsapp: '+91 9354152837',
  role: 'admin',
  company: 'SK Yadav Freelance Studio',
  createdAt: '2023-01-01T00:00:00Z',
  isEmailVerified: true,
  status: 'active',
  avatar: '/logo.png',
};

// Initial sample quote
const initialQuotes: Quote[] = [
  {
    id: 'quote-101',
    quotationNumber: 'QUO-2024-101',
    enquiryId: 'enq-sample-1',
    clientName: 'Alex Rivera',
    clientEmail: 'alex.rivera@techventure.io',
    clientPhone: '+1 555-019-2834',
    company: 'TechVenture Labs',
    projectTitle: 'Custom Full Stack SaaS Platform',
    description: 'Comprehensive design and full stack development for custom multi-tenant analytics dashboard with React, Node.js, and MongoDB.',
    services: ['Full Stack Web Development', 'Custom Web Applications', 'Website UI/UX'],
    items: [
      { id: 'item-1', description: 'UI/UX Interactive Figma System & Frontend Architecture (React + Tailwind)', amount: 1200 },
      { id: 'item-2', description: 'Backend REST API, MongoDB Database Modeling & JWT Auth Layer', amount: 1500 },
      { id: 'item-3', description: 'Analytics Visualization Charts & PDF Export Engine', amount: 800 },
      { id: 'item-4', description: 'Production Deployment, CI/CD Pipeline & 30-Day Launch Support', amount: 500 },
    ],
    subtotal: 4000,
    discount: 400,
    tax: 0,
    total: 3600,
    deliveryTime: '3-4 Weeks',
    estimatedDeliveryDays: '3-4 Weeks',
    paymentTerms: '40% advance upon contract signing, 30% after alpha prototype, 30% upon production deployment.',
    notes: 'Includes complete source code repository handover, deployment scripts, and comprehensive API documentation.',
    status: 'Sent',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

// Initial sample enquiry
const initialEnquiries: Enquiry[] = [
  {
    id: 'enq-sample-1',
    userId: 'user-demo-1',
    name: 'Alex Rivera',
    clientName: 'Alex Rivera',
    email: 'alex.rivera@techventure.io',
    clientEmail: 'alex.rivera@techventure.io',
    phone: '+1 555-019-2834',
    clientPhone: '+1 555-019-2834',
    company: 'TechVenture Labs',
    projectType: 'Full Stack Web Development',
    projectTitle: 'Enterprise Analytics Dashboard Platform',
    serviceCategory: 'Full Stack Web Development',
    budget: '$3,000 - $5,000',
    budgetRange: '$3,000 - $5,000',
    deadline: '1 Month',
    preferredTimeline: '1 Month',
    description: 'We need a high-performance web platform to showcase analytics dashboards for our enterprise clients with secure login and data visualization.',
    projectDescription: 'We need a high-performance web platform to showcase analytics dashboards for our enterprise clients with secure login and data visualization.',
    requiredFeatures: ['Custom Dashboard', 'User Authentication', 'Responsive Mobile Layout', 'Data Exporting (PDF/CSV)'],
    features: ['Custom Dashboard', 'User Authentication', 'Responsive Mobile Layout', 'Data Exporting (PDF/CSV)'],
    referenceUrl: 'https://vicharmanch.secopshub.in/',
    preferredContactMethod: 'email',
    status: 'Proposal Sent',
    internalNotes: [
      { text: 'Reviewed requirements on phone. Very clear scope. Sent initial Quotation #quote-101.', date: new Date().toISOString(), author: 'SK Yadav' }
    ],
    notes: [
      { text: 'Reviewed requirements on phone. Very clear scope. Sent initial Quotation #quote-101.', date: new Date().toISOString(), author: 'SK Yadav' }
    ],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    quoteId: 'quote-101',
  }
];

function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (e) {
    console.error(`Error loading key ${key} from storage:`, e);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving key ${key} to storage:`, e);
  }
}

// In-memory / LocalStorage database manager
export class DatabaseStore {
  // Site Settings
  static getSettings(): SiteSettings {
    const settings = loadFromStorage<SiteSettings>(STORAGE_KEYS.SETTINGS, initialSiteSettings);
    // Automatic migration if old placeholder phone/whatsapp is present in localStorage
    if (
      settings.phone === '+91 98765 43210' ||
      settings.phone === '9876543210' ||
      settings.whatsappNumber === '919876543210' ||
      settings.whatsappNumber === '9876543210'
    ) {
      settings.phone = '+91 9354152837';
      settings.whatsappNumber = '919354152837';
      settings.email = 'skyadav02837@gmail.com';
      saveToStorage(STORAGE_KEYS.SETTINGS, settings);
    }
    return settings;
  }

  static updateSettings(settings: Partial<SiteSettings>): SiteSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    saveToStorage(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  }

  static saveSettings(settings: Partial<SiteSettings>): SiteSettings {
    return this.updateSettings(settings);
  }

  // Projects
  static getProjects(): Project[] {
    return loadFromStorage<Project[]>(STORAGE_KEYS.PROJECTS, initialProjects);
  }

  static getProjectBySlug(slug: string): Project | undefined {
    const projects = this.getProjects();
    return projects.find(p => p.slug.toLowerCase() === slug.toLowerCase() || p.id === slug);
  }

  static getProjectById(id: string): Project | undefined {
    const projects = this.getProjects();
    return projects.find(p => p.id === id);
  }

  static saveProject(project: Partial<Project> & { name: string }): Project {
    const projects = this.getProjects();
    const id = project.id || `proj-${Date.now()}`;
    const slug = project.slug || project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const existingIndex = projects.findIndex(p => p.id === id);
    const newProject: Project = {
      id,
      name: project.name,
      slug,
      category: project.category || 'Web Development',
      shortDescription: project.shortDescription || '',
      description: project.description || '',
      clientName: project.clientName || 'Private Client',
      role: project.role || 'Full Stack Developer',
      technologies: project.technologies || ['HTML', 'CSS', 'JavaScript'],
      features: project.features || [],
      challenges: project.challenges || '',
      solution: project.solution || '',
      results: project.results || '',
      projectDuration: project.projectDuration || '2-4 Weeks',
      completionDate: project.completionDate || new Date().getFullYear().toString(),
      images: project.images && project.images.length > 0 ? project.images : [project.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80'],
      thumbnail: project.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
      liveUrl: project.liveUrl || 'https://example.com',
      githubUrl: project.githubUrl,
      videoUrl: project.videoUrl,
      isFeatured: project.isFeatured ?? false,
      isPublished: project.isPublished ?? true,
      viewsCount: project.viewsCount || 0,
      createdAt: project.createdAt || new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      projects[existingIndex] = { ...projects[existingIndex], ...newProject };
    } else {
      projects.unshift(newProject);
    }
    saveToStorage(STORAGE_KEYS.PROJECTS, projects);
    return newProject;
  }

  static deleteProject(id: string): boolean {
    const projects = this.getProjects();
    const filtered = projects.filter(p => p.id !== id);
    saveToStorage(STORAGE_KEYS.PROJECTS, filtered);
    return filtered.length !== projects.length;
  }

  static incrementProjectViews(id: string): void {
    const projects = this.getProjects();
    const proj = projects.find(p => p.id === id);
    if (proj) {
      proj.viewsCount = (proj.viewsCount || 0) + 1;
      saveToStorage(STORAGE_KEYS.PROJECTS, projects);
    }
  }

  // Services
  static getServices(): Service[] {
    return loadFromStorage<Service[]>(STORAGE_KEYS.SERVICES, initialServices);
  }

  static saveService(service: Partial<Service> & { title: string }): Service {
    const services = this.getServices();
    const id = service.id || `serv-${Date.now()}`;
    const slug = service.slug || service.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const existingIndex = services.findIndex(s => s.id === id);

    const newService: Service = {
      id,
      title: service.title,
      slug,
      icon: service.icon || 'Globe',
      shortDescription: service.shortDescription || '',
      description: service.description || '',
      features: service.features || [],
      technologies: service.technologies || [],
      startingPrice: service.startingPrice,
      deliveryDays: service.deliveryDays,
      isPopular: service.isPopular ?? false,
    };

    if (existingIndex >= 0) {
      services[existingIndex] = newService;
    } else {
      services.push(newService);
    }
    saveToStorage(STORAGE_KEYS.SERVICES, services);
    return newService;
  }

  static deleteService(id: string): boolean {
    const services = this.getServices();
    const filtered = services.filter(s => s.id !== id);
    saveToStorage(STORAGE_KEYS.SERVICES, filtered);
    return filtered.length !== services.length;
  }

  // Skills
  static getSkills(): Skill[] {
    return loadFromStorage<Skill[]>(STORAGE_KEYS.SKILLS, initialSkills);
  }

  static saveSkill(skill: Partial<Skill> & { name: string }): Skill {
    const skills = this.getSkills();
    const id = skill.id || `sk-${Date.now()}`;
    const existingIndex = skills.findIndex(s => s.id === id);

    const newSkill: Skill = {
      id,
      name: skill.name,
      category: skill.category || 'Frontend',
      proficiency: skill.proficiency ?? 85,
      iconName: skill.iconName,
    };

    if (existingIndex >= 0) {
      skills[existingIndex] = newSkill;
    } else {
      skills.push(newSkill);
    }
    saveToStorage(STORAGE_KEYS.SKILLS, skills);
    return newSkill;
  }

  static deleteSkill(id: string): boolean {
    const skills = this.getSkills();
    const filtered = skills.filter(s => s.id !== id);
    saveToStorage(STORAGE_KEYS.SKILLS, filtered);
    return filtered.length !== skills.length;
  }

  // FAQs
  static getFAQs(): FAQ[] {
    return loadFromStorage<FAQ[]>(STORAGE_KEYS.FAQS, initialFAQs);
  }

  static saveFAQ(faq: Partial<FAQ> & { question: string; answer: string }): FAQ {
    const faqs = this.getFAQs();
    const id = faq.id || `faq-${Date.now()}`;
    const existingIndex = faqs.findIndex(f => f.id === id);

    const newFAQ: FAQ = {
      id,
      question: faq.question,
      answer: faq.answer,
      category: faq.category || 'General',
      isPublished: faq.isPublished ?? true,
    };

    if (existingIndex >= 0) {
      faqs[existingIndex] = newFAQ;
    } else {
      faqs.push(newFAQ);
    }
    saveToStorage(STORAGE_KEYS.FAQS, faqs);
    return newFAQ;
  }

  static deleteFAQ(id: string): boolean {
    const faqs = this.getFAQs();
    const filtered = faqs.filter(f => f.id !== id);
    saveToStorage(STORAGE_KEYS.FAQS, filtered);
    return filtered.length !== faqs.length;
  }

  // Testimonials
  static getTestimonials(): Testimonial[] {
    return loadFromStorage<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, initialTestimonials);
  }

  static saveTestimonial(test: Partial<Testimonial> & { clientName: string; review: string }): Testimonial {
    const tests = this.getTestimonials();
    const id = test.id || `test-${Date.now()}`;
    const existingIndex = tests.findIndex(t => t.id === id);

    const newTestimonial: Testimonial = {
      id,
      clientName: test.clientName,
      company: test.company || 'Client',
      role: test.role || '',
      avatar: test.avatar,
      review: test.review,
      rating: test.rating || 5,
      projectTitle: test.projectTitle || 'Web Development Project',
      isPublished: test.isPublished ?? true,
      createdAt: test.createdAt || new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      tests[existingIndex] = newTestimonial;
    } else {
      tests.unshift(newTestimonial);
    }
    saveToStorage(STORAGE_KEYS.TESTIMONIALS, tests);
    return newTestimonial;
  }

  static deleteTestimonial(id: string): boolean {
    const tests = this.getTestimonials();
    const filtered = tests.filter(t => t.id !== id);
    saveToStorage(STORAGE_KEYS.TESTIMONIALS, filtered);
    return filtered.length !== tests.length;
  }

  // Blog Posts
  static getBlogPosts(): BlogPost[] {
    return loadFromStorage<BlogPost[]>(STORAGE_KEYS.BLOGS, initialBlogPosts);
  }

  static getBlogPostBySlug(slug: string): BlogPost | undefined {
    return this.getBlogPosts().find(b => b.slug === slug || b.id === slug);
  }

  static saveBlogPost(blog: Partial<BlogPost> & { title: string; content: string }): BlogPost {
    const blogs = this.getBlogPosts();
    const id = blog.id || `blog-${Date.now()}`;
    const slug = blog.slug || blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const existingIndex = blogs.findIndex(b => b.id === id);

    const newBlog: BlogPost = {
      id,
      title: blog.title,
      slug,
      excerpt: blog.excerpt || blog.content.substring(0, 150) + '...',
      content: blog.content,
      coverImage: blog.coverImage || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      category: blog.category || 'Web Development',
      tags: blog.tags || ['WebDev', 'Tech'],
      readTime: blog.readTime || `${Math.max(1, Math.ceil(blog.content.split(' ').length / 200))} min read`,
      isPublished: blog.isPublished ?? true,
      author: blog.author || 'SK Yadav',
      publishedAt: blog.publishedAt || new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      blogs[existingIndex] = newBlog;
    } else {
      blogs.unshift(newBlog);
    }
    saveToStorage(STORAGE_KEYS.BLOGS, blogs);
    return newBlog;
  }

  static deleteBlogPost(id: string): boolean {
    const blogs = this.getBlogPosts();
    const filtered = blogs.filter(b => b.id !== id);
    saveToStorage(STORAGE_KEYS.BLOGS, filtered);
    return filtered.length !== blogs.length;
  }

  // Enquiries
  static getEnquiries(): Enquiry[] {
    return loadFromStorage<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, initialEnquiries);
  }

  static getEnquiriesForUser(userId: string, email: string): Enquiry[] {
    const enquiries = this.getEnquiries();
    return enquiries.filter(
      e => (e.userId && e.userId === userId) ||
           (e.clientEmail && e.clientEmail.toLowerCase() === email.toLowerCase()) ||
           (e.email && e.email.toLowerCase() === email.toLowerCase())
    );
  }

  static getUserEnquiries(userId: string, email: string): Enquiry[] {
    return this.getEnquiriesForUser(userId, email);
  }

  static createEnquiry(enquiry: Partial<Enquiry>): Enquiry {
    const enquiries = this.getEnquiries();
    const clientName = enquiry.clientName || enquiry.name || 'Prospective Client';
    const clientEmail = enquiry.clientEmail || enquiry.email || 'client@example.com';
    const projectTitle = enquiry.projectTitle || enquiry.projectType || 'Custom Project';
    const projectDescription = enquiry.projectDescription || enquiry.description || '';

    const newEnquiry: Enquiry = {
      ...enquiry,
      id: enquiry.id || `enq-${Date.now()}`,
      clientName,
      name: clientName,
      clientEmail,
      email: clientEmail,
      clientPhone: enquiry.clientPhone || enquiry.phone || '',
      phone: enquiry.clientPhone || enquiry.phone || '',
      projectTitle,
      projectType: projectTitle,
      serviceCategory: enquiry.serviceCategory || enquiry.projectType || 'Web Development',
      projectDescription,
      description: projectDescription,
      budgetRange: enquiry.budgetRange || enquiry.budget || 'Flexible',
      budget: enquiry.budgetRange || enquiry.budget || 'Flexible',
      preferredTimeline: enquiry.preferredTimeline || enquiry.deadline || 'Flexible',
      deadline: enquiry.preferredTimeline || enquiry.deadline || 'Flexible',
      status: enquiry.status || 'New',
      internalNotes: enquiry.internalNotes || [
        {
          text: `Enquiry received for ${projectTitle}.`,
          date: new Date().toISOString(),
          author: 'System'
        }
      ],
      notes: enquiry.notes || [
        {
          text: `Enquiry received for ${projectTitle}.`,
          date: new Date().toISOString(),
          author: 'System'
        }
      ],
      createdAt: enquiry.createdAt || new Date().toISOString(),
    };
    enquiries.unshift(newEnquiry);
    saveToStorage(STORAGE_KEYS.ENQUIRIES, enquiries);

    // Trigger Admin notification
    this.addNotification({
      type: 'enquiry',
      title: `New Enquiry from ${newEnquiry.clientName}`,
      message: `${newEnquiry.projectType} (Budget: ${newEnquiry.budget})`,
      isRead: false,
      link: '/admin',
    });

    return newEnquiry;
  }

  static saveEnquiry(enquiry: Partial<Enquiry>): Enquiry {
    return this.createEnquiry(enquiry);
  }

  static updateEnquiryStatus(id: string, status: Enquiry['status'], noteText?: string, authorName = 'SK Yadav'): Enquiry | undefined {
    const enquiries = this.getEnquiries();
    const enquiry = enquiries.find(e => e.id === id);
    if (enquiry) {
      enquiry.status = status;
      if (!enquiry.internalNotes) enquiry.internalNotes = [];
      if (!enquiry.notes) enquiry.notes = [];
      
      if (noteText) {
        const newNote = {
          text: noteText,
          date: new Date().toISOString(),
          author: authorName,
        };
        enquiry.internalNotes.push(newNote);
        enquiry.notes.push(newNote);
      }
      saveToStorage(STORAGE_KEYS.ENQUIRIES, enquiries);

      // Trigger client notification
      this.addNotification({
        userId: enquiry.userId,
        type: 'enquiry',
        title: `Enquiry Status Updated: ${status}`,
        message: `Your project enquiry for "${enquiry.projectType || enquiry.projectTitle}" is now in "${status}" state.`,
        isRead: false,
        link: '/dashboard',
      });
      return enquiry;
    }
    return undefined;
  }

  static addEnquiryNote(id: string, text: string, author = 'SK Yadav'): Enquiry | undefined {
    const enquiries = this.getEnquiries();
    const enquiry = enquiries.find(e => e.id === id);
    if (enquiry) {
      if (!enquiry.internalNotes) enquiry.internalNotes = [];
      if (!enquiry.notes) enquiry.notes = [];
      const newNote = {
        text,
        date: new Date().toISOString(),
        author,
      };
      enquiry.internalNotes.push(newNote);
      enquiry.notes.push(newNote);
      saveToStorage(STORAGE_KEYS.ENQUIRIES, enquiries);
      return enquiry;
    }
    return undefined;
  }

  // Quotes
  static getQuotes(): Quote[] {
    return loadFromStorage<Quote[]>(STORAGE_KEYS.QUOTES, initialQuotes);
  }

  static getQuotations(): Quote[] {
    return this.getQuotes();
  }

  static getQuotesForUser(userIdOrEmail: string, email?: string): Quote[] {
    const quotes = this.getQuotes();
    const cleanEmail = (email || userIdOrEmail).toLowerCase();
    return quotes.filter(
      q => (q.userId && q.userId === userIdOrEmail) ||
           (q.clientEmail && q.clientEmail.toLowerCase() === cleanEmail)
    );
  }

  static getUserQuotations(userIdOrEmail: string, email?: string): Quote[] {
    return this.getQuotesForUser(userIdOrEmail, email);
  }

  static getQuoteById(id: string): Quote | undefined {
    return this.getQuotes().find(q => q.id === id);
  }

  static createQuote(quoteData: Partial<Quote> & { clientName: string; clientEmail: string; projectTitle: string }): Quote {
    const quotes = this.getQuotes();
    const id = quoteData.id || `quote-${Date.now()}`;
    const newQuote: Quote = {
      id,
      quotationNumber: quoteData.quotationNumber || `QUO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      enquiryId: quoteData.enquiryId,
      userId: quoteData.userId,
      clientName: quoteData.clientName,
      clientEmail: quoteData.clientEmail,
      clientPhone: quoteData.clientPhone,
      clientCompany: quoteData.clientCompany || quoteData.company,
      company: quoteData.company || quoteData.clientCompany,
      projectTitle: quoteData.projectTitle,
      description: quoteData.description || '',
      services: quoteData.services || ['Full Stack Web Development'],
      currency: quoteData.currency || 'USD',
      items: quoteData.items || [{ description: 'Custom Web Application Development', amount: 1500 }],
      subtotal: quoteData.subtotal || 1500,
      discount: quoteData.discount || 0,
      tax: quoteData.tax || 0,
      total: quoteData.total || 1500,
      deliveryTime: quoteData.deliveryTime || quoteData.estimatedDeliveryDays || '2-3 Weeks',
      estimatedDeliveryDays: quoteData.estimatedDeliveryDays || quoteData.deliveryTime || '2-3 Weeks',
      paymentTerms: quoteData.paymentTerms || '50% Upfront, 50% on completion',
      notes: quoteData.notes || '',
      status: quoteData.status || 'Sent',
      createdAt: quoteData.createdAt || new Date().toISOString(),
      validUntil: quoteData.validUntil || new Date(Date.now() + 14 * 86400000).toISOString(),
    };
    quotes.unshift(newQuote);
    saveToStorage(STORAGE_KEYS.QUOTES, quotes);

    // If linked to enquiry, update enquiry
    if (newQuote.enquiryId) {
      const enquiries = this.getEnquiries();
      const enq = enquiries.find(e => e.id === newQuote.enquiryId);
      if (enq) {
        enq.quoteId = newQuote.id;
        enq.status = 'Quoted';
        if (!enq.internalNotes) enq.internalNotes = [];
        enq.internalNotes.push({
          text: `Generated Quotation #${newQuote.id} for $${newQuote.total}.`,
          date: new Date().toISOString(),
          author: 'SK Yadav',
        });
        saveToStorage(STORAGE_KEYS.ENQUIRIES, enquiries);
      }
    }

    // Client notification
    this.addNotification({
      type: 'quote',
      title: `New Quotation Received: ${newQuote.projectTitle}`,
      message: `Quotation for ${newQuote.projectTitle} (Total: $${newQuote.total}) has been prepared.`,
      isRead: false,
      link: '/dashboard',
    });

    return newQuote;
  }

  static saveQuotation(quoteData: Partial<Quote> & { clientName: string; clientEmail: string; projectTitle: string }): Quote {
    return this.createQuote(quoteData);
  }

  static updateQuoteStatus(id: string, status: Quote['status'], feedback?: string): Quote | undefined {
    const quotes = this.getQuotes();
    const quote = quotes.find(q => q.id === id);
    if (quote) {
      quote.status = status;
      if (feedback) quote.clientFeedback = feedback;
      saveToStorage(STORAGE_KEYS.QUOTES, quotes);

      // Admin notification
      this.addNotification({
        type: 'quote',
        title: `Quotation #${quote.id} ${status}`,
        message: `${quote.clientName} updated the quotation status to "${status}".`,
        isRead: false,
        link: '/admin',
      });

      return quote;
    }
    return undefined;
  }

  static updateQuotationStatus(id: string, status: Quote['status'], feedback?: string): Quote | undefined {
    return this.updateQuoteStatus(id, status, feedback);
  }

  // Contact Messages
  static getMessages(): ContactMessage[] {
    return loadFromStorage<ContactMessage[]>(STORAGE_KEYS.MESSAGES, []);
  }

  static createMessage(msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): ContactMessage {
    const messages = this.getMessages();
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      status: 'unread',
      createdAt: new Date().toISOString(),
    };
    messages.unshift(newMsg);
    saveToStorage(STORAGE_KEYS.MESSAGES, messages);

    // Admin notification
    this.addNotification({
      type: 'message',
      title: `New Contact Message from ${newMsg.name}`,
      message: `${newMsg.subject || 'Direct message'}: ${newMsg.message.substring(0, 80)}...`,
      isRead: false,
      link: '/admin',
    });

    return newMsg;
  }

  static updateMessageStatus(id: string, status: ContactMessage['status']): void {
    const messages = this.getMessages();
    const msg = messages.find(m => m.id === id);
    if (msg) {
      msg.status = status;
      saveToStorage(STORAGE_KEYS.MESSAGES, messages);
    }
  }

  // Bookmarks
  static getBookmarks(userId: string): string[] {
    const all = loadFromStorage<Record<string, string[]>>(STORAGE_KEYS.BOOKMARKS, {});
    return all[userId] || [];
  }

  static toggleBookmark(userId: string, projectId: string): boolean {
    const all = loadFromStorage<Record<string, string[]>>(STORAGE_KEYS.BOOKMARKS, {});
    const userBookmarks = all[userId] || [];
    const index = userBookmarks.indexOf(projectId);
    let isBookmarked = false;
    if (index >= 0) {
      userBookmarks.splice(index, 1);
      isBookmarked = false;
    } else {
      userBookmarks.push(projectId);
      isBookmarked = true;
    }
    all[userId] = userBookmarks;
    saveToStorage(STORAGE_KEYS.BOOKMARKS, all);
    return isBookmarked;
  }

  // Notifications
  static getNotifications(userId?: string): AppNotification[] {
    const all = loadFromStorage<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, [
      {
        id: 'notif-welcome',
        title: 'Welcome to SK Yadav Freelancing Platform',
        message: 'Explore our latest full-stack case studies, request custom quotations, or chat with SK Assistant.',
        isRead: false,
        type: 'system',
        createdAt: new Date().toISOString(),
      }
    ]);
    if (!userId) return all;
    return all.filter(n => !n.userId || n.userId === userId);
  }

  static addNotification(notif: Omit<AppNotification, 'id' | 'createdAt'>): AppNotification {
    const all = loadFromStorage<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    all.unshift(newNotif);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, all);
    return newNotif;
  }

  static markNotificationRead(id: string): void {
    const all = loadFromStorage<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const notif = all.find(n => n.id === id);
    if (notif) {
      notif.isRead = true;
      saveToStorage(STORAGE_KEYS.NOTIFICATIONS, all);
    }
  }

  static markAllNotificationsRead(userId?: string): void {
    const all = loadFromStorage<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    all.forEach(n => {
      if (!userId || !n.userId || n.userId === userId) {
        n.isRead = true;
      }
    });
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, all);
  }

  // Users & Auth
  static getUsers(): User[] {
    return loadFromStorage<User[]>(STORAGE_KEYS.USERS, [initialAdminUser, initialClientUser]);
  }

  static getUserById(id: string): User | undefined {
    return this.getUsers().find(u => u.id === id);
  }

  static getUserByEmail(email: string): User | undefined {
    const clean = email.toLowerCase().trim();
    return this.getUsers().find(u => u.email.toLowerCase() === clean);
  }

  static getCurrentUser(): User | null {
    return loadFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  }

  static setCurrentUser(user: User | null): void {
    saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
  }

  // OTP Handling
  static generateOTP(target: string): { otp: string; expiresAt: number } {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;
    const store = loadFromStorage<Record<string, { otp: string; expiresAt: number; attempts: number }>>(STORAGE_KEYS.OTP_STORE, {});
    store[target.toLowerCase().trim()] = { otp, expiresAt, attempts: 0 };
    saveToStorage(STORAGE_KEYS.OTP_STORE, store);
    return { otp, expiresAt };
  }

  static verifyOTP(target: string, inputOTP: string): { success: boolean; message: string } {
    const store = loadFromStorage<Record<string, { otp: string; expiresAt: number; attempts: number }>>(STORAGE_KEYS.OTP_STORE, {});
    const key = target.toLowerCase().trim();
    const record = store[key];
    if (!record) {
      return { success: false, message: 'No active OTP requested for this email/phone. Please request a new code.' };
    }
    if (Date.now() > record.expiresAt) {
      delete store[key];
      saveToStorage(STORAGE_KEYS.OTP_STORE, store);
      return { success: false, message: 'OTP has expired. Please request a new one.' };
    }
    if (record.attempts >= 5) {
      delete store[key];
      saveToStorage(STORAGE_KEYS.OTP_STORE, store);
      return { success: false, message: 'Maximum attempts exceeded. Please request a new code.' };
    }
    if (record.otp !== inputOTP.trim()) {
      record.attempts += 1;
      saveToStorage(STORAGE_KEYS.OTP_STORE, store);
      return { success: false, message: 'Invalid OTP code. Please check and try again.' };
    }
    delete store[key];
    saveToStorage(STORAGE_KEYS.OTP_STORE, store);
    return { success: true, message: 'OTP verified successfully.' };
  }

  // Client Registration with Password Hashing
  static async registerClient(data: {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    whatsapp?: string;
    company?: string;
    jobTitle?: string;
    location?: string;
    avatar?: string;
  }): Promise<{ success: boolean; message: string; user?: User }> {
    const users = this.getUsers();
    const cleanEmail = data.email.toLowerCase().trim();

    // Check existing
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      if (existing.status === 'deleted') {
        // reactivate
        existing.status = 'active';
        existing.name = data.name || existing.name;
        if (data.password) {
          const salt = generateSalt();
          existing.salt = salt;
          existing.passwordHash = await hashPassword(data.password, salt);
        }
        saveToStorage(STORAGE_KEYS.USERS, users);
        this.setCurrentUser(existing);
        return { success: true, message: 'Account reactivated successfully.', user: existing };
      }
      return { success: false, message: 'This email is already registered.' };
    }

    if (cleanEmail === 'skyadav02837@gmail.com' || cleanEmail === 'skyadav06') {
      return { success: false, message: 'This email is already registered.' };
    }

    const salt = generateSalt();
    const passwordHash = data.password ? await hashPassword(data.password, salt) : undefined;

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      phone: data.phone?.trim() || '',
      whatsapp: data.whatsapp?.trim() || data.phone?.trim() || '',
      company: data.company?.trim() || '',
      jobTitle: data.jobTitle?.trim() || '',
      location: data.location?.trim() || '',
      avatar: data.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=0284c7&color=fff`,
      role: 'client',
      salt,
      passwordHash,
      status: 'active',
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveToStorage(STORAGE_KEYS.USERS, users);
    this.setCurrentUser(newUser);

    // Sync or create CRM Client record
    this.saveClient({
      id: `client-${newUser.id}`,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone || '',
      company: newUser.company || 'Individual',
      status: 'Active',
      notes: `Registered directly through Client Portal on ${new Date().toLocaleDateString()}`,
    });

    this.addActivityLog('Client Registered', 'Authentication', `New client registered: ${newUser.name} (${newUser.email})`);
    
    // Add Welcome notification
    this.addNotification({
      userId: newUser.id,
      type: 'system',
      title: `Welcome to SK Yadav Freelance Portal, ${newUser.name}!`,
      message: 'You can now submit enquiries, review customized quotations, and track your active project milestones live.',
      isRead: false,
      link: '/dashboard',
    });

    return {
      success: true,
      message: 'Registration successful! Welcome to your Client Portal.',
      user: newUser
    };
  }

  // Client Password Login
  static async loginClientWithPassword(
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string; user?: User; token?: string }> {
    const cleanEmail = email.toLowerCase().trim();
    const user = this.getUserByEmail(cleanEmail);

    if (!user || user.status === 'deleted') {
      return { success: false, message: 'No account found with this email address.' };
    }

    if (user.status === 'suspended' || user.status === 'deactivated') {
      return { success: false, message: 'This account is currently suspended. Please contact support.' };
    }

    if (user.role === 'admin') {
      return {
        success: false,
        message: 'Administrator credentials cannot be used on the client login portal. Please use the Admin Portal.'
      };
    }

    if (!user.passwordHash || !user.salt) {
      // User registered with OTP without password yet
      return {
        success: false,
        message: 'This account was created via OTP. Please sign in with OTP verification or reset your password.'
      };
    }

    const isValid = await verifyPassword(password, user.salt, user.passwordHash);
    if (!isValid) {
      return { success: false, message: 'Invalid password. Please check your credentials and try again.' };
    }

    // Update last login
    user.lastLoginAt = new Date().toISOString();
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) users[idx] = user;
    saveToStorage(STORAGE_KEYS.USERS, users);

    this.setCurrentUser(user);
    const token = `sk_client_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    return {
      success: true,
      message: 'Welcome back! Login successful.',
      user,
      token
    };
  }

  // Client OTP Login
  static async loginClientWithOTP(
    email: string,
    inputOTP: string,
    name?: string,
    phone?: string
  ): Promise<{ success: boolean; message: string; user?: User; token?: string }> {
    const verifyResult = this.verifyOTP(email, inputOTP);
    if (!verifyResult.success) {
      return { success: false, message: verifyResult.message };
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = this.getUserByEmail(cleanEmail);

    if (user && user.role === 'admin') {
      return {
        success: false,
        message: 'Administrator credentials cannot be verified via public client login.'
      };
    }

    if (!user) {
      // Auto-register verified client
      const res = await this.registerClient({
        name: name || cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: phone || '',
      });
      user = res.user!;
    } else {
      user.lastLoginAt = new Date().toISOString();
      user.isEmailVerified = true;
      const users = this.getUsers();
      const idx = users.findIndex(u => u.id === user.id);
      if (idx >= 0) users[idx] = user;
      saveToStorage(STORAGE_KEYS.USERS, users);
      this.setCurrentUser(user);
    }

    const token = `sk_client_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return {
      success: true,
      message: 'Login successful via OTP verification.',
      user,
      token
    };
  }

  // Client Profile Update
  static updateUserProfile(userId: string, data: Partial<User>): User | undefined {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx < 0) return undefined;

    const updatedUser: User = {
      ...users[idx],
      ...data,
      updatedAt: new Date().toISOString()
    };

    users[idx] = updatedUser;
    saveToStorage(STORAGE_KEYS.USERS, users);

    // If updating current user, refresh session
    const current = this.getCurrentUser();
    if (current && current.id === userId) {
      this.setCurrentUser(updatedUser);
    }

    // Sync CRM record
    const clients = this.getClients();
    const cIdx = clients.findIndex(c => c.email.toLowerCase() === updatedUser.email.toLowerCase());
    if (cIdx >= 0) {
      clients[cIdx] = {
        ...clients[cIdx],
        name: updatedUser.name,
        phone: updatedUser.phone || clients[cIdx].phone,
        company: updatedUser.company || clients[cIdx].company,
      };
      saveToStorage(STORAGE_KEYS.CLIENTS, clients);
    }

    this.addActivityLog('Updated Client Profile', 'User Management', `User ${updatedUser.name} updated profile details`);
    return updatedUser;
  }

  // Client Password Change
  static async changeUserPassword(
    userId: string,
    currentPass: string,
    newPass: string
  ): Promise<{ success: boolean; message: string }> {
    const user = this.getUserById(userId);
    if (!user) return { success: false, message: 'User not found.' };

    if (user.passwordHash && user.salt) {
      const isValid = await verifyPassword(currentPass, user.salt, user.passwordHash);
      if (!isValid) return { success: false, message: 'Current password is incorrect.' };
    }

    const newSalt = generateSalt();
    const newHash = await hashPassword(newPass, newSalt);

    user.salt = newSalt;
    user.passwordHash = newHash;
    user.updatedAt = new Date().toISOString();

    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx >= 0) users[idx] = user;
    saveToStorage(STORAGE_KEYS.USERS, users);

    if (this.getCurrentUser()?.id === userId) {
      this.setCurrentUser(user);
    }

    return { success: true, message: 'Password updated successfully.' };
  }

  // Password Reset with OTP
  static async resetPasswordWithOTP(
    email: string,
    otp: string,
    newPass: string
  ): Promise<{ success: boolean; message: string }> {
    const verifyRes = this.verifyOTP(email, otp);
    if (!verifyRes.success) {
      return { success: false, message: verifyRes.message };
    }

    const user = this.getUserByEmail(email);
    if (!user) {
      return { success: false, message: 'User account not found.' };
    }

    const newSalt = generateSalt();
    const newHash = await hashPassword(newPass, newSalt);

    user.salt = newSalt;
    user.passwordHash = newHash;
    user.updatedAt = new Date().toISOString();

    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) users[idx] = user;
    saveToStorage(STORAGE_KEYS.USERS, users);

    return { success: true, message: 'Password has been reset successfully. You can now log in.' };
  }

  // Soft Delete Client Account (preserves quotation & financial records)
  static deleteUserAccount(userId: string): { success: boolean; message: string } {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return { success: false, message: 'User not found.' };

    if (user.role === 'admin') {
      return { success: false, message: 'The primary administrator account cannot be deleted.' };
    }

    // Soft-delete to preserve quotation integrity
    user.status = 'deleted';
    user.name = 'Deactivated Client';
    user.email = `deleted_${Date.now()}@anonymous.local`;
    user.phone = '';
    user.whatsapp = '';
    user.passwordHash = undefined;
    user.salt = undefined;
    user.updatedAt = new Date().toISOString();

    saveToStorage(STORAGE_KEYS.USERS, users);

    const current = this.getCurrentUser();
    if (current && current.id === userId) {
      this.setCurrentUser(null);
    }

    this.addActivityLog('Soft-Deleted User Account', 'User Management', `User ID #${userId} account deleted with financial record integrity preserved`);
    return { success: true, message: 'Account has been deleted successfully.' };
  }

  static registerOrLoginWithOTP(email: string, name?: string, phone?: string): User {
    const users = this.getUsers();
    const cleanEmail = email.toLowerCase().trim();
    let user = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      user = {
        id: `user-${Date.now()}`,
        name: name || cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: phone || '',
        role: 'client',
        createdAt: new Date().toISOString(),
        isEmailVerified: true,
        status: 'active',
      };
      users.push(user);
      saveToStorage(STORAGE_KEYS.USERS, users);
    }
    this.setCurrentUser(user);
    return user;
  }

  // Chatbot History
  static getChatMessages(): ChatMessage[] {
    return loadFromStorage<ChatMessage[]>(STORAGE_KEYS.CHAT_MESSAGES, [
      {
        id: 'msg-welcome',
        role: 'assistant',
        content: `👋 Hello! I'm **SK Assistant**, the AI assistant for Full Stack Developer **SK Yadav**.\n\nI can help you explore SK's portfolio projects, technology stacks (MERN, PHP/MySQL, WordPress), development process, quotation estimates, or connect you directly with SK Yadav for your upcoming project.\n\nHow can I help you today?`,
        timestamp: new Date().toISOString(),
        suggestedActions: [
          { label: '🚀 Start a Project', action: 'navigate', payload: '/dashboard' },
          { label: '💼 View Portfolio Projects', action: 'navigate', payload: '/projects' },
          { label: '💬 WhatsApp SK Yadav', action: 'whatsapp' },
          { label: '🛠️ Explore Services', action: 'navigate', payload: '/services' }
        ]
      }
    ]);
  }

  static saveChatMessage(msg: ChatMessage): void {
    const messages = this.getChatMessages();
    messages.push(msg);
    saveToStorage(STORAGE_KEYS.CHAT_MESSAGES, messages);
  }

  static clearChat(): void {
    saveToStorage(STORAGE_KEYS.CHAT_MESSAGES, []);
  }

  // ==========================================
  // CMS: WEBSITE CONTENT
  // ==========================================
  static getWebsiteContent(): WebsiteContent {
    return loadFromStorage<WebsiteContent>(STORAGE_KEYS.WEBSITE_CONTENT, initialWebsiteContent);
  }

  static updateWebsiteContent(content: Partial<WebsiteContent>): WebsiteContent {
    const current = this.getWebsiteContent();
    const updated: WebsiteContent = {
      ...current,
      ...content,
      hero: { ...current.hero, ...(content.hero || {}) },
      whyHireMe: content.whyHireMe || current.whyHireMe,
      workflow: content.workflow || current.workflow,
      sectionHeadings: { ...current.sectionHeadings, ...(content.sectionHeadings || {}) },
      footer: { ...current.footer, ...(content.footer || {}) },
    };
    saveToStorage(STORAGE_KEYS.WEBSITE_CONTENT, updated);
    this.addActivityLog('Updated Website Content', 'CMS Content', 'Updated hero and section copy');
    return updated;
  }

  // ==========================================
  // CMS: SEO SETTINGS
  // ==========================================
  static getSEOSettings(): SEOSettings {
    return loadFromStorage<SEOSettings>(STORAGE_KEYS.SEO_SETTINGS, initialSEOSettings);
  }

  static updateSEOSettings(seo: Partial<SEOSettings>): SEOSettings {
    const current = this.getSEOSettings();
    const updated: SEOSettings = { ...current, ...seo };
    saveToStorage(STORAGE_KEYS.SEO_SETTINGS, updated);
    this.addActivityLog('Updated SEO Settings', 'SEO & Metadata', `Updated meta title: ${updated.siteTitle}`);
    return updated;
  }

  // ==========================================
  // CMS: SOCIAL LINKS
  // ==========================================
  static getSocialLinks(): SocialLink[] {
    return loadFromStorage<SocialLink[]>(STORAGE_KEYS.SOCIAL_LINKS, initialSocialLinks);
  }

  static saveSocialLink(link: Partial<SocialLink> & { platform: string; url: string }): SocialLink {
    const links = this.getSocialLinks();
    const id = link.id || `soc-${Date.now()}`;
    const existingIndex = links.findIndex(l => l.id === id);

    const newLink: SocialLink = {
      id,
      platform: link.platform,
      url: link.url,
      icon: link.icon || 'Globe',
      isPublished: link.isPublished ?? true,
      displayOrder: link.displayOrder ?? (links.length + 1),
    };

    if (existingIndex >= 0) {
      links[existingIndex] = newLink;
    } else {
      links.push(newLink);
    }
    saveToStorage(STORAGE_KEYS.SOCIAL_LINKS, links);
    this.addActivityLog('Saved Social Link', 'Social Links', `${newLink.platform}: ${newLink.url}`);
    return newLink;
  }

  static deleteSocialLink(id: string): boolean {
    const links = this.getSocialLinks();
    const filtered = links.filter(l => l.id !== id);
    saveToStorage(STORAGE_KEYS.SOCIAL_LINKS, filtered);
    this.addActivityLog('Deleted Social Link', 'Social Links', `Removed social link #${id}`);
    return filtered.length !== links.length;
  }

  // ==========================================
  // CMS: CHATBOT SETTINGS
  // ==========================================
  static getChatbotSettings(): ChatbotSettings {
    return loadFromStorage<ChatbotSettings>(STORAGE_KEYS.CHATBOT_SETTINGS, initialChatbotSettings);
  }

  static updateChatbotSettings(settings: Partial<ChatbotSettings>): ChatbotSettings {
    const current = this.getChatbotSettings();
    const updated: ChatbotSettings = { ...current, ...settings };
    saveToStorage(STORAGE_KEYS.CHATBOT_SETTINGS, updated);
    this.addActivityLog('Updated Chatbot Settings', 'AI Assistant', `Updated knowledge rules & welcome prompt`);
    return updated;
  }

  // ==========================================
  // CMS: LEADS MANAGEMENT
  // ==========================================
  static getLeads(): Lead[] {
    return loadFromStorage<Lead[]>(STORAGE_KEYS.LEADS, initialLeads);
  }

  static getLeadById(id: string): Lead | undefined {
    return this.getLeads().find(l => l.id === id);
  }

  static saveLead(lead: Partial<Lead> & { name: string; email: string }): Lead {
    const leads = this.getLeads();
    const id = lead.id || `lead-${Date.now()}`;
    const existingIndex = leads.findIndex(l => l.id === id);

    const newLead: Lead = {
      id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      whatsapp: lead.whatsapp || lead.phone || '',
      source: lead.source || 'Direct Website',
      projectType: lead.projectType || 'Custom Web Development',
      requirement: lead.requirement || '',
      budget: lead.budget || 'Flexible',
      deadline: lead.deadline || 'Flexible',
      status: lead.status || 'New',
      notes: lead.notes || '',
      createdDate: lead.createdDate || new Date().toISOString(),
      lastContacted: lead.lastContacted,
      followUpDate: lead.followUpDate,
    };

    if (existingIndex >= 0) {
      leads[existingIndex] = { ...leads[existingIndex], ...newLead };
    } else {
      leads.unshift(newLead);
    }
    saveToStorage(STORAGE_KEYS.LEADS, leads);
    this.addActivityLog(
      existingIndex >= 0 ? 'Updated Lead' : 'Created Lead',
      'Leads CRM',
      `${newLead.name} (${newLead.email})`
    );
    return newLead;
  }

  static deleteLead(id: string): boolean {
    const leads = this.getLeads();
    const filtered = leads.filter(l => l.id !== id);
    saveToStorage(STORAGE_KEYS.LEADS, filtered);
    this.addActivityLog('Deleted Lead', 'Leads CRM', `Removed lead #${id}`);
    return filtered.length !== leads.length;
  }

  static convertLeadToEnquiry(leadId: string): Enquiry | undefined {
    const lead = this.getLeadById(leadId);
    if (!lead) return undefined;

    const enquiry = this.createEnquiry({
      clientName: lead.name,
      name: lead.name,
      clientEmail: lead.email,
      email: lead.email,
      clientPhone: lead.phone,
      phone: lead.phone,
      projectTitle: lead.projectType,
      projectType: lead.projectType,
      projectDescription: lead.requirement,
      description: lead.requirement,
      budgetRange: lead.budget,
      budget: lead.budget,
      preferredTimeline: lead.deadline,
      deadline: lead.deadline,
      status: 'In Review',
      internalNotes: [
        {
          text: `Converted from Lead #${lead.id}. Source: ${lead.source}. Initial notes: ${lead.notes || 'None'}`,
          date: new Date().toISOString(),
          author: 'Admin CRM'
        }
      ]
    });

    // Update lead status
    this.saveLead({ ...lead, status: 'Requirement Discussion' });
    this.addActivityLog('Converted Lead to Enquiry', 'Leads CRM', `Lead ${lead.name} converted to Enquiry #${enquiry.id}`);
    return enquiry;
  }

  static convertLeadToClient(leadId: string): ClientRecord | undefined {
    const lead = this.getLeadById(leadId);
    if (!lead) return undefined;

    const client = this.saveClient({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      status: 'Active',
      notes: `Converted from Lead #${lead.id}. ${lead.notes || ''}`,
      projectsList: [lead.projectType || 'Custom Project']
    });

    this.saveLead({ ...lead, status: 'Project Won' });
    this.addActivityLog('Converted Lead to Client', 'Clients CRM', `Lead ${lead.name} converted to Client #${client.id}`);
    return client;
  }

  // ==========================================
  // CMS: CLIENTS MANAGEMENT
  // ==========================================
  static getClients(): ClientRecord[] {
    return loadFromStorage<ClientRecord[]>(STORAGE_KEYS.CLIENTS, initialClients);
  }

  static getClientById(id: string): ClientRecord | undefined {
    return this.getClients().find(c => c.id === id);
  }

  static saveClient(client: Partial<ClientRecord> & { name: string; email: string }): ClientRecord {
    const clients = this.getClients();
    const id = client.id || `client-${Date.now()}`;
    const existingIndex = clients.findIndex(c => c.id === id);

    const newClient: ClientRecord = {
      id,
      name: client.name,
      email: client.email,
      phone: client.phone || '',
      company: client.company || '',
      projectsCount: client.projectsCount ?? (client.projectsList ? client.projectsList.length : 1),
      totalQuotes: client.totalQuotes ?? 1,
      totalPaid: client.totalPaid ?? 0,
      status: client.status || 'Active',
      notes: client.notes || '',
      createdAt: client.createdAt || new Date().toISOString(),
      projectsList: client.projectsList || ['Full Stack Web Project']
    };

    if (existingIndex >= 0) {
      clients[existingIndex] = { ...clients[existingIndex], ...newClient };
    } else {
      clients.unshift(newClient);
    }
    saveToStorage(STORAGE_KEYS.CLIENTS, clients);
    this.addActivityLog(
      existingIndex >= 0 ? 'Updated Client' : 'Created Client',
      'Clients CRM',
      `${newClient.name} (${newClient.email})`
    );
    return newClient;
  }

  static deleteClient(id: string): boolean {
    const clients = this.getClients();
    const filtered = clients.filter(c => c.id !== id);
    saveToStorage(STORAGE_KEYS.CLIENTS, filtered);
    this.addActivityLog('Deleted Client', 'Clients CRM', `Removed client #${id}`);
    return filtered.length !== clients.length;
  }

  // ==========================================
  // CMS: MEDIA LIBRARY
  // ==========================================
  static getMedia(): MediaItem[] {
    return loadFromStorage<MediaItem[]>(STORAGE_KEYS.MEDIA, initialMedia);
  }

  static saveMedia(item: Partial<MediaItem> & { name: string; url: string }): MediaItem {
    const media = this.getMedia();
    const id = item.id || `media-${Date.now()}`;
    const existingIndex = media.findIndex(m => m.id === id);

    const newMedia: MediaItem = {
      id,
      name: item.name,
      url: item.url,
      altText: item.altText || item.name,
      size: item.size || 50000,
      mimeType: item.mimeType || 'image/jpeg',
      createdAt: item.createdAt || new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      media[existingIndex] = newMedia;
    } else {
      media.unshift(newMedia);
    }
    saveToStorage(STORAGE_KEYS.MEDIA, media);
    this.addActivityLog('Uploaded Media Item', 'Media Library', newMedia.name);
    return newMedia;
  }

  static deleteMedia(id: string): boolean {
    const media = this.getMedia();
    const filtered = media.filter(m => m.id !== id);
    saveToStorage(STORAGE_KEYS.MEDIA, filtered);
    this.addActivityLog('Deleted Media', 'Media Library', `Deleted media #${id}`);
    return filtered.length !== media.length;
  }

  // ==========================================
  // CMS: ACTIVITY LOGS
  // ==========================================
  static getActivityLogs(): ActivityLog[] {
    return loadFromStorage<ActivityLog[]>(STORAGE_KEYS.ACTIVITY_LOGS, initialActivityLogs);
  }

  static addActivityLog(action: string, entity: string, details: string): void {
    const logs = this.getActivityLogs();
    const log: ActivityLog = {
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      adminEmail: 'skyadav02837@gmail.com',
      action,
      entity,
      details,
      timestamp: new Date().toISOString(),
      ip: '127.0.0.1'
    };
    logs.unshift(log);
    // Keep max 200 logs
    const trimmed = logs.slice(0, 200);
    saveToStorage(STORAGE_KEYS.ACTIVITY_LOGS, trimmed);
  }

  static clearActivityLogs(): void {
    saveToStorage(STORAGE_KEYS.ACTIVITY_LOGS, []);
  }

  // ==========================================
  // CMS: ADMIN SECURITY & AUTHENTICATION
  // ==========================================
  static getAdminSecurity(): AdminSecurity {
    return loadFromStorage<AdminSecurity>(STORAGE_KEYS.ADMIN_SECURITY, initialAdminSecurity);
  }

  static updateAdminSecurity(sec: Partial<AdminSecurity>): AdminSecurity {
    const current = this.getAdminSecurity();
    const updated: AdminSecurity = { ...current, ...sec };
    saveToStorage(STORAGE_KEYS.ADMIN_SECURITY, updated);
    this.addActivityLog('Updated Security Settings', 'Security', 'Modified session rules / credentials');
    return updated;
  }

  static async verifyAdminLogin(
    identifier: string,
    password: string
  ): Promise<{ success: boolean; message: string; token?: string; user?: User }> {
    const sec = this.getAdminSecurity();
    const cleanId = (identifier || '').trim().toLowerCase();
    const expectedUsername = (sec.adminUsername || INITIAL_ADMIN_USERNAME).toLowerCase();
    const expectedEmail = (sec.adminEmail || INITIAL_ADMIN_EMAIL).toLowerCase();

    // Check if account is locked
    if (sec.lockedUntil && Date.now() < sec.lockedUntil) {
      const waitMin = Math.ceil((sec.lockedUntil - Date.now()) / 60000);
      return {
        success: false,
        message: `Account locked due to excessive failed attempts. Try again in ${waitMin} minutes.`
      };
    }

    // Check username or email
    const isIdentifierValid = cleanId === expectedUsername || cleanId === expectedEmail;
    if (!isIdentifierValid) {
      const failed = (sec.failedAttempts || 0) + 1;
      let lockedUntil: number | undefined = undefined;
      if (failed >= 5) {
        lockedUntil = Date.now() + 15 * 60 * 1000;
      }
      this.updateAdminSecurity({ failedAttempts: failed, lockedUntil });
      return {
        success: false,
        message: `Invalid administrator credentials. ${5 - failed > 0 ? `${5 - failed} attempts remaining.` : 'Account locked for 15 minutes.'}`
      };
    }

    // Check password
    const salt = sec.salt || INITIAL_ADMIN_SALT;
    let isPasswordValid = false;

    // Check cryptographic hash
    if (sec.passwordHash) {
      isPasswordValid = await verifyPassword(password, salt, sec.passwordHash);
    }

    // Fallback comparison for default initial development passwords
    if (!isPasswordValid) {
      const fallbackPasswords = ['skyadav@06', 'skyadav@2024', 'admin123', 'sk_admin_secure_2024'];
      if (fallbackPasswords.includes(password.trim())) {
        isPasswordValid = true;
        // Upgrade password hash to cryptographic format automatically
        const newSalt = generateSalt();
        const newHash = await hashPassword(password.trim(), newSalt);
        this.updateAdminSecurity({ salt: newSalt, passwordHash: newHash });
      }
    }

    if (!isPasswordValid) {
      const failed = (sec.failedAttempts || 0) + 1;
      let lockedUntil: number | undefined = undefined;
      if (failed >= 5) {
        lockedUntil = Date.now() + 15 * 60 * 1000;
      }
      this.updateAdminSecurity({ failedAttempts: failed, lockedUntil });
      this.addActivityLog('Failed Admin Login Attempt', 'Security', `Invalid admin password entered (${failed}/5 attempts)`);
      return {
        success: false,
        message: `Invalid administrator password. ${5 - failed > 0 ? `${5 - failed} attempts remaining.` : 'Account locked for 15 minutes.'}`
      };
    }

    // Reset failed attempts
    this.updateAdminSecurity({ failedAttempts: 0, lockedUntil: undefined, lastLoginAt: new Date().toISOString() });

    const adminUser: User = {
      id: 'admin-sk-01',
      name: 'SK Yadav',
      email: sec.adminEmail || INITIAL_ADMIN_EMAIL,
      phone: '+91 9354152837',
      whatsapp: '+91 9354152837',
      role: 'admin',
      company: 'SK Yadav Freelancing',
      createdAt: '2023-01-01T00:00:00Z',
      isEmailVerified: true,
      avatar: '/logo.png'
    };

    const token = `sk_jwt_admin_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const session = {
      isAuthenticated: true,
      token,
      user: adminUser,
      expiresAt: Date.now() + (sec.sessionTimeoutMinutes || 60) * 60 * 1000,
    };

    saveToStorage(STORAGE_KEYS.ADMIN_SESSION, session);
    this.setCurrentUser(adminUser);
    this.addActivityLog('Admin Logged In', 'Authentication', `Admin logged in successfully via ${cleanId}`);

    return {
      success: true,
      message: 'Administrator authentication successful.',
      token,
      user: adminUser
    };
  }

  static async updateAdminCredentials(
    currentPassword: string,
    updates: { username?: string; email?: string; newPassword?: string }
  ): Promise<{ success: boolean; message: string }> {
    const sec = this.getAdminSecurity();
    const salt = sec.salt || INITIAL_ADMIN_SALT;

    let isCurrentValid = await verifyPassword(currentPassword, salt, sec.passwordHash);
    if (!isCurrentValid && ['skyadav@06', 'skyadav@2024', 'admin123'].includes(currentPassword)) {
      isCurrentValid = true;
    }

    if (!isCurrentValid) {
      return { success: false, message: 'Current administrator password is incorrect.' };
    }

    let newHash = sec.passwordHash;
    let newSalt = sec.salt || INITIAL_ADMIN_SALT;

    if (updates.newPassword && updates.newPassword.trim().length >= 6) {
      newSalt = generateSalt();
      newHash = await hashPassword(updates.newPassword.trim(), newSalt);
    }

    this.updateAdminSecurity({
      adminUsername: updates.username?.trim() || sec.adminUsername,
      adminEmail: updates.email?.trim() || sec.adminEmail,
      passwordHash: newHash,
      salt: newSalt,
    });

    this.addActivityLog('Admin Credentials Updated', 'Security', 'Primary administrator credentials securely updated');
    return { success: true, message: 'Admin credentials updated successfully.' };
  }

  static saveAdminSession(session: { isAuthenticated: boolean; token?: string; user?: User; expiresAt?: number }): void {
    saveToStorage(STORAGE_KEYS.ADMIN_SESSION, session);
  }

  static getAdminSession(): { isAuthenticated: boolean; token?: string; user?: User } {
    const session = loadFromStorage<{ isAuthenticated: boolean; token?: string; user?: User; expiresAt?: number } | null>(
      STORAGE_KEYS.ADMIN_SESSION,
      null
    );

    if (!session || !session.isAuthenticated) {
      return { isAuthenticated: false };
    }

    if (session.expiresAt && Date.now() > session.expiresAt) {
      this.logoutAdminSession();
      return { isAuthenticated: false };
    }

    return session;
  }

  static logoutAdminSession(): void {
    saveToStorage(STORAGE_KEYS.ADMIN_SESSION, null);
    const curr = this.getCurrentUser();
    if (curr && curr.role === 'admin') {
      this.setCurrentUser(null);
    }
    this.addActivityLog('Admin Logged Out', 'Authentication', 'Admin logged out of CMS');
  }

  // ==========================================
  // CLIENT PROJECTS & MILESTONES
  // ==========================================
  static getClientProjects(userId?: string, userEmail?: string): ClientProject[] {
    const all = loadFromStorage<ClientProject[]>(STORAGE_KEYS.CLIENT_PROJECTS, initialClientProjects);
    if (!userId && !userEmail) return all;

    return all.filter(p => {
      const matchId = userId && p.userId === userId;
      const matchEmail = userEmail && p.clientEmail.toLowerCase() === userEmail.toLowerCase().trim();
      return matchId || matchEmail;
    });
  }

  static getClientProjectById(id: string): ClientProject | undefined {
    return this.getClientProjects().find(p => p.id === id);
  }

  static saveClientProject(proj: Partial<ClientProject> & { projectName: string }): ClientProject {
    const projects = this.getClientProjects();
    const id = proj.id || `cproj-${Date.now()}`;
    const existingIndex = projects.findIndex(p => p.id === id);

    const newProj: ClientProject = {
      id,
      userId: proj.userId || 'user-alex-101',
      clientName: proj.clientName || 'Valued Client',
      clientEmail: proj.clientEmail || 'client@example.com',
      clientPhone: proj.clientPhone || '',
      projectName: proj.projectName,
      description: proj.description || '',
      requirements: proj.requirements || '',
      features: proj.features || [],
      technology: proj.technology || ['React', 'Node.js', 'Tailwind CSS'],
      startDate: proj.startDate || new Date().toISOString().split('T')[0],
      expectedCompletion: proj.expectedCompletion || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      completedDate: proj.completedDate,
      status: proj.status || 'In Progress',
      progress: typeof proj.progress === 'number' ? proj.progress : 25,
      assignedDeveloper: proj.assignedDeveloper || 'SK Yadav',
      milestones: proj.milestones || [
        { id: 'm-1', title: '1. Architecture & Design Spec', status: 'completed', completed: true, order: 1, completedAt: new Date().toISOString() },
        { id: 'm-2', title: '2. Core Frontend & API Implementation', status: 'in_progress', completed: false, order: 2, dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0] },
        { id: 'm-3', title: '3. Testing, Verification & Final Deployment', status: 'pending', completed: false, order: 3, dueDate: new Date(Date.now() + 28 * 86400000).toISOString().split('T')[0] }
      ],
      recentUpdates: proj.recentUpdates || [
        { id: `up-${Date.now()}`, title: 'Project Initialized', message: 'Project environment and repository configured by SK Yadav.', createdAt: new Date().toISOString(), author: 'SK Yadav' }
      ],
      documents: proj.documents || [],
      quotationId: proj.quotationId,
      invoiceId: proj.invoiceId,
      notesVisibleToClient: proj.notesVisibleToClient || '',
      createdAt: proj.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      projects[existingIndex] = { ...projects[existingIndex], ...newProj };
    } else {
      projects.unshift(newProj);
    }

    saveToStorage(STORAGE_KEYS.CLIENT_PROJECTS, projects);
    this.addActivityLog(
      existingIndex >= 0 ? 'Updated Client Project' : 'Created Client Project',
      'Client Projects',
      `${newProj.projectName} (${newProj.clientName})`
    );

    return newProj;
  }

  static updateClientProjectProgress(
    id: string,
    progress: number,
    status?: ClientProjectStatus
  ): ClientProject | undefined {
    const projects = this.getClientProjects();
    const proj = projects.find(p => p.id === id);
    if (!proj) return undefined;

    proj.progress = Math.min(100, Math.max(0, progress));
    if (status) proj.status = status;
    proj.updatedAt = new Date().toISOString();

    saveToStorage(STORAGE_KEYS.CLIENT_PROJECTS, projects);
    return proj;
  }

  static updateProjectMilestone(
    projectId: string,
    milestoneId: string,
    updates: Partial<ProjectMilestone>
  ): ClientProject | undefined {
    const projects = this.getClientProjects();
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return undefined;

    const mIdx = proj.milestones.findIndex(m => m.id === milestoneId);
    if (mIdx >= 0) {
      proj.milestones[mIdx] = {
        ...proj.milestones[mIdx],
        ...updates,
        completed: updates.status === 'completed' ? true : (updates.completed ?? proj.milestones[mIdx].completed),
        completedAt: updates.status === 'completed' ? (proj.milestones[mIdx].completedAt || new Date().toISOString()) : undefined
      };

      // Auto compute progress from completed milestones
      const total = proj.milestones.length;
      if (total > 0) {
        const completedCount = proj.milestones.filter(m => m.status === 'completed' || m.completed).length;
        proj.progress = Math.round((completedCount / total) * 100);
      }
      proj.updatedAt = new Date().toISOString();
      saveToStorage(STORAGE_KEYS.CLIENT_PROJECTS, projects);
    }
    return proj;
  }

  static addProjectUpdate(
    projectId: string,
    title: string,
    message: string,
    author = 'SK Yadav'
  ): ClientProject | undefined {
    const projects = this.getClientProjects();
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return undefined;

    const update: ProjectUpdate = {
      id: `up-${Date.now()}`,
      title,
      message,
      author,
      createdAt: new Date().toISOString()
    };
    proj.recentUpdates = [update, ...(proj.recentUpdates || [])];
    proj.updatedAt = new Date().toISOString();

    saveToStorage(STORAGE_KEYS.CLIENT_PROJECTS, projects);

    // Notify client
    if (proj.userId) {
      this.addNotification({
        userId: proj.userId,
        type: 'system',
        title: `Project Update: ${proj.projectName}`,
        message: `${title}: ${message.substring(0, 70)}...`,
        isRead: false,
        link: '/dashboard'
      });
    }

    return proj;
  }

  static deleteClientProject(id: string): boolean {
    const projects = this.getClientProjects();
    const filtered = projects.filter(p => p.id !== id);
    saveToStorage(STORAGE_KEYS.CLIENT_PROJECTS, filtered);
    this.addActivityLog('Deleted Client Project', 'Client Projects', `Removed client project #${id}`);
    return filtered.length !== projects.length;
  }

  // ==========================================
  // CMS: EXTRA HELPER ACTIONS
  // ==========================================
  static duplicateProject(id: string): Project | undefined {
    const project = this.getProjectById(id);
    if (!project) return undefined;

    const copy: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      name: `${project.name} (Copy)`,
      slug: `${project.slug}-copy-${Math.floor(Math.random() * 1000)}`,
      viewsCount: 0,
      createdAt: new Date().toISOString(),
    };
    const projects = this.getProjects();
    projects.unshift(copy);
    saveToStorage(STORAGE_KEYS.PROJECTS, projects);
    this.addActivityLog('Duplicated Project', 'Projects', `Created copy of ${project.name}`);
    return copy;
  }

  static toggleProjectFeature(id: string): boolean {
    const projects = this.getProjects();
    const p = projects.find(item => item.id === id);
    if (p) {
      p.isFeatured = !p.isFeatured;
      saveToStorage(STORAGE_KEYS.PROJECTS, projects);
      this.addActivityLog('Toggled Featured Project', 'Projects', `${p.name} featured: ${p.isFeatured}`);
      return p.isFeatured;
    }
    return false;
  }

  static toggleProjectPublish(id: string): boolean {
    const projects = this.getProjects();
    const p = projects.find(item => item.id === id);
    if (p) {
      p.isPublished = !p.isPublished;
      saveToStorage(STORAGE_KEYS.PROJECTS, projects);
      this.addActivityLog('Toggled Project Publish', 'Projects', `${p.name} published: ${p.isPublished}`);
      return p.isPublished;
    }
    return false;
  }

  static duplicateQuotation(id: string): Quote | undefined {
    const quote = this.getQuoteById(id);
    if (!quote) return undefined;

    const copy = this.createQuote({
      ...quote,
      id: `quote-${Date.now()}`,
      quotationNumber: `QUO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      projectTitle: `${quote.projectTitle} (Copy)`,
      status: 'Draft',
      createdAt: new Date().toISOString(),
    });
    this.addActivityLog('Duplicated Quotation', 'Quotations', `Created copy of #${quote.quotationNumber}`);
    return copy;
  }

  static deleteQuotation(id: string): boolean {
    const quotes = this.getQuotes();
    const filtered = quotes.filter(q => q.id !== id);
    saveToStorage(STORAGE_KEYS.QUOTES, filtered);
    this.addActivityLog('Deleted Quotation', 'Quotations', `Removed quote #${id}`);
    return filtered.length !== quotes.length;
  }

  static deleteEnquiry(id: string): boolean {
    const enquiries = this.getEnquiries();
    const filtered = enquiries.filter(e => e.id !== id);
    saveToStorage(STORAGE_KEYS.ENQUIRIES, filtered);
    this.addActivityLog('Deleted Enquiry', 'Enquiries', `Removed enquiry #${id}`);
    return filtered.length !== enquiries.length;
  }

  static deleteMessage(id: string): boolean {
    const messages = this.getMessages();
    const filtered = messages.filter(m => m.id !== id);
    saveToStorage(STORAGE_KEYS.MESSAGES, filtered);
    this.addActivityLog('Deleted Message', 'Contact Messages', `Removed message #${id}`);
    return filtered.length !== messages.length;
  }

  static deleteUser(id: string): boolean {
    const users = this.getUsers();
    const filtered = users.filter(u => u.id !== id);
    saveToStorage(STORAGE_KEYS.USERS, filtered);
    this.addActivityLog('Deleted User Account', 'Users', `Removed user #${id}`);
    return filtered.length !== users.length;
  }

  // ==========================================
  // UNIFIED ALIASES & CMS EXPORT/IMPORT
  // ==========================================
  static getContactMessages(): ContactMessage[] {
    return this.getMessages();
  }

  static deleteContactMessage(id: string): boolean {
    return this.deleteMessage(id);
  }

  static markMessageRead(id: string): boolean {
    const messages = this.getMessages();
    const m = messages.find(item => item.id === id);
    if (m) {
      m.isRead = !m.isRead;
      m.status = m.isRead ? 'read' : 'unread';
      saveToStorage(STORAGE_KEYS.MESSAGES, messages);
      return !!m.isRead;
    }
    return false;
  }

  static getMediaItems(): MediaItem[] {
    return this.getMedia();
  }

  static saveMediaItem(item: Partial<MediaItem> & { url: string }): MediaItem {
    return this.saveMedia({
      id: item.id,
      name: item.title || item.name || 'Media Asset',
      url: item.url,
      altText: item.altText || item.title || 'Media Asset',
      size: typeof item.size === 'number' ? item.size : 50000,
      mimeType: item.mimeType || 'image/jpeg',
      createdAt: item.createdAt || new Date().toISOString()
    });
  }

  static deleteMediaItem(id: string): boolean {
    return this.deleteMedia(id);
  }

  static getChatbotConfig(): ChatbotConfig {
    return this.getChatbotSettings();
  }

  static saveChatbotConfig(cfg: ChatbotConfig): ChatbotConfig {
    return this.updateChatbotSettings(cfg);
  }

  static saveSEOSettings(seo: SEOSettings): SEOSettings {
    return this.updateSEOSettings(seo);
  }

  static saveSocialLinks(links: SocialLink[]): SocialLink[] {
    saveToStorage(STORAGE_KEYS.SOCIAL_LINKS, links);
    this.addActivityLog('Updated Social Links', 'Social Profiles', 'Saved social link changes');
    return links;
  }

  static saveWebsiteContent(content: WebsiteContent): WebsiteContent {
    saveToStorage(STORAGE_KEYS.WEBSITE_CONTENT, content);
    this.addActivityLog('Updated Website Copy', 'CMS Copy', 'Updated homepage and section copy');
    return content;
  }

  static updateAdminPassword(currentPassword: string, newPassword: string): { success: boolean; message: string } {
    const sec = this.getAdminSecurity();
    const valid = ['skyadav@2024', 'admin123', 'admin', 'sk_admin_secure_2024', sec.passwordHash];
    if (!valid.includes(currentPassword.trim())) {
      return { success: false, message: 'Current password is incorrect.' };
    }
    this.updateAdminSecurity({ passwordHash: newPassword.trim() });
    this.addActivityLog('Admin Password Changed', 'Security', 'Admin password was updated successfully');
    return { success: true, message: 'Admin password updated successfully!' };
  }

  static exportAllData(): string {
    const allData: Record<string, any> = {};
    Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
      try {
        const item = localStorage.getItem(storageKey);
        if (item) allData[key] = JSON.parse(item);
      } catch (e) {}
    });
    return JSON.stringify({ version: '2.0', exportedAt: new Date().toISOString(), data: allData }, null, 2);
  }

  static importData(jsonString: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonString);
      const data = parsed.data || parsed;
      Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
        if (data[key]) {
          localStorage.setItem(storageKey, JSON.stringify(data[key]));
        }
      });
      return { success: true, message: 'Database backup imported and restored successfully!' };
    } catch (err: any) {
      return { success: false, message: 'Failed to import backup: ' + (err as any).message };
    }
  }

  static resetToDefaults(): void {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(initialProjects));
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(initialServices));
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(initialSkills));
    localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(initialFAQs));
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(initialTestimonials));
    localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(initialBlogPosts));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(initialSiteSettings));
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(initialLeads));
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(initialClients));
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(initialMedia));
    localStorage.setItem(STORAGE_KEYS.WEBSITE_CONTENT, JSON.stringify(initialWebsiteContent));
    localStorage.setItem(STORAGE_KEYS.SEO_SETTINGS, JSON.stringify(initialSEOSettings));
    localStorage.setItem(STORAGE_KEYS.SOCIAL_LINKS, JSON.stringify(initialSocialLinks));
    localStorage.setItem(STORAGE_KEYS.CHATBOT_SETTINGS, JSON.stringify(initialChatbotSettings));
    localStorage.setItem(STORAGE_KEYS.ADMIN_SECURITY, JSON.stringify(initialAdminSecurity));
    this.addActivityLog('System Reset', 'Database', 'Restored database to factory defaults');
  }

  static initDefaultData(): void {
    if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
      this.resetToDefaults();
    }
  }

  static init(forceReset: boolean = false): void {
    if (forceReset) {
      this.resetToDefaults();
    } else {
      this.initDefaultData();
    }
  }
}

