# 🚀 Venkata Pradeep Reddy Venuthurla - Portfolio Website

> **Modern Tab-Based Portfolio** | Software Engineer | AI/ML Systems | Distributed Applications

A clean, professional, and **fully responsive** portfolio website with **tab-based navigation**. Each section displays separately when clicked - no scrolling through a long page!

## ✨ **Key Features**

### 🎯 **Tab-Based Navigation**
- **Separate sections** - Click a tab to view only that content
- **No endless scrolling** - Each section is isolated and focused
- **Smooth transitions** - Elegant fade-in animations between tabs
- **Mobile-friendly menu** - Hamburger menu for mobile devices

### 📱 **Fully Responsive Design**
- **Mobile-optimized** - Perfect layout on phones and tablets
- **Desktop-optimized** - Beautiful experience on large screens
- **Adaptive grid** - Content adjusts based on screen size
- **Touch-friendly** - Easy navigation on touch devices

### 🎨 **Modern Professional Design**
- **Clean aesthetics** - Minimalist design with professional color scheme
- **Smooth animations** - Subtle transitions and hover effects
- **Readable typography** - Poppins font family for clarity
- **Visual hierarchy** - Clear content organization

### 🔧 **Technical Excellence**
- **Fast loading** - Optimized assets and minimal dependencies
- **No external CSS files** - Everything inline for speed
- **Dynamic content** - Skills and projects loaded from JSON
- **Contact form** - Integrated EmailJS for messaging

## 📋 **Sections**

### 1️⃣ **Home**
- Professional introduction
- Tagline: "Software Engineer | AI Systems & Distributed Applications"
- Direct links to resume download and contact
- Social media connections (LinkedIn, GitHub, LeetCode)
- Professional profile photo

### 2️⃣ **About**
- Detailed professional summary
- Key achievements and expertise
- Statistics showcase:
  - 7000+ API Endpoints Managed
  - 60% Efficiency Improvement
  - 95% ML Model Accuracy
  - 50% Cost Reduction (AWS)

### 3️⃣ **Education**
- **Master of Science in Computer Science** - Arizona State University (2026)
- **Bachelor of Technology in CSE** - PES University (2023)
- Relevant coursework and academic achievements

### 4️⃣ **Experience**
- **IDFC First Bank** - Software Engineer (2023-2025)
- **IDFC First Bank** - Application Engineer Intern (2023)
- **Arternal** - ML Engineer Intern (2021)
- Detailed responsibilities and achievements for each role

### 5️⃣ **Projects**
Featured projects with descriptions, tech stack, and links:
- **OmniSense** - HackASU 2025 Winner (7-agent AI platform)
- **BuildMyWeb** - CV pipeline for wireframe to HTML conversion
- **Smart Driving Assistance** - Springer Nature publication
- **Distributed Database System** - Raft consensus implementation

### 6️⃣ **Skills**
Comprehensive tech stack organized in a visual grid:
- **Languages**: Python, Java, JavaScript, TypeScript, C/C++, Go, Ruby
- **Frameworks**: Spring Boot, React.js, Flask, MuleSoft, Next.js
- **Databases**: DynamoDB, MySQL, PostgreSQL, MongoDB, Redis, Elasticsearch
- **Cloud & DevOps**: AWS, GCP, Docker, Kubernetes, Kafka, Spark
- **AI/ML**: TensorFlow, PyTorch, OpenCV

### 7️⃣ **Contact**
- Email: vvenuth1@asu.edu
- Phone: +1 (623) 273-0305
- Location: Tempe, Arizona, USA
- Working contact form with EmailJS integration

## 🎨 **Design Highlights**

