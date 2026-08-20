import {
  Project,
  Service,
  Skill,
  SiteSettings,
  FAQ,
  BlogPost,
  Testimonial,
  Lead,
  ClientRecord,
  MediaItem,
  ActivityLog,
  WebsiteContent,
  SEOSettings,
  SocialLink,
  ChatbotSettings,
  AdminSecurity,
  ClientProject
} from '../types';
import { INITIAL_ADMIN_HASH, INITIAL_ADMIN_SALT, INITIAL_ADMIN_USERNAME, INITIAL_ADMIN_EMAIL } from '../utils/crypto';

export const initialClientProjects: ClientProject[] = [
  {
    id: 'cproj-101',
    userId: 'user-alex-101',
    clientName: 'Alex Rivera',
    clientEmail: 'alex.rivera@techventure.io',
    clientPhone: '+1 555-019-2834',
    projectName: 'E-commerce Website & Analytics Platform',
    description: 'Custom full-stack multi-vendor e-commerce platform with automated inventory synchronization, Stripe payment gateway, and administrative analytics dashboard.',
    requirements: 'Modern React SPA, high-throughput Node.js microservices, PostgreSQL data layer, itemized cart checkout, invoice generation, real-time inventory tracking.',
    features: [
      'Multi-vendor product showcase & faceted filtering',
      'Stripe & PayPal integrated secure checkout',
      'Role-based permissions for store managers',
      'Automated email notifications on order fulfillment',
      'Custom SEO optimization & Google Search Console indexing'
    ],
    technology: ['React 19', 'TypeScript', 'Node.js', 'Express', 'Tailwind CSS', 'PostgreSQL', 'Stripe API'],
    startDate: '2026-08-10',
    expectedCompletion: '2026-09-30',
    status: 'In Progress',
    progress: 65,
    assignedDeveloper: 'SK Yadav',
    milestones: [
      { id: 'm-1', title: '1. Requirement Gathering & Architecture Spec', status: 'completed', completed: true, order: 1, completedAt: '2026-08-12' },
      { id: 'm-2', title: '2. UI/UX Design System & Interactive Prototypes', status: 'completed', completed: true, order: 2, completedAt: '2026-08-18' },
      { id: 'm-3', title: '3. Frontend Development & State Management', status: 'completed', completed: true, order: 3, completedAt: '2026-08-26' },
      { id: 'm-4', title: '4. Backend REST API & Database Integration', status: 'in_progress', completed: false, order: 4, dueDate: '2026-09-08' },
      { id: 'm-5', title: '5. End-to-End QA Testing & Security Auditing', status: 'pending', completed: false, order: 5, dueDate: '2026-09-20' },
      { id: 'm-6', title: '6. Production Cloud Deployment & DNS Setup', status: 'pending', completed: false, order: 6, dueDate: '2026-09-30' }
    ],
    recentUpdates: [
      { id: 'up-1', title: 'Frontend Prototype Approved', message: 'Figma to React conversion is complete with full responsive verification.', createdAt: '2026-08-18T14:30:00Z', author: 'SK Yadav' },
      { id: 'up-2', title: 'Database Schema Finalized', message: 'User, Product, and Transaction entities mapped out with strict validation.', createdAt: '2026-08-20T09:15:00Z', author: 'SK Yadav' }
    ],
    documents: [
      { id: 'doc-1', name: 'Software_Requirements_Specification_v1.2.pdf', url: '#', size: '1.8 MB', date: '2026-08-11' },
      { id: 'doc-2', name: 'UI_Design_System_Wireframes.pdf', url: '#', size: '4.2 MB', date: '2026-08-17' }
    ],
    quotationId: 'quote-101',
    notesVisibleToClient: 'Sprint 2 is currently focused on finishing the payment webhooks and order management flows. Please review the updated preview link when ready.',
    createdAt: '2026-08-10T10:00:00Z',
    updatedAt: '2026-08-20T10:00:00Z'
  }
];

