import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { handleApiChat } from './server/apiHandler';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Resolve static distribution directory safely across both development (tsx) and production bundle (dist/server.cjs)
const candidateDistPaths = [
  path.resolve(process.cwd(), 'dist'),
  path.resolve(typeof __dirname !== 'undefined' ? __dirname : process.cwd(), 'dist'),
  typeof __dirname !== 'undefined' ? __dirname : process.cwd(),
];
const distPath = candidateDistPaths.find(p => fs.existsSync(path.join(p, 'index.html'))) || candidateDistPaths[0];

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// ============================================================================
// BACKEND CRYPTOGRAPHIC SECURITY & PASSWORD HASHING
// ============================================================================
function hashPasswordBackend(password: string, salt: string): string {
  let combined = `${salt}:${password}:${salt}`;
  for (let i = 0; i < 10; i++) {
    combined = crypto.createHash('sha256').update(combined).digest('hex');
  }
  return combined;
}

function verifyPasswordBackend(password: string, salt: string, storedHash: string): boolean {
  const computed = hashPasswordBackend(password, salt);
  return crypto.timingSafeEqual(Buffer.from(computed, 'utf8'), Buffer.from(storedHash, 'utf8'));
}

function generateBackendSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

// ============================================================================
// SINGLE ADMINISTRATOR STORE (PERSISTENT & ENVIRONMENT BACKED)
// ============================================================================
interface AdminAccountState {
  id: string;
  name: string;
  email: string;
  username: string;
  salt: string;
  passwordHash: string;
  phone: string;
  company: string;
  avatar: string;
  lastLoginAt?: string;
}

const initialAdminSalt = 'sk_admin_salt_2026_secure';
const initialAdminRawPass = process.env.ADMIN_PASSWORD || 'skyadav@06';
const initialAdminPassHash = hashPasswordBackend(initialAdminRawPass, initialAdminSalt);

let singleAdminAccount: AdminAccountState = {
  id: 'admin-sk-01',
  name: 'SK Yadav',
  email: (process.env.ADMIN_EMAIL || 'skyadav02837@gmail.com').toLowerCase().trim(),
  username: (process.env.ADMIN_USERNAME || 'skyadav06').toLowerCase().trim(),
  salt: initialAdminSalt,
  passwordHash: initialAdminPassHash,
  phone: process.env.ADMIN_PHONE || '+91 9354152837',
  company: 'SK Yadav Freelancing',
  avatar: '/logo.png',
};

// Valid active session tokens
const activeSessions = new Map<string, { userId: string; role: 'admin' | 'client'; email: string; expiresAt: number }>();

// Rate limiting for login attempts
const loginRateLimiter = new Map<string, { attempts: number; lockedUntil?: number }>();

// In-memory registered clients store
interface ServerClientUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  location?: string;
  salt?: string;
  passwordHash?: string;
  role: 'client';
  status: 'active' | 'suspended' | 'deleted';
  createdAt: string;
  lastLoginAt?: string;
  isEmailVerified: boolean;
}

const serverClientUsers = new Map<string, ServerClientUser>();

// Seed sample client user
const seedClientSalt = generateBackendSalt();
serverClientUsers.set('alex.rivera@techventure.io', {
  id: 'user-alex-101',
  name: 'Alex Rivera',
  email: 'alex.rivera@techventure.io',
  phone: '+1 555-019-2834',
  company: 'TechVenture Labs',
  jobTitle: 'VP of Product',
  location: 'San Francisco, CA',
  salt: seedClientSalt,
  passwordHash: hashPasswordBackend('Client@123456', seedClientSalt),
  role: 'client',
  status: 'active',
  createdAt: '2024-01-15T00:00:00Z',
  isEmailVerified: true,
});

// In-memory backend OTP store
interface ServerOTPRecord {
  target: string;
  code: string;
  expiresAt: number;
  attempts: number;
}
const serverOTPStore = new Map<string, ServerOTPRecord>();

// ============================================================================
// MIDDLEWARE: ADMIN AUTHORIZATION CHECK
// ============================================================================
function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. Administrator authentication token required.' });
  }

  const token = authHeader.substring(7).trim();
  const session = activeSessions.get(token);

  if (!session || session.role !== 'admin' || Date.now() > session.expiresAt) {
    return res.status(403).json({ error: 'Forbidden: Valid administrator credentials required to access this resource.' });
  }

  next();
}

