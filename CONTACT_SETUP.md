# Contact Form Setup Guide

## Current Status
The contact form is currently configured to send emails to: **vvenuth1@asu.edu**

## How to Set Up EmailJS (Recommended)

### Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### Step 2: Create Email Service
1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose "Gmail" (recommended) or your preferred email provider
4. Connect your ASU email account (vvenuth1@asu.edu) or Gmail for forwarding
5. Note down your **Service ID** (e.g., `service_gmail`)

### Step 3: Create Email Template
1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use this template structure:

```
Subject: New Contact Form Message: {{subject}}

From: {{from_name}} ({{from_email}})
Subject: {{subject}}

Message:
{{message}}

---
This message was sent from your portfolio contact form.
```

4. Save the template and note down your **Template ID** (e.g., `template_contact`)

### Step 4: Get Public Key
1. Go to "Account" > "General"
2. Find your **Public Key** (e.g., `your_public_key_here`)

### Step 5: Update Your Code
Replace the placeholder values in `assets/js/script.js`:

```javascript
// Line 289-293, replace with your actual values:
await emailjs.send(
  'your_service_id',     // Replace with your Service ID
  'your_template_id',    // Replace with your Template ID
  templateParams,
  'your_public_key'      // Replace with your Public Key
);
```

### Step 6: Initialize EmailJS (Optional)
Uncomment and update line 260 in `assets/js/script.js`:
```javascript
emailjs.init("your_public_key_here");
```

## Alternative: Form Submission Services

If you prefer not to use EmailJS, you can use these alternatives:

### 1. Formspree
- Go to [Formspree.io](https://formspree.io/)
- Create account and get form endpoint
- Update form action in HTML

### 2. Netlify Forms (if hosting on Netlify)
- Add `netlify` attribute to form
- Add `data-netlify="true"` to form element

### 3. Custom Backend
- Create your own backend API
- Use Node.js with Nodemailer
- Deploy on Heroku, Vercel, or AWS

## Current Fallback Behavior
Without EmailJS setup, the form will:
- Show a success message
- Log form data to browser console
- Display your email for direct contact

## Testing
1. Fill out the contact form
2. Check browser console for form data
3. Verify EmailJS dashboard for sent emails (once configured)

## Security Notes
- Never expose private keys in frontend code
- EmailJS public key is safe to use in frontend
- Consider rate limiting for production use