export const initialSiteSettings: SiteSettings = {
  profileName: 'SK Yadav',
  professionalTitle: 'Full Stack Web Developer & Freelance Specialist',
  shortBio: 'Building modern, responsive and scalable websites and web applications for businesses, startups and individuals.',
  fullBio: 'Passionate Full Stack Web Developer with deep expertise in modern JavaScript ecosystems (React, Node.js, Express, MongoDB) and classic robust web stacks (PHP, MySQL, WordPress, WooCommerce). Dedicated to delivering high-performance, SEO-friendly, and secure digital platforms that convert visitors into loyal clients.',
  email: 'skyadav02837@gmail.com',
  phone: '+91 9354152837',
  whatsappNumber: '919354152837',
  githubUrl: 'https://github.com',
  linkedinUrl: 'https://linkedin.com',
  instagramUrl: 'https://instagram.com',
  twitterUrl: 'https://x.com',
  availabilityStatus: 'Available',
  availabilityMessage: 'Available for freelance projects, custom web apps & business websites.',
  experienceYears: 4,
  completedProjectsCount: 38,
  satisfiedClientsCount: 32,
  hourlyRate: '$25 - $45/hr',
  seoTitle: 'SK Yadav — Full Stack Web Developer & Freelance Web Specialist',
  seoDescription: 'Building modern, responsive and scalable websites and web applications for businesses, startups and individuals. MERN Stack, PHP/MySQL, E-Commerce, and WordPress development.',
  logoText: 'SK YADAV',
};

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'VicharManch',
    slug: 'vicharmanch',
    category: 'Full Stack',
    shortDescription: 'Modern community discourse & thought-sharing platform with high-security posture, rich discussions, and real-time interactive design.',
    description: 'VicharManch is an engaging community thought-sharing platform engineered to foster intellectual discourse, exchange ideas, and host moderated discussions with high reliability and secure authentication.',
    clientName: 'SecOpsHub / Community Project',
    role: 'Lead Full Stack Web Developer',
    technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'REST API', 'JWT Authentication', 'Responsive Design'],
    features: [
      'Interactive topic categories & threaded community discussions',
      'Secure user authentication with JWT & encrypted session management',
      'Content moderation & spam mitigation tools for community safety',
      'Real-time view counters, bookmarking, and upvoting interactions',
      'Fully responsive UI optimized for mobile, tablet, and ultra-wide screens'
    ],
    challenges: 'Designing a smooth, low-latency discussion feed that handles nested comment threads while maintaining strict input sanitization and security protocols.',
    solution: 'Engineered an optimized REST API with indexed MongoDB queries, efficient React state management, and strict server-side validation to ensure instantaneous rendering.',
    results: 'Delivered an intuitive, lightning-fast platform adopted by active community members with sub-100ms API response times and zero recorded security vulnerabilities.',
    projectDuration: '6 Weeks',
    completionDate: '2024',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
    ],
    liveUrl: 'https://vicharmanch.secopshub.in/',
    githubUrl: 'https://github.com',
    isFeatured: true,
    isPublished: true,
    viewsCount: 1420,
    createdAt: '2024-03-15T10:00:00Z',
  },
  {
    id: 'proj-2',
    name: 'Sunrise Welfare Solution',
    slug: 'sunrise-welfare-solution',
    category: 'Business Website',
    shortDescription: 'Luxury custom wallpaper, bespoke architectural murals, and interior decor showcase platform with custom quotation and gallery features.',
    description: 'Sunrise Welfare Solution is a high-end digital showroom for luxury custom wallpapers, bespoke wall murals, and premium interior decor solutions. Built to give homeowners and interior designers an immersive visual catalog.',
    clientName: 'Sunrise Welfare Solution',
    role: 'Full Stack Web Developer & UI Architect',
    technologies: ['React', 'Tailwind CSS', 'Node.js', 'REST API', 'Responsive UI', 'SEO Optimization'],
    features: [
      'Interactive visual wallpaper & mural catalog with high-resolution zoom',
      'Custom wall dimension calculator and instant quotation request flow',
      'Category filtering by style (Botanical, Geometric, Minimalist, Luxury Textured)',
      'WhatsApp-integrated direct enquiry trigger with selected catalog item',
      'SEO-friendly structure for localized interior decor search visibility'
    ],
    challenges: 'Balancing ultra-high-resolution image rendering for intricate wallpaper textures without sacrificing fast page loads on mobile networks.',
    solution: 'Implemented modern responsive image pipelines, lazy loading, and lightweight UI components with Tailwind CSS for instantaneous browsing.',
    results: 'Accelerated client inquiries by 65% through the integrated WhatsApp quotation flow and received stellar feedback from interior architects.',
    projectDuration: '4 Weeks',
    completionDate: '2024',
    thumbnail: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    liveUrl: 'https://sunrise-welfare-solution.ai.studio/',
    githubUrl: 'https://github.com',
    isFeatured: true,
    isPublished: true,
    viewsCount: 980,
    createdAt: '2024-05-20T11:30:00Z',
  },
  {
    id: 'proj-3',
    name: 'Disha Computer Institute',
    slug: 'disha-computer-institute',
    category: 'Web Development',
    shortDescription: 'Comprehensive computer education platform & institute management portal featuring course discovery, syllabus access, and admission workflows.',
    description: 'Disha Computer Institute is a dedicated education portal built for students and faculty. It features course catalog exploration (Programming, Web Design, Office Automation, Accounting), online admission enquiry, and admin notices.',
    clientName: 'Disha Computer Institute',
    role: 'Full Stack Web Developer',
    technologies: ['PHP', 'MySQL', 'Bootstrap', 'JavaScript', 'HTML5', 'CSS3', 'XAMPP', 'REST API'],
    features: [
      'Dynamic course listing with detailed syllabus download and fee breakdowns',
      'Online student admission inquiry and registration submission system',
      'Faculty noticeboard, announcements, and exam schedule bulletin',
      'Custom admin panel for managing courses, student inquiries, and test dates',
      'Mobile-responsive layout optimized for students accessing on smartphones'
    ],
    challenges: 'Transitioning the institute from physical paper application forms to an intuitive web inquiry workflow with zero administrative downtime.',
    solution: 'Architected a lightweight PHP/MySQL backend on XAMPP stack with structured relational tables and an intuitive Bootstrap dashboard.',
    results: 'Streamlined admission inquiries by 80% and reduced administrative overhead for institute staff.',
    projectDuration: '5 Weeks',
    completionDate: '2023',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80'
    ],
    liveUrl: 'https://dishacomputer.example.org/',
    githubUrl: 'https://github.com',
    isFeatured: true,
    isPublished: true,
    viewsCount: 1150,
    createdAt: '2023-11-10T08:00:00Z',
  },
  {
    id: 'proj-4',
    name: 'Online Food Ordering System',
    slug: 'online-food-ordering-system',
    category: 'E-commerce',
    shortDescription: 'Multi-restaurant online food ordering and delivery management system with real-time cart, restaurant menu, and administrative dashboards.',
    description: 'A robust web-based food ordering platform designed for customers to browse restaurants, explore categorized food menus, customize orders, and checkout with automated invoice generation.',
    clientName: 'Food Delivery Enterprise',
    role: 'Full Stack Backend & Frontend Developer',
    technologies: ['PHP', 'MySQL', 'Bootstrap', 'JavaScript', 'HTML5', 'CSS3', 'XAMPP', 'JWT Authentication'],
    features: [
      'Customer account registration, login authentication, and profile history',
      'Dynamic food catalog with vegetarian/non-vegetarian filter and price sorting',
      'Interactive shopping cart with item quantity adjustments and coupon codes',
      'Order placement flow with delivery address management and status tracking',
      'Admin portal for managing menus, restaurant categories, and live orders'
    ],
    challenges: 'Handling concurrent cart updates and maintaining atomic order transactions in MySQL without race conditions.',
    solution: 'Designed robust normalized MySQL schema with foreign keys, transactional queries, and sanitized PHP session handlers.',
    results: 'Delivered an enterprise-grade full-stack ordering engine capable of managing hundreds of simultaneous food orders seamlessly.',
    projectDuration: '7 Weeks',
    completionDate: '2023',
    thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'
    ],
    liveUrl: 'https://foodorder-demo.example.com',
    githubUrl: 'https://github.com',
    isFeatured: true,
    isPublished: true,
    viewsCount: 1650,
    createdAt: '2023-08-14T09:15:00Z',
  },
];