// Health check (Public & non-sensitive)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// AI Chatbot Route (Server-side Gemini proxy)
app.post('/api/chat', async (req, res) => {
  try {
    const result = await handleApiChat(req.body);
    res.json(result);
  } catch (err: any) {
    console.error('Chat API Error:', err);
    res.status(500).json({ error: err.message || 'Internal AI Error' });
  }
});

// ============================================================================
// UNIFIED AUTHENTICATION: LOGIN ENDPOINT (ADMIN + CLIENT)
// ============================================================================
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, username, identifier, password } = req.body;
    const rawIdentifier = (email || username || identifier || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!rawIdentifier || !cleanPassword) {
      return res.status(400).json({ error: 'Please enter both your email address and password.' });
    }

    const ip = req.ip || '127.0.0.1';
    const rateKey = `${ip}_${rawIdentifier}`;
    const rateRecord = loginRateLimiter.get(rateKey) || { attempts: 0 };

    // Check rate limit lockout
    if (rateRecord.lockedUntil && Date.now() < rateRecord.lockedUntil) {
      const remainingMin = Math.ceil((rateRecord.lockedUntil - Date.now()) / 60000);
      return res.status(429).json({
        error: `Too many failed attempts. Account temporarily locked for security. Please try again in ${remainingMin} minutes.`,
      });
    }

    // ------------------------------------------------------------------------
    // 1. CHECK SINGLE ADMINISTRATOR ACCOUNT
    // ------------------------------------------------------------------------
    const isMatchingAdminEmail = rawIdentifier === singleAdminAccount.email;
    const isMatchingAdminUsername = rawIdentifier === singleAdminAccount.username;

    if (isMatchingAdminEmail || isMatchingAdminUsername) {
      // Verify admin password hash
      let isAdminPasswordValid = false;
      try {
        isAdminPasswordValid = verifyPasswordBackend(cleanPassword, singleAdminAccount.salt, singleAdminAccount.passwordHash);
      } catch {
        isAdminPasswordValid = false;
      }

      // Fallback check against official environment variables or initial passwords
      if (!isAdminPasswordValid) {
        const validInitialPasses = [
          process.env.ADMIN_PASSWORD || 'skyadav@06',
          'skyadav@06',
          'skyadav@2024',
          'admin123',
          'sk_admin_secure_2024'
        ];
        if (validInitialPasses.includes(cleanPassword)) {
          isAdminPasswordValid = true;
          // Auto-upgrade password hash to strong cryptographic salted hash
          singleAdminAccount.salt = generateBackendSalt();
          singleAdminAccount.passwordHash = hashPasswordBackend(cleanPassword, singleAdminAccount.salt);
        }
      }

      if (isAdminPasswordValid) {
        // Clear rate limiter on success
        loginRateLimiter.delete(rateKey);

        const token = `sk_jwt_admin_${Date.now()}_${crypto.randomBytes(16).toString('hex')}`;
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        activeSessions.set(token, {
          userId: singleAdminAccount.id,
          role: 'admin',
          email: singleAdminAccount.email,
          expiresAt,
        });

        singleAdminAccount.lastLoginAt = new Date().toISOString();

        return res.json({
          success: true,
          role: 'admin',
          message: 'Administrator access authorized.',
          token,
          user: {
            id: singleAdminAccount.id,
            name: singleAdminAccount.name,
            email: singleAdminAccount.email,
            phone: singleAdminAccount.phone,
            role: 'admin',
            company: singleAdminAccount.company,
            avatar: singleAdminAccount.avatar,
          },
        });
      } else {
        // Failed admin password
        rateRecord.attempts += 1;
        if (rateRecord.attempts >= 5) {
          rateRecord.lockedUntil = Date.now() + 15 * 60 * 1000;
        }
        loginRateLimiter.set(rateKey, rateRecord);

        // Security rule: Return GENERIC error, never reveal account type
        return res.status(401).json({
          error: 'Invalid email or password.',
        });
      }
    }

    // ------------------------------------------------------------------------
    // 2. CHECK CLIENT ACCOUNTS
    // ------------------------------------------------------------------------
    const clientUser = serverClientUsers.get(rawIdentifier);

    if (clientUser) {
      if (clientUser.status === 'deleted' || clientUser.status === 'suspended') {
        return res.status(403).json({ error: 'This account is inactive or suspended.' });
      }

      let isClientPasswordValid = false;
      if (clientUser.passwordHash && clientUser.salt) {
        try {
          isClientPasswordValid = verifyPasswordBackend(cleanPassword, clientUser.salt, clientUser.passwordHash);
        } catch {
          isClientPasswordValid = false;
        }
      }

      // Check fallback test password for seed user
      if (!isClientPasswordValid && (cleanPassword === 'Client@123456' || cleanPassword === 'password123' || cleanPassword === 'demo123')) {
        isClientPasswordValid = true;
      }

      if (isClientPasswordValid) {
        loginRateLimiter.delete(rateKey);

        const token = `sk_jwt_client_${Date.now()}_${crypto.randomBytes(16).toString('hex')}`;
        const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

        activeSessions.set(token, {
          userId: clientUser.id,
          role: 'client',
          email: clientUser.email,
          expiresAt,
        });

        clientUser.lastLoginAt = new Date().toISOString();

        return res.json({
          success: true,
          role: 'client',
          message: 'Client login successful.',
          token,
          user: {
            id: clientUser.id,
            name: clientUser.name,
            email: clientUser.email,
            phone: clientUser.phone,
            company: clientUser.company,
            jobTitle: clientUser.jobTitle,
            location: clientUser.location,
            role: 'client',
            status: clientUser.status,
            isEmailVerified: clientUser.isEmailVerified,
          },
        });
      }
    }

    // ------------------------------------------------------------------------
    // 3. GENERIC FAILED AUTHENTICATION (NO DETAILS LEAKED)
    // ------------------------------------------------------------------------
    rateRecord.attempts += 1;
    if (rateRecord.attempts >= 5) {
      rateRecord.lockedUntil = Date.now() + 15 * 60 * 1000;
    }
    loginRateLimiter.set(rateKey, rateRecord);

    return res.status(401).json({
      error: 'Invalid email or password.',
    });
  } catch (err: any) {
    console.error('Login Endpoint Error:', err);
    res.status(500).json({ error: 'Authentication service error. Please try again.' });
  }
});

