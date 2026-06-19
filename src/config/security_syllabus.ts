import { Lesson, Unit, Course, Track } from './syllabus';

// --- UNIT 1: Identity & Access Management ---

export const SEC_LESSON_1_AUTH: Lesson = {
  id: "sec_lesson_1_auth",
  title: "AuthN vs AuthZ",
  description: "Distinguish between Authentication and Authorization.",
  lessonHtml: `
    <div class="prose prose-blue max-w-none mb-6">
      <h3 class="text-xl font-semibold mb-2">Who you are vs. What you can do</h3>
      <p class="mb-4">In security engineering, confusing these two concepts leads to catastrophic breaches.</p>
      <ul class="list-disc pl-5 mb-4 text-left">
        <li class="mb-2"><strong>Authentication (AuthN):</strong> Proving that you are who you say you are. This involves passwords, biometric scans, or Multi-Factor Authentication (MFA).</li>
        <li class="mb-2"><strong>Authorization (AuthZ):</strong> Verifying what you are allowed to do once you are inside the system. This involves Role-Based Access Control (RBAC) and checking permissions before returning sensitive data.</li>
      </ul>
      <p>Authentication unlocks the front door. Authorization dictates which rooms you can enter.</p>
    </div>
  `,
  exercise: {
    uiType: "drag_and_drop",
    passingThreshold: 1.0,
    categories: ["Authentication (AuthN)", "Authorization (AuthZ)"],
    concepts: [
      { id: "c1", name: "Entering a Password", category: "Authentication (AuthN)" },
      { id: "c2", name: "Checking if user is an Admin", category: "Authorization (AuthZ)" },
      { id: "c3", name: "Face ID scan", category: "Authentication (AuthN)" },
      { id: "c4", name: "Denying access to a financial report", category: "Authorization (AuthZ)" },
      { id: "c5", name: "Providing an SMS OTP code", category: "Authentication (AuthN)" }
    ]
  }
};

export const SEC_LESSON_2_IDOR: Lesson = {
  id: "sec_lesson_2_idor",
  title: "The IDOR Illusion",
  description: "Why complex IDs aren't a replacement for security.",
  lessonHtml: `
    <div class="prose prose-purple max-w-none mb-6">
      <h3 class="text-xl font-semibold mb-2">Insecure Direct Object Reference (IDOR)</h3>
      <p class="mb-4">An IDOR vulnerability occurs when an application provides direct access to an object based on user-supplied input without properly validating permissions (Authorization).</p>
      <ul class="list-disc pl-5 mb-4 text-left">
        <li class="mb-2"><strong>The Anti-Pattern:</strong> A developer thinks "I'll use a random UUID instead of an integer ID (e.g., /user/ab8f-12d4). Nobody can guess that, so it's secure!"</li>
        <li class="mb-2"><strong>The Reality:</strong> Relying on unguessable IDs is "Security by Obscurity." If a malicious user intercepts or guesses the ID, they can view private data because the server never checked if they were <em>authorized</em> to view it.</li>
      </ul>
      <p>Complex UUIDs do NOT provide Authorization. Always check permissions server-side!</p>
    </div>
  `,
  exercise: {
    uiType: "multiple_choice",
    passingThreshold: 1.0,
    categories: ["Proper Authorization", "Security by Obscurity"],
    concepts: [
      { id: "c1", name: "Relying on unguessable UUIDs", category: "Security by Obscurity" },
      { id: "c2", name: "Verifying user_id matches session_id", category: "Proper Authorization" },
      { id: "c3", name: "Hiding a private URL from search engines", category: "Security by Obscurity" },
      { id: "c4", name: "Base64 encoding a user parameter", category: "Security by Obscurity" },
      { id: "c5", name: "Checking RBAC roles before database read", category: "Proper Authorization" }
    ]
  }
};