export const initialServices: Service[] = [
  {
    id: 'serv-1',
    title: 'Website Development',
    slug: 'website-development',
    icon: 'Globe',
    shortDescription: 'Custom, blazing-fast responsive websites crafted with clean semantic code.',
    description: 'Transform your brand vision into a high-converting web presence with bespoke design, seamless responsiveness across all screen sizes, and modern standards.',
    features: ['Custom UI/UX Design', 'Fully Responsive on Mobile/Tablet', 'Cross-browser Compatibility', 'Clean & Structured Code', 'Lightning Fast Load Speed'],
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Tailwind CSS', 'React'],
    startingPrice: '$199',
    deliveryDays: '3-7 Days',
    isPopular: true,
  },
  {
    id: 'serv-2',
    title: 'Full Stack Web Development',
    slug: 'full-stack-development',
    icon: 'Layers',
    shortDescription: 'End-to-end dynamic web applications with secure backend APIs and scalable databases.',
    description: 'Complete architecture from intuitive frontend interfaces to robust server logic, authentication workflows, REST APIs, and high-performance database design.',
    features: ['REST API Development', 'Database Design & Schema Migration', 'Authentication & Role-Based Access', 'Interactive Client Dashboards', 'Server-side Optimization'],
    technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'MySQL'],
    startingPrice: '$499',
    deliveryDays: '7-14 Days',
    isPopular: true,
  },
  {
    id: 'serv-3',
    title: 'Business Websites',
    slug: 'business-websites',
    icon: 'Briefcase',
    shortDescription: 'Professional corporate and agency websites designed to generate qualified leads.',
    description: 'Give your business an authoritative digital footprint. Includes interactive inquiry funnels, WhatsApp/Call integration, service showcases, and Google Search optimization.',
    features: ['Lead Generation Funnels', 'WhatsApp & Email Inquiries', 'Interactive Portfolio & Case Studies', 'Contact & Booking Systems', 'Local SEO & Google Maps Ready'],
    technologies: ['React', 'Tailwind CSS', 'Bootstrap', 'JavaScript', 'SEO'],
    startingPrice: '$299',
    deliveryDays: '5-10 Days',
    isPopular: false,
  },
  {
    id: 'serv-4',
    title: 'E-commerce Development',
    slug: 'ecommerce-development',
    icon: 'ShoppingCart',
    shortDescription: 'Feature-packed online stores with product catalogs, carts, and payment checkouts.',
    description: 'Launch your online shop with intuitive product navigation, inventory management, secure checkout, coupon systems, and order tracking dashboards.',
    features: ['Product Catalog & Filtering', 'Shopping Cart & Wishlist', 'Secure Payment Gateway Ready', 'Order Management Dashboard', 'Customer Account Center'],
    technologies: ['MERN Stack', 'WooCommerce', 'PHP/MySQL', 'Stripe/Razorpay Integration'],
    startingPrice: '$599',
    deliveryDays: '10-20 Days',
    isPopular: true,
  },
  {
    id: 'serv-5',
    title: 'Custom Web Applications',
    slug: 'custom-web-applications',
    icon: 'Code',
    shortDescription: 'Tailored SaaS portals, portals, CRM tools, and business management systems.',
    description: 'Solving complex operational problems with customized web tools. We architect workflow automation, internal portals, quotation calculators, and multi-user platforms.',
    features: ['Custom Business Logic', 'Data Exporting & Analytics', 'Automated Workflows', 'Role-Based Permissions', 'Scalable Cloud Architecture'],
    technologies: ['Node.js', 'React', 'MongoDB', 'MySQL', 'Express.js'],
    startingPrice: '$699',
    deliveryDays: '14-30 Days',
    isPopular: false,
  },
  {
    id: 'serv-6',
    title: 'PHP & MySQL Development',
    slug: 'php-mysql-development',
    icon: 'Database',
    shortDescription: 'Rock-solid relational database web systems and dynamic PHP backends.',
    description: 'Leverage the battle-tested PHP & MySQL ecosystem for fast, reliable, server-rendered applications, student portals, booking systems, and CRUD platforms.',
    features: ['Normalized Database Architecture', 'Secure Prepared Statements', 'Session & Authentication Handling', 'Admin Management Panels', 'XAMPP / Apache Deployment'],
    technologies: ['PHP', 'MySQL', 'XAMPP', 'Bootstrap', 'JavaScript'],
    startingPrice: '$299',
    deliveryDays: '5-12 Days',
    isPopular: false,
  },
  {
    id: 'serv-7',
    title: 'MERN Stack Development',
    slug: 'mern-stack-development',
    icon: 'Cpu',
    shortDescription: 'Modern reactive single-page apps and API-driven microservices.',
    description: 'Harness the full power of MongoDB, Express.js, React, and Node.js for real-time reactivity, JSON-first architectures, and ultra-fluid user experiences.',
    features: ['Single Page Application (SPA)', 'NoSQL Flexible Data Models', 'JWT Tokenized Security', 'Reusable Component Hierarchy', 'High Performance Execution'],
    technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Tailwind CSS'],
    startingPrice: '$549',
    deliveryDays: '10-18 Days',
    isPopular: true,
  },
  {
    id: 'serv-8',
    title: 'WordPress & WooCommerce',
    slug: 'wordpress-woocommerce',
    icon: 'Monitor',
    shortDescription: 'Custom themes, plugin integrations, and easy-to-manage content platforms.',
    description: 'Get an empowering WordPress website that non-technical team members can easily edit, complete with custom theme styling, WooCommerce store setup, and speed optimizations.',
    features: ['Custom Theme Implementation', 'WooCommerce Store Setup', 'Essential Plugin Configurations', 'Speed & Security Hardening', 'Content Management Training'],
    technologies: ['WordPress', 'WooCommerce', 'PHP', 'CSS3', 'MySQL'],
    startingPrice: '$249',
    deliveryDays: '4-8 Days',
    isPopular: false,
  },
  {
    id: 'serv-9',
    title: 'Website Maintenance & Support',
    slug: 'website-maintenance',
    icon: 'ShieldCheck',
    shortDescription: 'Ongoing security monitoring, content updates, backups, and performance tweaks.',
    description: 'Keep your web application running smoothly, updated, secure against vulnerabilities, and continuously optimized for search engines and user traffic.',
    features: ['Regular Security Audits', 'Database & Asset Backups', 'Framework & Plugin Updates', 'Performance & Speed Audits', 'Priority Support Channels'],
    technologies: ['Git', 'Server Monitoring', 'Database Optimization', 'Security Patching'],
    startingPrice: '$99/mo',
    deliveryDays: 'Ongoing',
    isPopular: false,
  },
  {
    id: 'serv-10',
    title: 'Bug Fixing & Speed Optimization',
    slug: 'bug-fixing',
    icon: 'Wrench',
    shortDescription: 'Rapid troubleshooting of JavaScript, PHP, CSS layout, or database errors.',
    description: 'Got a broken layout, malfunctioning form, slow loading page, or database connection error? Fast diagnosis and permanent fixes with clean code standards.',
    features: ['Broken UI & Responsive Fixes', 'API & Database Query Debugging', 'Core Web Vitals Optimization', 'Console Error Elimination', 'Cross-Browser Glitch Fixes'],
    technologies: ['JavaScript', 'PHP', 'CSS3', 'MySQL', 'Developer Tools'],
    startingPrice: '$79',
    deliveryDays: '1-2 Days',
    isPopular: false,
  },
];

