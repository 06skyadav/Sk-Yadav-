import { DatabaseStore } from './dbStore';
import { ChatMessage } from '../types';

export async function sendChatMessageToAI(userMessage: string, history: ChatMessage[]): Promise<ChatMessage> {
  const settings = DatabaseStore.getSettings();
  const projects = DatabaseStore.getProjects();
  const services = DatabaseStore.getServices();
  const skills = DatabaseStore.getSkills();
  const faqs = DatabaseStore.getFAQs();

  // Try calling the backend API endpoint
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        history: history.slice(-6).map(h => ({ role: h.role, content: h.content })),
        context: {
          settings,
          projectsCount: projects.length,
          projects: projects.map(p => ({
            name: p.name,
            slug: p.slug,
            category: p.category,
            tech: p.technologies.join(', '),
            liveUrl: p.liveUrl,
            description: p.shortDescription
          })),
          services: services.map(s => ({ title: s.title, price: s.startingPrice, time: s.deliveryDays })),
          skills: skills.map(s => s.name),
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.reply) {
        return {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toISOString(),
          suggestedActions: data.suggestedActions || generateDefaultActions(userMessage),
        };
      }
    }
  } catch (err) {
    console.warn('Backend /api/chat not reachable, using local intelligent engine:', err);
  }

  // Local knowledge-based intelligent fallback
  const reply = generateLocalAIReply(userMessage, { settings, projects, services, skills, faqs });
  return {
    id: `ai-${Date.now()}`,
    role: 'assistant',
    content: reply.text,
    timestamp: new Date().toISOString(),
    suggestedActions: reply.suggestedActions,
  };
}

function generateDefaultActions(userMsg: string) {
  const lower = userMsg.toLowerCase();
  if (lower.includes('project') || lower.includes('work') || lower.includes('demo')) {
    return [
      { label: '💼 Browse All Projects', action: 'navigate' as const, payload: '/projects' },
      { label: '🚀 Start a Project', action: 'navigate' as const, payload: '/dashboard' },
      { label: '💬 WhatsApp SK Yadav', action: 'whatsapp' as const },
    ];
  }
  return [
    { label: '🚀 Start a Project', action: 'navigate' as const, payload: '/dashboard' },
    { label: '💼 View Portfolio', action: 'navigate' as const, payload: '/projects' },
    { label: '💬 WhatsApp SK Yadav', action: 'whatsapp' as const },
  ];
}