export const SEC_LESSON_3_SESSIONS: Lesson = {
  id: "sec_lesson_3_sessions",
  title: "Session Hijacking",
  description: "Protecting cookies and tokens.",
  lessonHtml: `
    <div class="prose prose-blue max-w-none mb-6">
      <h3 class="text-xl font-semibold mb-2">Securing State in a Stateless Web</h3>
      <p class="mb-4">HTTP is stateless, so we use Sessions (via Cookies or JSON Web Tokens) to keep users logged in. If an attacker steals the token, they hijack the session.</p>
      <ul class="list-disc pl-5 mb-4 text-left">
        <li class="mb-2"><strong>HttpOnly Flag:</strong> Prevents JavaScript from reading the cookie. This entirely stops Cross-Site Scripting (XSS) from stealing session tokens.</li>
        <li class="mb-2"><strong>Secure Flag:</strong> Ensures the cookie is only sent over encrypted HTTPS connections, preventing interception on public Wi-Fi.</li>
      </ul>
    </div>
  `,
  exercise: {
    uiType: "drag_and_drop",
    passingThreshold: 1.0,
    categories: ["HttpOnly Flag", "Secure Flag"],
    concepts: [
      { id: "c1", name: "Blocks JavaScript access (document.cookie)", category: "HttpOnly Flag" },
      { id: "c2", name: "Prevents plain HTTP transmission", category: "Secure Flag" },
      { id: "c3", name: "Mitigates XSS token theft", category: "HttpOnly Flag" },
      { id: "c4", name: "Forces HTTPS only", category: "Secure Flag" }
    ]
  }
};

export const SEC_UNIT_1_IAM: Unit = {
  id: "sec_unit_1_iam",
  title: "Identity & Access Management",
  description: "Learn how to secure user identity and enforce permissions.",
  lessons: [SEC_LESSON_1_AUTH, SEC_LESSON_2_IDOR, SEC_LESSON_3_SESSIONS]
};

// --- UNIT 2: Injection & Client-Side Attacks ---

export const SEC_LESSON_4_SQLI: Lesson = {
  id: "sec_lesson_4_sqli",
  title: "SQL Injection (SQLi)",
  description: "When untrusted data becomes execution code.",
  lessonHtml: `
    <div class="prose prose-red max-w-none mb-6">
      <h3 class="text-xl font-semibold mb-2">Breaking the Data Context</h3>
      <p class="mb-4">SQL Injection occurs when untrusted user input is directly concatenated into a database query string.</p>
      <ul class="list-disc pl-5 mb-4 text-left">
        <li class="mb-2"><strong>The Threat:</strong> An attacker inputs <code>' OR 1=1 --</code> into a password field, manipulating the query to log them in without a password.</li>
        <li class="mb-2"><strong>The Fix: Parameterized Queries (Prepared Statements).</strong> This pre-compiles the SQL syntax and treats user input strictly as literal strings, completely neutralizing the injection.</li>
      </ul>
    </div>
  `,
  exercise: {
    uiType: "multiple_choice",
    passingThreshold: 1.0,
    categories: ["Vulnerable Pattern", "Secure Pattern"],
    concepts: [
      { id: "c1", name: "Concatenating user input into a SQL string", category: "Vulnerable Pattern" },
      { id: "c2", name: "Using Parameterized Queries", category: "Secure Pattern" },
      { id: "c3", name: "Prepared Statements", category: "Secure Pattern" },
      { id: "c4", name: "String interpolation with variables in SQL", category: "Vulnerable Pattern" },
      { id: "c5", name: "Using ORMs correctly", category: "Secure Pattern" }
    ]
  }
};

export const SEC_LESSON_5_XSS: Lesson = {
  id: "sec_lesson_5_xss",
  title: "Cross-Site Scripting (XSS)",
  description: "Executing malicious scripts in a victim's browser.",
  lessonHtml: `
    <div class="prose prose-red max-w-none mb-6">
      <h3 class="text-xl font-semibold mb-2">Weaponizing the Browser</h3>
      <p class="mb-4">XSS happens when an application includes untrusted data in a web page without proper validation or escaping, allowing attackers to execute JS in a victim's browser.</p>
      <ul class="list-disc pl-5 mb-4 text-left">
        <li class="mb-2"><strong>Stored XSS:</strong> The malicious script is saved in the database (e.g., a forum post). Anyone who views the post gets attacked. Highly dangerous.</li>
        <li class="mb-2"><strong>Reflected XSS:</strong> The script is bounced off a web server (e.g., hidden in an email link URL) and executes immediately when the victim clicks.</li>
        <li class="mb-2"><strong>The Fix: Output Encoding.</strong> Always escape user input before rendering it to the DOM.</li>
      </ul>
    </div>
  `,
  exercise: {
    uiType: "drag_and_drop",
    passingThreshold: 1.0,
    categories: ["Stored XSS", "Reflected XSS", "XSS Defense"],
    concepts: [
      { id: "c1", name: "Malicious payload saved in a database comment", category: "Stored XSS" },
      { id: "c2", name: "Payload executed directly from a tricked URL click", category: "Reflected XSS" },
      { id: "c3", name: "HTML Output Encoding", category: "XSS Defense" },
      { id: "c4", name: "Attacks all visitors who view a specific page", category: "Stored XSS" },
      { id: "c5", name: "Content Security Policy (CSP)", category: "XSS Defense" }
    ]
  }
};