export const initialSkills: Skill[] = [
  // Frontend
  { id: 'sk-1', name: 'React', category: 'Frontend', proficiency: 92 },
  { id: 'sk-2', name: 'JavaScript (ES6+)', category: 'Frontend', proficiency: 94 },
  { id: 'sk-3', name: 'Tailwind CSS', category: 'Frontend', proficiency: 96 },
  { id: 'sk-4', name: 'HTML5 & Semantic Web', category: 'Frontend', proficiency: 98 },
  { id: 'sk-5', name: 'CSS3 & Modern Layouts', category: 'Frontend', proficiency: 95 },
  { id: 'sk-6', name: 'Bootstrap 5', category: 'Frontend', proficiency: 90 },

  // Backend
  { id: 'sk-7', name: 'Node.js', category: 'Backend', proficiency: 88 },
  { id: 'sk-8', name: 'Express.js', category: 'Backend', proficiency: 90 },
  { id: 'sk-9', name: 'PHP', category: 'Backend', proficiency: 86 },
  { id: 'sk-10', name: 'RESTful API Architecture', category: 'Backend', proficiency: 92 },
  { id: 'sk-11', name: 'JWT Authentication', category: 'Backend', proficiency: 90 },

  // Database
  { id: 'sk-12', name: 'MySQL', category: 'Database', proficiency: 88 },
  { id: 'sk-13', name: 'MongoDB', category: 'Database', proficiency: 86 },

  // Other
  { id: 'sk-14', name: 'WordPress & WooCommerce', category: 'Other', proficiency: 85 },
  { id: 'sk-15', name: 'Git & GitHub', category: 'Other', proficiency: 90 },
  { id: 'sk-16', name: 'XAMPP / Server Setup', category: 'Other', proficiency: 88 },
  { id: 'sk-17', name: 'Responsive Web Design', category: 'Other', proficiency: 98 },
  { id: 'sk-18', name: 'Technical SEO Best Practices', category: 'Other', proficiency: 86 },
  { id: 'sk-19', name: 'Web Security & Sanitization', category: 'Other', proficiency: 88 },
];