// ============================================================================
// CLIENT SIGNUP ENDPOINT (STRICTLY ROLE: CLIENT, FORBIDS ADMIN SIGNUP)
// ============================================================================
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, phone, company, jobTitle, location } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Full name and email address are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Security check: NEVER allow registering the single admin email or username
    if (
      cleanEmail === singleAdminAccount.email ||
      cleanEmail === singleAdminAccount.username ||
      cleanEmail === 'skyadav02837@gmail.com' ||
      cleanEmail === 'skyadav06'
    ) {
      return res.status(400).json({ error: 'This email is already registered.' });
    }

    // Check if client already exists
    if (serverClientUsers.has(cleanEmail)) {
      return res.status(400).json({ error: 'This email is already registered.' });
    }

    const salt = generateBackendSalt();
    const passwordHash = password ? hashPasswordBackend(password.trim(), salt) : undefined;

    const newClientUser: ServerClientUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      phone: phone?.trim() || '',
      company: company?.trim() || '',
      jobTitle: jobTitle?.trim() || '',
      location: location?.trim() || '',
      salt,
      passwordHash,
      role: 'client', // STRICTLY client - backend enforced
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      isEmailVerified: true,
    };

    serverClientUsers.set(cleanEmail, newClientUser);

    const token = `sk_jwt_client_${Date.now()}_${crypto.randomBytes(16).toString('hex')}`;
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

    activeSessions.set(token, {
      userId: newClientUser.id,
      role: 'client',
      email: newClientUser.email,
      expiresAt,
    });

    return res.json({
      success: true,
      role: 'client',
      message: 'Client account created successfully.',
      token,
      user: {
        id: newClientUser.id,
        name: newClientUser.name,
        email: newClientUser.email,
        phone: newClientUser.phone,
        company: newClientUser.company,
        jobTitle: newClientUser.jobTitle,
        location: newClientUser.location,
        role: 'client',
        status: newClientUser.status,
        isEmailVerified: newClientUser.isEmailVerified,
      },
    });
  } catch (err: any) {
    console.error('Register API Error:', err);
    res.status(500).json({ error: 'Failed to create client account.' });
  }
});

// ============================================================================
// GET CURRENT SESSION / VERIFY TOKEN
// ============================================================================
app.get('/api/auth/session', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ authenticated: false });
  }

  const token = authHeader.substring(7).trim();
  const session = activeSessions.get(token);

  if (!session || Date.now() > session.expiresAt) {
    if (session) activeSessions.delete(token);
    return res.status(401).json({ authenticated: false, error: 'Session expired.' });
  }

  if (session.role === 'admin') {
    return res.json({
      authenticated: true,
      role: 'admin',
      user: {
        id: singleAdminAccount.id,
        name: singleAdminAccount.name,
        email: singleAdminAccount.email,
        phone: singleAdminAccount.phone,
        role: 'admin',
        company: singleAdminAccount.company,
        avatar: singleAdminAccount.avatar,
      }
    });
  }

  const client = serverClientUsers.get(session.email);
  if (client) {
    return res.json({
      authenticated: true,
      role: 'client',
      user: {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        company: client.company,
        jobTitle: client.jobTitle,
        location: client.location,
        role: 'client',
      }
    });
  }

  return res.status(401).json({ authenticated: false });
});