function generateLocalAIReply(
  msg: string,
  data: {
    settings: ReturnType<typeof DatabaseStore.getSettings>;
    projects: ReturnType<typeof DatabaseStore.getProjects>;
    services: ReturnType<typeof DatabaseStore.getServices>;
    skills: ReturnType<typeof DatabaseStore.getSkills>;
    faqs: ReturnType<typeof DatabaseStore.getFAQs>;
  }
): { text: string; suggestedActions: ChatMessage['suggestedActions'] } {
  const q = msg.toLowerCase();
  const { settings, projects, services, skills } = data;

  // 1. Who is SK Yadav?
  if (q.includes('who is sk yadav') || q.includes('who are you') || q.includes('about sk yadav') || q.includes('introduce')) {
    return {
      text: `**SK Yadav** is a professional **Full Stack Web Developer & Freelance Specialist** with over 4 years of hands-on experience building modern, responsive, and scalable web platforms for businesses, startups, and individuals.\n\nHe specializes in:\n* **MERN Stack Development** (React, Node.js, Express, MongoDB)\n* **Classic Full Stack Web Apps** (PHP, MySQL, Bootstrap, XAMPP)\n* **E-Commerce & Digital Catalogues** (Custom & WordPress/WooCommerce)\n* **Custom APIs & High-Performance UI/UX**`,
      suggestedActions: [
        { label: '💼 View Portfolio Projects', action: 'navigate', payload: '/projects' },
        { label: '🚀 Start a Project', action: 'navigate', payload: '/dashboard' },
        { label: '💬 Chat on WhatsApp', action: 'whatsapp' }
      ]
    };
  }

  // 2. What services does SK Yadav provide?
  if (q.includes('service') || q.includes('what do you offer') || q.includes('what can you do')) {
    return {
      text: `SK Yadav provides end-to-end web engineering services:\n\n1. **Full Stack Web Applications:** Custom MERN and PHP/MySQL applications with secure user authentication and interactive dashboards.\n2. **Business Websites & Landing Pages:** High-converting, SEO-optimized, mobile-first responsive web presences.\n3. **E-Commerce Development:** Complete online stores with cart, checkout, payment gateways, and inventory management.\n4. **API Development & Integrations:** RESTful APIs, third-party service connections, and database design.\n5. **Website Maintenance & Bug Fixing:** Performance tuning, security hardening, and ongoing feature enhancements.`,
      suggestedActions: [
        { label: '🛠️ Explore All Services', action: 'navigate', payload: '/services' },
        { label: '🚀 Request a Quotation', action: 'navigate', payload: '/dashboard' },
        { label: '💬 WhatsApp SK Yadav', action: 'whatsapp' }
      ]
    };
  }

  // 3. What technologies does SK Yadav know?
  if (q.includes('technolog') || q.includes('tech stack') || q.includes('skills') || q.includes('what do you know')) {
    return {
      text: `SK Yadav's core technical stack includes:\n\n* **Frontend:** React, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, Bootstrap 5\n* **Backend:** Node.js, Express.js, PHP, REST APIs, JWT Authentication\n* **Databases:** MongoDB, MySQL\n* **CMS & Tools:** WordPress, WooCommerce, Git, GitHub, XAMPP, Postman\n* **Design & Architecture:** Responsive Mobile-First Design, SEO Best Practices, Web Security`,
      suggestedActions: [
        { label: '💼 View Projects by Stack', action: 'navigate', payload: '/projects' },
        { label: '🚀 Start a Project', action: 'navigate', payload: '/dashboard' }
      ]
    };
  }

  // 4. Show me his projects
  if (q.includes('show me his projects') || q.includes('show projects') || q.includes('portfolio') || q.includes('recent work')) {
    return {
      text: `Here are SK Yadav's flagship portfolio projects:\n\n1. **VicharManch** (Full Stack): Community discourse and thought-sharing platform (*React, Node.js, Express, MongoDB, Tailwind CSS*). [Live Demo](https://vicharmanch.secopshub.in/)\n2. **Sunrise Welfare Solution** (Web Development): Luxury custom wallpaper and architectural mural digital showroom (*React, Tailwind CSS, Instant Quotation*). [Live Demo](https://sunrise-welfare-solution.ai.studio/)\n3. **Disha Computer Institute** (PHP/MySQL): Student admission and course management education portal.\n4. **Online Food Ordering System** (PHP/MySQL): Multi-restaurant food ordering system with dynamic cart and dispatch portal.`,
      suggestedActions: [
        { label: '💼 Browse All Projects', action: 'navigate', payload: '/projects' },
        { label: '🚀 Start a Project', action: 'navigate', payload: '/dashboard' }
      ]
    };
  }

  // 5. Can he build an e-commerce website?
  if (q.includes('ecommerce') || q.includes('e-commerce') || q.includes('online store') || q.includes('shop')) {
    return {
      text: `**Yes, absolutely!** SK Yadav has extensive experience building custom e-commerce and multi-vendor ordering solutions:\n\n* **Custom MERN E-Commerce:** Dynamic product catalogs, instant search/filter, interactive shopping cart, secure checkout, and admin dashboard.\n* **PHP/MySQL & WooCommerce:** Scalable online storefronts with payment gateway integrations (Stripe, Razorpay, PayPal, Cash on Delivery).\n* **Key Features:** Automated invoice generation, coupon systems, and order status tracking.`,
      suggestedActions: [
        { label: '🚀 Start E-Commerce Project', action: 'navigate', payload: '/dashboard' },
        { label: '💬 Discuss on WhatsApp', action: 'whatsapp' }
      ]
    };
  }

  // 6. Can he build a PHP/MySQL website?
  if (q.includes('php') || q.includes('mysql') || q.includes('xampp')) {
    return {
      text: `**Yes!** PHP & MySQL is one of SK Yadav's foundational backend specialties:\n\n* Developed full-stack systems like **Disha Computer Institute** (student admissions & course management) and **Online Food Ordering System**.\n* Skilled with relational schema design, prepared SQL statements, session security, Bootstrap UI, and XAMPP deployment.`,
      suggestedActions: [
        { label: '💼 View PHP Projects', action: 'navigate', payload: '/projects' },
        { label: '🚀 Request a PHP Proposal', action: 'navigate', payload: '/dashboard' }
      ]
    };
  }

  // 7. Can he build a MERN application?
  if (q.includes('mern') || q.includes('react') || q.includes('node') || q.includes('mongodb')) {
    return {
      text: `**Yes!** MERN stack (MongoDB, Express.js, React, Node.js) is SK Yadav's primary modern web development stack:\n\n* **Frontend:** Interactive Single Page Applications (SPAs) with React, state management, and modern Tailwind CSS.\n* **Backend:** Scalable Express REST APIs with JWT authentication, middleware guards, and MongoDB schema modeling.\n* **Flagship Example:** **VicharManch** ([Live Demo](https://vicharmanch.secopshub.in/)).`,
      suggestedActions: [
        { label: '🔎 View VicharManch Case Study', action: 'navigate', payload: '/projects/vicharmanch' },
        { label: '🚀 Start a MERN Project', action: 'navigate', payload: '/dashboard' }
      ]
    };
  }

  // 8. How can I contact him?
  if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('reach') || q.includes('whatsapp')) {
    return {
      text: `You can reach SK Yadav directly through multiple direct channels:\n\n* 💬 **WhatsApp:** [+${settings.whatsappNumber}](https://wa.me/${settings.whatsappNumber})\n* 📧 **Email:** [${settings.email}](mailto:${settings.email})\n* 📱 **Phone:** ${settings.phone}\n* 📬 **Contact Form:** Visit the [Contact Page](/contact) to send a message.\n* 🚀 **Client Portal:** Submit a project brief for a quotation within 24 hours.`,
      suggestedActions: [
        { label: '💬 Open WhatsApp Chat', action: 'whatsapp' },
        { label: '📬 Go to Contact Page', action: 'navigate', payload: '/contact' },
        { label: '🚀 Start a Project', action: 'navigate', payload: '/dashboard' }
      ]
    };
  }

  // 9. How can I start a project?
  if (q.includes('start a project') || q.includes('hire') || q.includes('how to start') || q.includes('get started') || q.includes('quote')) {
    return {
      text: `Starting a project with SK Yadav is straightforward:\n\n1. **Submit Your Brief:** Head to the [Client Portal](/dashboard) and fill out the project enquiry form with your requirements and timeline.\n2. **Receive a Quotation:** SK Yadav will review your requirements and provide an itemized quotation with transparent deliverables and timeline.\n3. **Kickoff & Collaboration:** Once accepted, development starts with regular progress updates and interactive milestone previews.`,
      suggestedActions: [
        { label: '🚀 Submit Project Brief', action: 'navigate', payload: '/dashboard' },
        { label: '💬 Chat on WhatsApp', action: 'whatsapp' }
      ]
    };
  }

  // 10. What is his workflow?
  if (q.includes('workflow') || q.includes('process') || q.includes('how do you work') || q.includes('steps')) {
    return {
      text: `SK Yadav follows a structured 5-phase development workflow:\n\n1. **Discovery & Requirement Analysis:** Clarify goals, audience, tech stack, and deliverable milestones.\n2. **Architecture & UI/UX Design:** Wireframing, database schema design, and responsive design prototypes.\n3. **Full Stack Implementation:** Writing clean, modular, maintainable code with secure authentication and API integration.\n4. **Quality Assurance & Testing:** Cross-browser testing, mobile responsiveness, performance audits, and security validation.\n5. **Deployment & 30-Day Support:** Seamless production rollout, source code repository handover, and post-launch support.`,
      suggestedActions: [
        { label: '🚀 Start Your Project', action: 'navigate', payload: '/dashboard' },
        { label: '💬 Discuss Workflow on WhatsApp', action: 'whatsapp' }
      ]
    };
  }

  // Default fallback
  return {
    text: `SK Yadav is a **Full Stack Web Developer & Freelance Specialist** specializing in modern, high-converting websites and custom web applications (MERN Stack, PHP/MySQL, E-Commerce, WordPress).\n\nFeel free to ask about his projects, tech stacks, workflow, or request a custom quotation!`,
    suggestedActions: [
      { label: '🚀 Start a Project', action: 'navigate', payload: '/dashboard' },
      { label: '💼 View Portfolio Projects', action: 'navigate', payload: '/projects' },
      { label: '💬 WhatsApp SK Yadav', action: 'whatsapp' }
    ]
  };
}