export const SEC_LESSON_6_CSRF: Lesson = {
  id: "sec_lesson_6_csrf",
  title: "Cross-Site Request Forgery",
  description: "Tricking the browser into making unwanted requests.",
  lessonHtml: `
    <div class="prose prose-red max-w-none mb-6">
      <h3 class="text-xl font-semibold mb-2">The Confused Deputy</h3>
      <p class="mb-4">Because browsers automatically attach Cookies to cross-origin requests, a malicious website can trick a victim's browser into silently submitting a form (like a password reset or bank transfer) to an authenticated application.</p>
      <ul class="list-disc pl-5 mb-4 text-left">
        <li class="mb-2"><strong>The Threat:</strong> You are logged into Bank A. You visit EvilSite B in another tab. EvilSite B triggers an invisible form post to Bank A. Bank A accepts it because your browser auto-attached your session cookie!</li>
        <li class="mb-2"><strong>The Fix: CSRF Tokens or SameSite Cookies.</strong> Unpredictable anti-forgery tokens attached to legitimate forms prove the request originated from the intended UI.</li>
      </ul>
    </div>
  `,
  exercise: {
    uiType: "multiple_choice",
    passingThreshold: 1.0,
    categories: ["CSRF Vulnerability", "CSRF Defense"],
    concepts: [
      { id: "c1", name: "Browsers auto-attaching session cookies cross-origin", category: "CSRF Vulnerability" },
      { id: "c2", name: "Unpredictable Anti-Forgery Tokens", category: "CSRF Defense" },
      { id: "c3", name: "SameSite Cookie Attribute", category: "CSRF Defense" },
      { id: "c4", name: "Tricking an authenticated user to submit a hidden form", category: "CSRF Vulnerability" }
    ]
  }
};

export const SEC_UNIT_2_WEB_VULNS: Unit = {
  id: "sec_unit_2_web_vulns",
  title: "Injection & Client-Side Attacks",
  description: "Understand the OWASP Top 10 web vulnerabilities.",
  lessons: [SEC_LESSON_4_SQLI, SEC_LESSON_5_XSS, SEC_LESSON_6_CSRF]
};

// --- UNIT 3: Cryptography & Data Protection ---

export const SEC_LESSON_7_CRYPTO: Lesson = {
  id: "sec_lesson_7_crypto",
  title: "Hashing vs Encryption",
  description: "One-way destruction vs Two-way scrambling.",
  lessonHtml: `
    <div class="prose prose-green max-w-none mb-6">
      <h3 class="text-xl font-semibold mb-2">Data Protection Primitives</h3>
      <p class="mb-4">Mixing up hashing and encryption is an immediate red flag in an interview. They serve completely different purposes.</p>
      <ul class="list-disc pl-5 mb-4 text-left">
        <li class="mb-2"><strong>Hashing (One-Way):</strong> A mathematical algorithm that turns data into a fixed-length string. It is impossible to reverse. Used for storing passwords and verifying file integrity (e.g., SHA-256).</li>
        <li class="mb-2"><strong>Encryption (Two-Way):</strong> Scrambling data with a cryptographic key. It can be reversed (decrypted) if you possess the correct key. Used for protecting credit cards and PII (e.g., AES-256).</li>
      </ul>
    </div>
  `,
  exercise: {
    uiType: "drag_and_drop",
    passingThreshold: 1.0,
    categories: ["Hashing (One-Way)", "Encryption (Two-Way)"],
    concepts: [
      { id: "c1", name: "Storing User Passwords", category: "Hashing (One-Way)" },
      { id: "c2", name: "Storing Credit Card Numbers", category: "Encryption (Two-Way)" },
      { id: "c3", name: "Verifying File Integrity Checksums", category: "Hashing (One-Way)" },
      { id: "c4", name: "Can be reversed with a private key", category: "Encryption (Two-Way)" },
      { id: "c5", name: "Mathematically impossible to reverse", category: "Hashing (One-Way)" }
    ]
  }
};