export const initialFAQs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'How do we start working together on a project?',
    answer: 'Simply click "Start a Project" or "Contact Me" on this website, fill out your project requirements or budget, or reach out directly on WhatsApp. I will review your requirements, prepare a tailored proposal or quotation, and schedule a kickoff discussion.',
    category: 'General',
    isPublished: true,
  },
  {
    id: 'faq-2',
    question: 'What technologies do you specialize in?',
    answer: 'I specialize in full-stack web development using React, Node.js, Express, and MongoDB (MERN Stack) as well as PHP, MySQL, WordPress, WooCommerce, and Bootstrap. I choose the best technology stack based on your business requirements, scalability needs, and budget.',
    category: 'Technology',
    isPublished: true,
  },
  {
    id: 'faq-3',
    question: 'How does pricing and payment work?',
    answer: 'Projects can be priced either as fixed-price milestones or hourly rates depending on the project scope. Typically, projects follow a structured payment schedule: 30-40% advance deposit upon contract agreement, 30% upon design & development review, and final balance upon deployment.',
    category: 'Pricing',
    isPublished: true,
  },
  {
    id: 'faq-4',
    question: 'Will my website be mobile-friendly and fast?',
    answer: 'Absolutely! Every single website and web application I build is engineered with a mobile-first responsive architecture, optimized assets, clean code structure, and fast Core Web Vitals to ensure top performance on all devices.',
    category: 'Development',
    isPublished: true,
  },
  {
    id: 'faq-5',
    question: 'Do you provide maintenance and support after launch?',
    answer: 'Yes, every project includes complimentary 30 days of post-launch bug fixing and support. I also provide ongoing monthly maintenance packages for backups, updates, security monitoring, and new feature additions.',
    category: 'Support',
    isPublished: true,
  },
];

export const initialTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    clientName: 'Rahul Sharma',
    company: 'SecOpsHub Community',
    role: 'Founder',
    review: 'SK Yadav delivered the VicharManch platform with outstanding precision. His grasp of modern React architecture, clean UI design, and secure backend routing exceeded our expectations.',
    rating: 5,
    projectTitle: 'VicharManch',
    isPublished: true,
    createdAt: '2024-04-10T12:00:00Z',
  },
  {
    id: 'test-2',
    clientName: 'Pooja Verma',
    company: 'Sunrise Welfare Solution',
    role: 'Director',
    review: 'Working with SK Yadav was effortless. He transformed our wallpaper and bespoke mural catalog into an elegant digital showroom with instant WhatsApp inquiry features. Inquiries doubled within a month!',
    rating: 5,
    projectTitle: 'Sunrise Welfare Solution',
    isPublished: true,
    createdAt: '2024-06-01T15:30:00Z',
  },
  {
    id: 'test-3',
    clientName: 'Amit Patel',
    company: 'Disha Computer Institute',
    role: 'Managing Director',
    review: 'The student admission and course management website built by SK Yadav has eliminated paper friction entirely. Highly recommended for any educational or business web project.',
    rating: 5,
    projectTitle: 'Disha Computer Institute',
    isPublished: true,
    createdAt: '2023-12-05T09:00:00Z',
  },
];