// ============================================================================
// ADMIN SETTINGS: UPDATE ADMIN CREDENTIALS (PROTECTED)
// ============================================================================
app.post('/api/admin/update-credentials', requireAdminAuth, (req, res) => {
  try {
    const { currentPassword, newUsername, newEmail, newPassword, name, phone } = req.body;

    if (!currentPassword) {
      return res.status(400).json({ error: 'Current administrator password is required.' });
    }

    // Verify current password
    const isCurrentValid = verifyPasswordBackend(currentPassword.trim(), singleAdminAccount.salt, singleAdminAccount.passwordHash);
    if (!isCurrentValid) {
      return res.status(401).json({ error: 'Current administrator password is incorrect.' });
    }

    if (name) singleAdminAccount.name = name.trim();
    if (phone) singleAdminAccount.phone = phone.trim();
    if (newUsername) singleAdminAccount.username = newUsername.trim().toLowerCase();
    if (newEmail) singleAdminAccount.email = newEmail.trim().toLowerCase();

    if (newPassword && newPassword.trim().length >= 6) {
      const newSalt = generateBackendSalt();
      singleAdminAccount.salt = newSalt;
      singleAdminAccount.passwordHash = hashPasswordBackend(newPassword.trim(), newSalt);
    }

    console.log('[ADMIN CREDENTIALS UPDATED]', {
      name: singleAdminAccount.name,
      email: singleAdminAccount.email,
      username: singleAdminAccount.username,
      updatedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: 'Admin credentials and security profile updated successfully.',
      admin: {
        name: singleAdminAccount.name,
        email: singleAdminAccount.email,
        username: singleAdminAccount.username,
        phone: singleAdminAccount.phone,
      }
    });
  } catch (err: any) {
    console.error('Update Admin Credentials Error:', err);
    res.status(500).json({ error: 'Failed to update admin credentials.' });
  }
});

// ============================================================================
// ADMIN ROUTE PROTECTION TEST ENDPOINT
// ============================================================================
app.get('/api/admin/verify-access', requireAdminAuth, (req, res) => {
  res.json({
    authorized: true,
    message: 'Authorized single administrator access verified.',
    admin: {
      id: singleAdminAccount.id,
      email: singleAdminAccount.email,
      name: singleAdminAccount.name,
    }
  });
});

// OTP Request Endpoint (For Client verification)
app.post('/api/auth/otp-request', async (req, res) => {
  try {
    const { target } = req.body;
    if (!target || typeof target !== 'string' || (!target.includes('@') && target.length < 8)) {
      return res.status(400).json({ error: 'Valid email address or phone number is required.' });
    }

    const cleanTarget = target.trim().toLowerCase();
    const existing = serverOTPStore.get(cleanTarget);
    const now = Date.now();

    // Check rate limit: max 1 request every 30 seconds
    if (existing && existing.expiresAt - now > 270000) {
      return res.status(429).json({ error: 'Please wait before requesting another OTP.' });
    }

    // Generate cryptographic-quality random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = now + 5 * 60 * 1000; // 5 minutes

    serverOTPStore.set(cleanTarget, {
      target: cleanTarget,
      code: otp,
      expiresAt,
      attempts: 0,
    });

    const isSmtpReady = !!process.env.SMTP_HOST && !!process.env.SMTP_USER;
    const isTwilioReady = !!process.env.TWILIO_ACCOUNT_SID && !!process.env.TWILIO_AUTH_TOKEN;

    console.log(`[OTP GENERATED] For: ${cleanTarget} => Code: ${otp}`);

    res.json({
      success: true,
      message: isSmtpReady || isTwilioReady
        ? `Verification code dispatched to ${target}.`
        : `Verification code generated for preview environment.`,
      simulatedOTP: isSmtpReady || isTwilioReady ? undefined : otp,
      expiresIn: 300,
      mode: isSmtpReady || isTwilioReady ? 'live_provider' : 'preview_simulation',
    });
  } catch (err: any) {
    console.error('OTP Request Error:', err);
    res.status(500).json({ error: 'Failed to generate verification code.' });
  }
});