### Color Palette
- **Primary**: Blue (#1e3a8a, #3b82f6) - Professional and trustworthy
- **Secondary**: Amber (#f59e0b) - Warm accent color
- **Accent**: Emerald (#10b981) - Success and growth
- **Background**: Light gray (#f9fafb) - Clean and modern

### Typography
- **Font Family**: Poppins (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800
- **Hierarchy**: Clear size differences for headings

### Responsive Breakpoints
- **Desktop**: > 768px (full layout)
- **Mobile**: ≤ 768px (stacked layout, hamburger menu)

## 🚀 **Quick Start**

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/pradeepreddyvv/pradeepreddyvv.github.io.git
   cd pradeepreddyvv.github.io
   ```

2. **Start a local server**:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # OR using Node.js
   npx http-server
   ```

3. **Open in browser**:
   ```
   http://localhost:8000
   ```

### Deploy to GitHub Pages

1. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Update portfolio"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to repository Settings
   - Navigate to Pages
   - Select "main" branch as source
   - Save

3. **Visit your site**:
   ```
   https://pradeepreddyvv.github.io
   ```

## 📂 **Project Structure**

```
pradeepreddyvv.github.io/
├── index.html                    # Main HTML with inline CSS & JS
├── skills.json                   # Skills data
├── Venkata_Pradeep_Reddy_Venuthurla.pdf  # Resume PDF
├── assets/
│   ├── images/
│   │   ├── avatar.jpg           # Profile photo
│   │   ├── educat/              # Education logos
│   │   ├── experience/          # Company logos
│   │   └── projects/            # Project images
│   ├── css/
│   │   └── style.css            # (Legacy - now inline)
│   └── js/
│       └── script.js            # (Legacy - now inline)
├── CONTACT_SETUP.md             # EmailJS setup guide
└── README.md                    # This file
```

## ⚙️ **Customization**

### Update Skills
Edit `skills.json`:
```json
{
  "name": "Your Skill",
  "icon": "https://img.icons8.com/color/48/your-skill.png"
}
```

### Update Projects
Edit the `projects` array in `index.html` (search for "Load Projects"):
```javascript
{
  title: "Project Name",
  description: "Project description...",
  image: "./assets/images/projects/yourproject.png",
  tags: ["Tech1", "Tech2"],
  github: "https://github.com/yourrepo",
  demo: "https://yourdemo.com"
}
```

### Update Contact Info
Search for contact details in `index.html` and update:
- Email address
- Phone number
- Location
- Social media links

### Change Colors
Update CSS variables in the `<style>` section:
```css
:root {
  --primary: #1e3a8a;
  --secondary: #f59e0b;
  --accent: #10b981;
}
```

## 🔒 **Contact Form Setup**

The contact form uses EmailJS. To enable it:

1. **Create EmailJS account**: https://www.emailjs.com/
2. **Get your credentials**:
   - Service ID
   - Template ID
   - Public Key
3. **Update in index.html** (search for "emailjs.send"):
   ```javascript
   await emailjs.send(
     'your_service_id',
     'your_template_id',
     {...}
   );
   ```

See `CONTACT_SETUP.md` for detailed instructions.

## 🌟 **Features in Detail**

### Tab Navigation System
- **JavaScript-powered** - No page reloads
- **Deep linking ready** - Can be extended to support URL hash routing
- **Keyboard accessible** - Tab through navigation
- **Screen reader friendly** - Semantic HTML structure

### Performance Optimizations
- **Inline CSS** - No external stylesheet blocking
- **Lazy image loading** - Images load on demand
- **Minimal JavaScript** - Clean, efficient code
- **CDN resources** - Font Awesome and Typed.js from CDN

### Mobile Experience
- **Touch-optimized** - Large tap targets
- **Readable text** - Proper font scaling
- **Fast loading** - Optimized for mobile networks
- **Portrait/landscape** - Works in both orientations

## 📊 **Browser Support**

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## 🤝 **Contributing**

Feel free to fork this repository and customize it for your own use!

## 📄 **License**

MIT License - Feel free to use this template for your own portfolio.

## 📧 **Contact**

**Venkata Pradeep Reddy Venuthurla**
- 📧 Email: vvenuth1@asu.edu
- 💼 LinkedIn: [linkedin.com/in/pradeepreddyvv](https://linkedin.com/in/pradeepreddyvv)
- 🐙 GitHub: [github.com/pradeepreddyvv](https://github.com/pradeepreddyvv)
- 💻 LeetCode: [leetcode.com/pradeepreddyvv](https://leetcode.com/pradeepreddyvv)

---

**Built with ❤️ and modern web technologies**

*Software Engineer | AI Systems & Distributed Applications | MSCS @ASU | Open Summer '26*