export const initialBlogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Why Full Stack MERN Stacks Are Dominating Modern Web Development',
    slug: 'why-mern-stack-dominates-modern-web',
    excerpt: 'An in-depth analysis of how MongoDB, Express, React, and Node.js provide unmatched speed, flexibility, and scalability for modern digital platforms.',
    content: `Modern businesses demand web applications that deliver real-time responsiveness, seamless mobile interfaces, and effortless scalability. The MERN (MongoDB, Express.js, React, Node.js) stack has emerged as the premier choice for startups and enterprise platforms alike.

### 1. Single Language Across the Entire Stack
With JavaScript/TypeScript unifying both the client-side browser logic and server-side runtime, development velocity increases dramatically. Data formats remain consistent JSON objects from the database layer straight into React state.

### 2. React's Component-Driven Reusability
React enables modular UI architecture where UI elements, stateful forms, and animations are isolated, tested, and reused across complex client portals.

### 3. Non-Blocking Node.js Concurrency
Node.js processes concurrent I/O operations through its event-driven event loop, allowing thousands of simultaneous requests without high server resource consumption.`,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    category: 'MERN Stack',
    tags: ['React', 'Node.js', 'Full Stack', 'Web Development'],
    readTime: '4 min read',
    isPublished: true,
    author: 'SK Yadav',
    publishedAt: '2024-06-12T10:00:00Z',
  },
  {
    id: 'blog-2',
    title: 'PHP & MySQL in 2024: Still Powering Over 75% of the Web',
    slug: 'php-mysql-modern-web-development',
    excerpt: 'Exploring why PHP with MySQL remains one of the most cost-effective, reliable, and battle-tested stacks for business websites, ERPs, and portals.',
    content: `Despite the rise of newer frameworks, PHP coupled with MySQL continues to power massive portions of the global web, including WordPress, WooCommerce, and thousands of custom enterprise ERPs.

### Why PHP & MySQL Remain Essential:
* **Instant Deployment & Low Hosting Cost:** Supported natively on virtually any web server without complex build pipelines.
* **Rock-Solid Relational Integrity:** MySQL provides ACID compliance, foreign key constraints, and mature indexing.
* **Modern PHP 8+ Features:** JIT compilation, typed properties, and enhanced performance match modern expectations.`,
    coverImage: 'https://images.unsplash.com/photo-1599507593499-a3f7f7d97667?auto=format&fit=crop&w=1200&q=80',
    category: 'PHP & MySQL',
    tags: ['PHP', 'MySQL', 'Backend', 'Web Development'],
    readTime: '5 min read',
    isPublished: true,
    author: 'SK Yadav',
    publishedAt: '2024-05-18T14:20:00Z',
  },
  {
    id: 'blog-3',
    title: 'Essential Technical SEO Rules Every Web Developer Must Implement',
    slug: 'essential-technical-seo-rules-for-developers',
    excerpt: 'How semantic HTML, Open Graph tags, Core Web Vitals, and structured data elevate website rankings on Google search.',
    content: `Great web development isn't just about beautiful UI—it's about ensuring potential clients can actually discover your platform on search engines.

### Key SEO Checklist:
1. **Semantic HTML5:** Correct use of header, nav, main, article, section, and h1-h6 hierarchies.
2. **Metadata & Open Graph:** Dynamic meta titles, descriptive OG cards for social platforms.
3. **Core Web Vitals:** Sub-2.5s LCP, zero layout shifts (CLS), and sub-100ms interaction latency.
4. **Mobile Responsiveness:** Viewport meta tags, touch targets, and responsive images.`,
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    category: 'SEO',
    tags: ['SEO', 'Optimization', 'Performance', 'Web Design'],
    readTime: '3 min read',
    isPublished: true,
    author: 'SK Yadav',
    publishedAt: '2024-04-22T09:00:00Z',
  },
];