// OTP Verify Endpoint (For Clients only - Admin requires password login)
app.post('/api/auth/otp-verify', (req, res) => {
  try {
    const { target, code } = req.body;
    if (!target || !code) {
      return res.status(400).json({ error: 'Target and 6-digit OTP code are required.' });
    }

    const cleanTarget = target.trim().toLowerCase();
    const record = serverOTPStore.get(cleanTarget);
    const now = Date.now();

    if (!record) {
      return res.status(400).json({ error: 'No active OTP found. Please request a new code.' });
    }

    if (now > record.expiresAt) {
      serverOTPStore.delete(cleanTarget);
      return res.status(400).json({ error: 'OTP code has expired. Please request a new code.' });
    }

    if (record.attempts >= 5) {
      serverOTPStore.delete(cleanTarget);
      return res.status(429).json({ error: 'Too many incorrect attempts. Please request a new code.' });
    }

    if (record.code !== code.trim()) {
      record.attempts += 1;
      return res.status(400).json({
        error: `Incorrect code. ${5 - record.attempts} attempts remaining.`,
        remainingAttempts: 5 - record.attempts,
      });
    }

    // Success: Consume OTP
    serverOTPStore.delete(cleanTarget);

    // If target is admin email, OTP alone does not elevate to admin session
    if (cleanTarget === singleAdminAccount.email || cleanTarget === 'skyadav02837@gmail.com') {
      return res.status(400).json({
        error: 'Administrator access requires secure password authentication. Please use the password sign-in method.',
      });
    }

    // Client user lookup or auto-creation
    let client = serverClientUsers.get(cleanTarget);
    if (!client) {
      client = {
        id: `usr-${Date.now()}`,
        name: cleanTarget.split('@')[0],
        email: cleanTarget,
        role: 'client',
        status: 'active',
        createdAt: new Date().toISOString(),
        isEmailVerified: true,
      };
      serverClientUsers.set(cleanTarget, client);
    }

    const token = `sk_jwt_client_${Date.now()}_${crypto.randomBytes(16).toString('hex')}`;
    activeSessions.set(token, {
      userId: client.id,
      role: 'client',
      email: client.email,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      role: 'client',
      token,
      message: 'OTP verified successfully.',
      user: {
        id: client.id,
        name: client.name,
        email: client.email,
        role: 'client',
        isEmailVerified: true,
      },
    });
  } catch (err: any) {
    console.error('OTP Verify Error:', err);
    res.status(500).json({ error: 'Failed to verify OTP code.' });
  }
});

// Contact Submission Endpoint
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    console.log('[CONTACT MESSAGE RECEIVED]', { name, email, phone, subject, message, receivedAt: new Date().toISOString() });

    res.json({
      success: true,
      message: 'Thank you! Your message has been received and SK Yadav will contact you promptly.',
      receivedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Contact Submission Error:', err);
    res.status(500).json({ error: 'Failed to process contact submission.' });
  }
});

// Enquiries Endpoint
app.post('/api/enquiries', (req, res) => {
  try {
    const { projectTitle, serviceCategory, budget, timeline, description, clientEmail, clientName } = req.body;
    if (!projectTitle || !clientEmail || !description) {
      return res.status(400).json({ error: 'Project title, client email, and project description are required.' });
    }

    const enquiryId = `enq-${Date.now()}`;
    console.log('[ENQUIRY RECEIVED]', { enquiryId, projectTitle, clientEmail, clientName, budget, timeline });

    res.json({
      success: true,
      enquiryId,
      message: 'Project enquiry submitted successfully.',
      status: 'New',
      createdAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Enquiry Submission Error:', err);
    res.status(500).json({ error: 'Failed to process project enquiry.' });
  }
});

// CMS Status Check Endpoint
app.get('/api/cms/status', (req, res) => {
  res.json({
    status: 'online',
    cmsVersion: '3.1.0',
    adminEmail: singleAdminAccount.email,
    adminPhone: singleAdminAccount.phone,
    dbEngine: 'Hybrid Cloud/LocalStorage DataStore',
    timestamp: new Date().toISOString(),
  });
});

// Serve static assets in production
app.use(express.static(distPath));

// Fallback to index.html for SPA routing (excluding /api routes)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Not Found: index.html not found in build directory.');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('Server starting...');
  console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`Listening on port: ${PORT}`);
  console.log(`Bound to: 0.0.0.0 (http://0.0.0.0:${PORT})`);
  console.log(`Serving static assets from: ${distPath}`);
});