export const SEC_LESSON_8_SALT: Lesson = {
  id: "sec_lesson_8_salt",
  title: "Salts and Rainbow Tables",
  description: "Defending hashes from pre-computation.",
  lessonHtml: `
    <div class="prose prose-green max-w-none mb-6">
      <h3 class="text-xl font-semibold mb-2">Flavoring your Hashes</h3>
      <p class="mb-4">Attackers use <strong>Rainbow Tables</strong> (massive databases of pre-computed password hashes) to crack stolen databases in seconds.</p>
      <ul class="list-disc pl-5 mb-4 text-left">
        <li class="mb-2"><strong>The Defense: Salting.</strong> A unique, random string (the Salt) is added to every individual user's password before hashing. This guarantees that two users with the password "password123" will have completely different hashes, rendering Rainbow Tables useless.</li>
      </ul>
    </div>
  `,
  exercise: {
    uiType: "multiple_choice",
    passingThreshold: 1.0,
    categories: ["Rainbow Tables", "Salting"],
    concepts: [
      { id: "c1", name: "Pre-computed dictionary of hashes", category: "Rainbow Tables" },
      { id: "c2", name: "Adding unique random bytes to a password before hashing", category: "Salting" },
      { id: "c3", name: "Defeats pre-computation attacks", category: "Salting" },
      { id: "c4", name: "Cracks unsalted databases instantly", category: "Rainbow Tables" }
    ]
  }
};

export const SEC_LESSON_9_DID: Lesson = {
  id: "sec_lesson_9_did",
  title: "Defense in Depth",
  description: "The Swiss Cheese Model.",
  lessonHtml: `
    <div class="prose prose-green max-w-none mb-6">
      <h3 class="text-xl font-semibold mb-2">Assuming Breach</h3>
      <p class="mb-4"><strong>Defense in Depth</strong> is the philosophy that any single security control will eventually fail. Therefore, you must layer multiple independent security controls throughout the architecture.</p>
      <ul class="list-disc pl-5 mb-4 text-left">
        <li class="mb-2">Instead of just a firewall, you use a Firewall AND Multi-Factor Authentication AND Endpoint Detection AND Principle of Least Privilege.</li>
        <li class="mb-2">If an attacker breaches the perimeter, they hit a second wall, and a third.</li>
      </ul>
    </div>
  `,
  exercise: {
    uiType: "drag_and_drop",
    passingThreshold: 1.0,
    categories: ["Single Point of Failure", "Defense in Depth"],
    concepts: [
      { id: "c1", name: "Relying purely on a perimeter firewall", category: "Single Point of Failure" },
      { id: "c2", name: "Firewall + MFA + Database Encryption", category: "Defense in Depth" },
      { id: "c3", name: "Swiss Cheese Model", category: "Defense in Depth" },
      { id: "c4", name: "Hard crunchy shell, soft gooey center", category: "Single Point of Failure" }
    ]
  }
};

export const SEC_UNIT_3_CRYPTO: Unit = {
  id: "sec_unit_3_crypto",
  title: "Cryptography & Data Protection",
  description: "Learn how to secure data at rest.",
  lessons: [SEC_LESSON_7_CRYPTO, SEC_LESSON_8_SALT, SEC_LESSON_9_DID]
};

export const SEC_COURSE_1_APPSEC: Course = {
  id: "sec_course_1_appsec",
  title: "AppSec Fundamentals (100 Level)",
  description: "Core application security vulnerabilities.",
  units: [SEC_UNIT_1_IAM, SEC_UNIT_2_WEB_VULNS, SEC_UNIT_3_CRYPTO]
};

// --- UNIT 4: Network & Infrastructure Security (200 Level) ---

export const SEC_LESSON_10_TLS: Lesson = {
  id: "sec_lesson_10_tls",
  title: "The TLS Handshake",
  description: "How the internet establishes trust.",
  lessonHtml: `
    <div class="prose prose-orange max-w-none mb-6">
      <h3 class="text-xl font-semibold mb-2">Transport Layer Security (TLS)</h3>
      <p class="mb-4">TLS provides privacy and data integrity between two communicating applications. It prevents Man-in-the-Middle (MitM) attacks.</p>
      <ul class="list-disc pl-5 mb-4 text-left">
        <li class="mb-2"><strong>Asymmetric Cryptography:</strong> Used first to securely establish a shared secret over an insecure channel.</li>
        <li class="mb-2"><strong>Symmetric Cryptography:</strong> Once the secret is shared, it is used for the rest of the session because it is much faster.</li>
        <li class="mb-2"><strong>Certificates:</strong> Provided by the server to prove its identity, signed by a trusted Certificate Authority (CA).</li>
      </ul>
    </div>
  `,
  exercise: {
    uiType: "multiple_choice",
    passingThreshold: 1.0,
    categories: ["Asymmetric Crypto", "Symmetric Crypto", "Certificates"],
    concepts: [
      { id: "c1", name: "Used initially to establish the shared secret", category: "Asymmetric Crypto" },
      { id: "c2", name: "Used for bulk data transfer due to high speed", category: "Symmetric Crypto" },
      { id: "c3", name: "Signed by a Certificate Authority (CA)", category: "Certificates" },
      { id: "c4", name: "Proves the server is who it claims to be", category: "Certificates" },
      { id: "c5", name: "Public Key / Private Key pairs", category: "Asymmetric Crypto" }
    ]
  }
};