export const initialWebsiteContent: WebsiteContent = {
  hero: {
    heading: 'Turning Ideas Into',
    gradientHeading: 'Powerful Digital',
    subtitle: 'Experiences.',
    description: "Hi, I'm SK Yadav — Full Stack Web Developer. I build high-performance, responsive websites, e-commerce stores, and custom web applications that scale your business.",
    primaryCtaText: 'Start a Project',
    primaryCtaUrl: 'dashboard',
    secondaryCtaText: 'View My Work',
    secondaryCtaUrl: 'projects',
    badgeText: 'Available for Freelance Projects',
    hourlyRateBadge: '$25 - $45/hr',
    profileImage: '/logo.png',
  },
  whyHireMe: [
    {
      id: 'why-1',
      icon: 'Shield',
      title: 'Production-Ready Code',
      desc: 'Clean, modern, and modular architectures designed to scale effortlessly with best practices.'
    },
    {
      id: 'why-2',
      icon: 'Zap',
      title: 'High Performance & Speed',
      desc: 'Ultra-fast load times, 95+ Google Lighthouse scores, and responsive optimization across all devices.'
    },
    {
      id: 'why-3',
      icon: 'Clock',
      title: 'On-Time Milestone Delivery',
      desc: 'Structured development sprints, clear communication, and guaranteed turnaround times.'
    },
    {
      id: 'why-4',
      icon: 'MessageSquare',
      title: 'Transparent Communication',
      desc: 'Direct WhatsApp and email updates with regular live demo previews throughout the project.'
    },
    {
      id: 'why-5',
      icon: 'Award',
      title: 'End-to-End Ownership',
      desc: 'From initial UI/UX wireframes to database architecture, API engineering, and cloud deployment.'
    },
    {
      id: 'why-6',
      icon: 'CheckCircle2',
      title: 'Post-Launch Warranty',
      desc: '30 days of complimentary technical support and bug fixes with every project handover.'
    }
  ],
  workflow: [
    { num: '01', title: 'Discuss Requirements', desc: 'Detailed discovery call to understand your business goals, target audience, and feature roadmap.' },
    { num: '02', title: 'Project Planning & Architecture', desc: 'Define tech stack (MERN / PHP / MySQL), system schema, milestones, and itemized quotation.' },
    { num: '03', title: 'UI/UX Interactive Design', desc: 'Craft modern, high-converting, mobile-first responsive prototypes with meticulous typography.' },
    { num: '04', title: 'Full Stack Development', desc: 'Clean, structured, modular code with secure REST APIs, authentication, and optimized databases.' },
    { num: '05', title: 'Testing & Optimization', desc: 'Cross-browser validation, speed testing, security checks, and Core Web Vitals tuning.' },
    { num: '06', title: 'Production Deployment', desc: 'Seamless launch to Cloud / VPS server, domain & SSL configuration, and database indexing.' },
    { num: '07', title: 'Ongoing Support & Growth', desc: 'Complimentary post-launch support warranty, training, backups, and feature scaling.' },
  ],
  sectionHeadings: {
    projectsTitle: 'Featured Client Projects & Case Studies',
    projectsSubtitle: 'Explore real-world web applications, platforms, and digital solutions delivered with proven results.',
    servicesTitle: 'Full Stack Development Services',
    servicesSubtitle: 'Comprehensive end-to-end web engineering tailored for businesses, startups, and agencies.',
    skillsTitle: 'Technical Skills & Modern Stack',
    skillsSubtitle: 'Proficiency across frontend, backend, databases, CMS, and modern cloud deployment.',
    testimonialsTitle: 'Client Reviews & Feedback',
    testimonialsSubtitle: 'What business owners and project managers say about working with SK Yadav.',
    faqsTitle: 'Frequently Asked Questions',
    faqsSubtitle: 'Answers to common questions about timelines, pricing, technologies, and workflow.',
    contactTitle: 'Let’s Build Something Exceptional',
    contactSubtitle: 'Have a project in mind? Reach out today for a free consultation and project quotation.',
  },
  footer: {
    aboutText: 'Dedicated Full Stack Web Developer crafting high-performance, conversion-focused websites, custom SaaS platforms, and e-commerce solutions.',
    copyrightText: '© 2024 SK Yadav. All rights reserved.',
    emergencyNote: 'Available for urgent web development & bug fixes via WhatsApp.',
  }
};

export const initialSEOSettings: SEOSettings = {
  siteTitle: 'SK Yadav — Full Stack Web Developer | Freelance Portfolio & CMS',
  metaDescription: 'Expert Full Stack Web Developer specializing in React, Node.js, MERN Stack, PHP, MySQL, WordPress, and Custom SaaS Web Applications. Available for freelance projects worldwide.',
  keywords: 'SK Yadav, Full Stack Developer, Freelance Web Developer, React Developer, Node.js, PHP Developer, WordPress Expert, Web App Development, Custom SaaS, vicharmanch, sunrise welfare solution',
  ogTitle: 'SK Yadav — Full Stack Web Developer & Freelance Specialist',
  ogDescription: 'Turning ideas into powerful digital experiences. High performance, responsive web development for businesses and startups.',
  ogImage: '/logo.png',
  twitterCard: 'summary_large_image',
  canonicalUrl: 'https://skyadav.dev',
  robotsIndex: true,
  robotsFollow: true,
  sitemapUrl: 'https://skyadav.dev/sitemap.xml',
};

export const initialSocialLinks: SocialLink[] = [
  { id: 'soc-1', platform: 'GitHub', url: 'https://github.com', icon: 'Github', isPublished: true, displayOrder: 1 },
  { id: 'soc-2', platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'Linkedin', isPublished: true, displayOrder: 2 },
  { id: 'soc-3', platform: 'Instagram', url: 'https://instagram.com', icon: 'Instagram', isPublished: true, displayOrder: 3 },
  { id: 'soc-4', platform: 'Twitter / X', url: 'https://x.com', icon: 'Twitter', isPublished: true, displayOrder: 4 },
];

export const initialChatbotSettings: ChatbotSettings = {
  botName: 'SK Assistant',
  welcomeMessage: "Hello! I'm SK Assistant, the AI representative for SK Yadav. How can I assist you with your web development project today?",
  avatar: '/logo.png',
  suggestedQuestions: [
    'What services does SK Yadav offer?',
    'Show me recent web projects',
    'How do I request a quote?',
    'What are SK Yadav’s contact details?',
    'What is your typical project timeline?'
  ],
  isEnabled: true,
  humanCtaText: 'Speak with SK Yadav directly',
  whatsappCtaText: 'WhatsApp Chat (+91 9354152837)',
  emailCtaText: 'Email: skyadav02837@gmail.com',
  fallbackMessage: "I'm here to help! You can also reach SK Yadav directly on WhatsApp at +91 9354152837 or email skyadav02837@gmail.com.",
  customInstructions: "You are the professional AI Assistant representing SK Yadav, an expert Full Stack Web Developer. Provide accurate details strictly based on the real portfolio database. Never invent fake client reviews or fake technologies.",
  pricingRules: "Hourly rate is $25 - $45/hr. Full custom websites start from $300 to $1,500 depending on complexity."
};

