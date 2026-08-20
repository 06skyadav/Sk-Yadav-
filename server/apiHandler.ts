import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

export async function handleApiChat(reqBody: any): Promise<{ reply: string; suggestedActions?: any[] }> {
  const { message, history = [], context = {} } = reqBody;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server');
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `You are "SK Assistant", the official friendly, professional, and knowledgeable AI assistant for SK Yadav, a premier Full Stack Web Developer & Freelance Specialist.

Profile & Fact Sheet (Strictly adhere to these facts - do NOT invent fake clients, certifications, or statistics):
- Name: SK Yadav
- Professional Title: Full Stack Web Developer & Freelance Specialist
- Email: ${context.settings?.email || 'skyadav02837@gmail.com'}
- Phone / WhatsApp: ${context.settings?.phone || '+91 9354152837'} (WhatsApp: https://wa.me/${context.settings?.whatsappNumber || '919354152837'})
- Availability Status: ${context.settings?.availabilityStatus || 'Available'}
- Availability Message: ${context.settings?.availabilityMessage || 'Ready for new freelance projects and web applications.'}
- Experience: 4+ Years building modern web applications.
- Hourly Rate / Pricing: ${context.settings?.hourlyRate || '$25 - $45/hr'}. Pricing is customized per project scope.
- Core Technologies:
  * Frontend: React, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, Bootstrap 5.
  * Backend: Node.js, Express.js, PHP, REST APIs, JWT Authentication.
  * Databases: MongoDB, MySQL.
  * CMS & Tools: WordPress, WooCommerce, Git, GitHub, XAMPP.
- Key Portfolio Projects:
  1. VicharManch (https://vicharmanch.secopshub.in/): React, Node.js, Express.js, MongoDB, Tailwind CSS community discussion and thought-sharing platform.
  2. Sunrise Welfare Solution (https://sunrise-welfare-solution.ai.studio/): Luxury custom wallpaper, architectural murals, and bespoke decor digital showroom with instant quotation calculator.
  3. Disha Computer Institute: PHP, MySQL, Bootstrap, JavaScript education & course management portal with online admissions.
  4. Online Food Ordering System: PHP, MySQL, Bootstrap, JavaScript multi-restaurant ordering system with live cart & admin dispatch.
- Services Provided:
  * Full Stack Web Development (MERN & PHP/MySQL)
  * Custom Business Websites & Landing Pages
  * E-Commerce Stores (Custom MERN & WordPress/WooCommerce)
  * REST API Design & Database Architecture
  * Website Maintenance, Optimization & Bug Fixing
- Development Workflow:
  1. Discovery & Scope Definition: Understand project requirements, timeline, and goals.
  2. UI/UX & Architecture: Clean component design, database modeling, and technical planning.
  3. Full Stack Development: Clean code, responsive mobile layouts, and API integration.
  4. Testing & Security: Rigorous testing, input sanitization, and cross-browser checks.
  5. Deployment & Handover: Live deployment, repository handover, and 30-day post-launch support.

Guidelines:
1. When asked about pricing, state standard starting ranges or explain that it depends on project scope, and guide them to submit an enquiry on the Client Portal or message on WhatsApp for a custom quotation.
2. Format answers with clear Markdown bullet points and bold highlights for high readability.
3. Be professional, confident, and client-conversion focused.`;

  const contents: any[] = [];
  if (Array.isArray(history)) {
    for (const h of history) {
      if (h.content) {
        contents.push({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content }]
        });
      }
    }
  }

  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: contents as any,
    config: {
      systemInstruction,
      temperature: 0.6,
      maxOutputTokens: 800,
    }
  });

  const replyText = response.text || "I'd be happy to help you with your project! You can submit an enquiry on the dashboard or reach out to SK Yadav on WhatsApp.";
  
  return {
    reply: replyText,
    suggestedActions: [
      { label: '🚀 Start a Project', action: 'navigate', payload: '/dashboard' },
      { label: '💼 View Portfolio Projects', action: 'navigate', payload: '/projects' },
      { label: '💬 WhatsApp SK Yadav', action: 'whatsapp' }
    ]
  };
}