export const SEC_LESSON_11_MTLS: Lesson = {
  id: "sec_lesson_11_mtls",
  title: "Mutual TLS (mTLS)",
  description: "When servers need to authenticate clients.",
  lessonHtml: `
    <div class="prose prose-orange max-w-none mb-6">
      <h3 class="text-xl font-semibold mb-2">Two-Way Verification</h3>
      <p class="mb-4">In standard TLS, the client verifies the server's identity (e.g., your browser verifying Google.com). In <strong>Mutual TLS (mTLS)</strong>, both parties authenticate each other.</p>
      <ul class="list-disc pl-5 mb-4 text-left">
        <li class="mb-2"><strong>Microservices:</strong> mTLS is heavily used in Zero Trust networks (like Kubernetes service meshes) to ensure that only authorized microservices can talk to each other.</li>
        <li class="mb-2"><strong>Client Certificates:</strong> The client must present its own cryptographic certificate to the server during the handshake to gain access.</li>
      </ul>
    </div>
  `,
  exercise: {
    uiType: "drag_and_drop",
    passingThreshold: 1.0,
    categories: ["Standard TLS", "Mutual TLS (mTLS)"],
    concepts: [
      { id: "c1", name: "Only the server presents a certificate", category: "Standard TLS" },
      { id: "c2", name: "Both client and server present certificates", category: "Mutual TLS (mTLS)" },
      { id: "c3", name: "Commonly used in Zero Trust Service Meshes", category: "Mutual TLS (mTLS)" },
      { id: "c4", name: "Standard web browsing (e.g., visiting Wikipedia)", category: "Standard TLS" }
    ]
  }
};

export const SEC_LESSON_12_ZERO_TRUST: Lesson = {
  id: "sec_lesson_12_zero_trust",
  title: "Zero Trust Architecture",
  description: "Never trust, always verify.",
  lessonHtml: `
    <div class="prose prose-orange max-w-none mb-6">
      <h3 class="text-xl font-semibold mb-2">The Death of the Perimeter</h3>
      <p class="mb-4">Historically, companies built a strong firewall (the castle moat) and trusted everyone inside the network. <strong>Zero Trust</strong> assumes the network is already compromised.</p>
      <ul class="list-disc pl-5 mb-4 text-left">
        <li class="mb-2"><strong>Never trust, always verify:</strong> Every single access request (even from inside the VPN) must be fully authenticated, authorized, and encrypted.</li>
        <li class="mb-2"><strong>Micro-segmentation:</strong> Breaking up networks into tiny zones so if an attacker breaches one server, they can't move laterally to others.</li>
      </ul>
    </div>
  `,
  exercise: {
    uiType: "multiple_choice",
    passingThreshold: 1.0,
    categories: ["Castle & Moat (Legacy)", "Zero Trust"],
    concepts: [
      { id: "c1", name: "Trusting any device connected to the internal VPN", category: "Castle & Moat (Legacy)" },
      { id: "c2", name: "Never trust, always verify", category: "Zero Trust" },
      { id: "c3", name: "Micro-segmentation to prevent lateral movement", category: "Zero Trust" },
      { id: "c4", name: "Assuming the internal network is safe", category: "Castle & Moat (Legacy)" },
      { id: "c5", name: "Authenticating every single microservice request", category: "Zero Trust" }
    ]
  }
};

export const SEC_UNIT_4_NETSEC: Unit = {
  id: "sec_unit_4_netsec",
  title: "Network & Infrastructure Security",
  description: "Advanced topics in networking and zero trust.",
  lessons: [SEC_LESSON_10_TLS, SEC_LESSON_11_MTLS, SEC_LESSON_12_ZERO_TRUST]
};

export const SEC_COURSE_2_NETSEC: Course = {
  id: "sec_course_2_netsec",
  title: "Network Security (200 Level)",
  description: "Deep dive into encryption in transit and infrastructure.",
  units: [SEC_UNIT_4_NETSEC]
};

export const SECURITY_ENG_TRACK: Track = {
  id: "track_security_eng",
  title: "Security Engineering Track",
  description: "Master application and network security for engineering interviews.",
  courses: [SEC_COURSE_1_APPSEC, SEC_COURSE_2_NETSEC]
};