export const initialLeads: Lead[] = [
  {
    id: 'lead-101',
    name: 'Vikram Sharma',
    email: 'vikram.sharma@aerotech.in',
    phone: '+91 9811223344',
    whatsapp: '+91 9811223344',
    source: 'Website Contact Form',
    projectType: 'E-commerce Store',
    requirement: 'Need a custom multivendor marketplace for industrial equipment with GST billing and Razorpay integration.',
    budget: '$1,500 - $3,000',
    deadline: '6 Weeks',
    status: 'Requirement Discussion',
    notes: 'Had an initial discovery call. Sent feature questionnaire. Follow up on Tuesday.',
    createdDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    lastContacted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    followUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  {
    id: 'lead-102',
    name: 'Emily Watson',
    email: 'emily@creativestudios.co.uk',
    phone: '+44 7700 900123',
    whatsapp: '+44 7700 900123',
    source: 'WhatsApp Referral',
    projectType: 'MERN SaaS Dashboard',
    requirement: 'React frontend revamp and Node.js REST API optimization for high-concurrency client portal.',
    budget: '$3,000 - $5,000',
    deadline: '1 Month',
    status: 'Proposal Sent',
    notes: 'Quotation sent via client dashboard. Client is reviewing payment terms.',
    createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    lastContacted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    followUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  }
];

export const initialClients: ClientRecord[] = [
  {
    id: 'client-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@techventure.io',
    phone: '+1 555-019-2834',
    company: 'TechVenture Labs',
    projectsCount: 1,
    totalQuotes: 1,
    totalPaid: 1200,
    status: 'Active',
    notes: 'High-value enterprise client. Very responsive and prefers weekly sprint updates.',
    createdAt: '2024-01-15T00:00:00Z',
    projectsList: ['Custom Full Stack SaaS Platform']
  },
  {
    id: 'client-2',
    name: 'Rohan Gupta',
    email: 'rohan@sunrisewelfare.org',
    phone: '+91 9354152837',
    company: 'Sunrise Welfare Solution',
    projectsCount: 1,
    totalQuotes: 1,
    totalPaid: 850,
    status: 'Active',
    notes: 'Wallpaper catalog and lead generation platform delivered with WhatsApp integration.',
    createdAt: '2024-04-10T00:00:00Z',
    projectsList: ['Sunrise Welfare Solution']
  }
];

export const initialMedia: MediaItem[] = [
  {
    id: 'media-1',
    name: 'SK Yadav Official Brand Logo',
    url: '/logo.png',
    altText: 'SK Yadav Developer Brand Logo',
    size: 24500,
    mimeType: 'image/png',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'media-2',
    name: 'VicharManch Hero Preview',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    altText: 'VicharManch Thought Sharing Platform',
    size: 142000,
    mimeType: 'image/jpeg',
    createdAt: '2024-03-15T10:00:00Z',
  },
  {
    id: 'media-3',
    name: 'Sunrise Wallpaper Showroom Preview',
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    altText: 'Sunrise Welfare Luxury Interior Wallpapers',
    size: 184000,
    mimeType: 'image/jpeg',
    createdAt: '2024-05-20T11:30:00Z',
  },
  {
    id: 'media-4',
    name: 'Disha Computer Education Portal',
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    altText: 'Disha Computer Institute Student Portal',
    size: 165000,
    mimeType: 'image/jpeg',
    createdAt: '2024-02-10T09:00:00Z',
  }
];

export const initialActivityLogs: ActivityLog[] = [
  {
    id: 'act-1',
    adminEmail: 'skyadav02837@gmail.com',
    action: 'System Initialized',
    entity: 'Portfolio CMS Engine',
    details: 'Database models and CMS storage initialized with production defaults.',
    timestamp: new Date().toISOString(),
    ip: '127.0.0.1'
  },
  {
    id: 'act-2',
    adminEmail: 'skyadav02837@gmail.com',
    action: 'Contact Details Verified',
    entity: 'Site Settings',
    details: 'Official phone +91 9354152837 and email skyadav02837@gmail.com bound to single source of truth.',
    timestamp: new Date().toISOString(),
    ip: '127.0.0.1'
  }
];

export const initialAdminSecurity: AdminSecurity = {
  adminUsername: INITIAL_ADMIN_USERNAME,
  adminEmail: INITIAL_ADMIN_EMAIL,
  passwordHash: INITIAL_ADMIN_HASH,
  salt: INITIAL_ADMIN_SALT,
  sessionTimeoutMinutes: 60,
  is2FAEnabled: false,
  failedAttempts: 0,
};

