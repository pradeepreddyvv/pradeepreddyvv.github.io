// Portfolio JavaScript - Enhanced Version
// DOM Elements
const loader = document.getElementById('loader');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const scrollTopBtn = document.getElementById('scroll-top');
const contactForm = document.getElementById('contact-form');

// Enhanced loader with smooth fade out
window.addEventListener('load', () => {
  // Ensure minimum loading time for smooth UX
  setTimeout(() => {
    if (loader) {
      loader.style.opacity = '0';
      loader.style.transform = 'scale(0.9)';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }
  }, 1800);
});

// Mobile Navigation
if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
}

// Close mobile menu when clicking on nav links
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (hamburger && navMenu) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
});

// Scroll to top functionality
window.addEventListener('scroll', () => {
  if (scrollTopBtn) {
    if (window.pageYOffset > 300) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  }
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section');
  const scrollPos = window.pageYOffset + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      navLinks.forEach(link => link.classList.remove('active'));
      if (correspondingLink) {
        correspondingLink.classList.add('active');
      }
    }
  });
});

// Enhanced typing animation with your actual roles
document.addEventListener('DOMContentLoaded', () => {
  if (typeof Typed !== 'undefined' && document.querySelector('.typing-text')) {
    const typed = new Typed('.typing-text', {
      strings: [
        'Full Stack Development',
        'Backend Development',
        'Frontend Development',
        'Web Development',
        'API Integration Specialist',
        'Machine Learning',
        'Deep Learning',
        'Computer Vision',
        'Software Development'
      ],
      typeSpeed: 80,
      backSpeed: 60,
      backDelay: 1500,
      loop: true,
      showCursor: true,
      cursorChar: '|'
    });
  }
});

// Enhanced skills loading with animations
async function loadSkills() {
  try {
    const response = await fetch('./skills.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const skills = await response.json();
    const skillsContainer = document.getElementById('skills-container');
    
    if (skillsContainer && Array.isArray(skills)) {
      skillsContainer.innerHTML = skills.map((skill, index) => `
        <div class="skill-item" style="animation-delay: ${index * 0.1}s">
          <img src="${skill.icon}" alt="${skill.name || 'Skill'}" class="skill-icon" loading="lazy" onerror="this.onerror=null; this.src='https://via.placeholder.com/48/3b82f6/ffffff?text=${encodeURIComponent(skill.name?.charAt(0) || 'S')}';">
          <div class="skill-name">${skill.name || 'Skill'}</div>
        </div>
      `).join('');
      
      // Add stagger animation
      const skillItems = skillsContainer.querySelectorAll('.skill-item');
      skillItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(() => {
          item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, index * 100);
      });
    } else {
      throw new Error('Skills container not found or skills data is not an array');
    }
  } catch (error) {
    console.error('Error loading skills:', error);
    loadFallbackSkills();
  }
}

// Enhanced fallback skills with better error handling
function loadFallbackSkills() {
  const fallbackSkills = [
    { name: 'JavaScript', icon: 'https://img.icons8.com/color/48/000000/javascript.png' },
    { name: 'React', icon: 'https://img.icons8.com/color/48/000000/react-native.png' },
    { name: 'Node.js', icon: 'https://img.icons8.com/color/48/000000/nodejs.png' },
    { name: 'HTML5', icon: 'https://img.icons8.com/color/48/000000/html-5.png' },
    { name: 'CSS3', icon: 'https://img.icons8.com/color/48/000000/css3.png' },
    { name: 'Python', icon: 'https://img.icons8.com/color/48/000000/python.png' },
    { name: 'Java', icon: 'https://img.icons8.com/color/48/000000/java-coffee-cup-logo.png' },
    { name: 'MongoDB', icon: 'https://img.icons8.com/color/48/000000/mongodb.png' }
  ];
  
  const skillsContainer = document.getElementById('skills-container');
  if (skillsContainer) {
    skillsContainer.innerHTML = fallbackSkills.map((skill, index) => `
      <div class="skill-item" style="animation-delay: ${index * 0.1}s">
        <img src="${skill.icon}" alt="${skill.name}" class="skill-icon" loading="lazy" onerror="this.onerror=null; this.src='https://via.placeholder.com/48/3b82f6/ffffff?text=${skill.name.charAt(0)}';">
        <div class="skill-name">${skill.name}</div>
      </div>
    `).join('');
    
    // Add stagger animation for fallback too
    const skillItems = skillsContainer.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      setTimeout(() => {
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }
}

// Enhanced projects loading with animations
function loadProjects() {
  const projects = [
    {
      title: "BuildMyWeb (Image to HTML Code)",
      description: "Developed a CV pipeline to convert hand-drawn wireframes into HTML/CSS using OpenCV and a custom TensorFlow CNN+CTC model, achieving 95% text recognition accuracy. Also created a React-based editor for real-time UI customization, cutting prototyping time by 30%.",
      image: "./assets/images/projects/placeholder-proj-1.svg",
      tags: ["OpenCV", "TensorFlow", "CNN", "CTC", "React", "HTML/CSS"],
      github: "https://github.com/pradeepreddyvv",
      demo: "#"
    },
    {
      title: "Smart Driving Assistance (Springer Nature Publication)",
      description: "Co-authored research on a driver assistance system with lane detection achieving 95%+ reliability. Trained YOLO + CNN models on the GTSRB dataset to 90%+ accuracy for traffic sign recognition and integrated voice alerts.",
      image: "./assets/images/projects/placeholder-proj-2.svg",
      tags: ["YOLO", "CNN", "Python", "Multi-threading", "Computer Vision"],
      github: "https://github.com/pradeepreddyvv",
      demo: "#",
      paper: "#" // Springer link would go here
    }
  ];

  const projectsContainer = document.getElementById('projects-container');
  
  if (projectsContainer) {
    projectsContainer.innerHTML = projects.map((project, index) => `
      <div class="project-card" style="animation-delay: ${index * 0.2}s">
        <img src="${project.image}" alt="${project.title}" class="project-image" loading="lazy" onerror="this.onerror=null; this.src='https://via.placeholder.com/350x200/f59e0b/ffffff?text=${encodeURIComponent(project.title)}';">
        <div class="project-info">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="project-tags">
            ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
          <div class="project-links">
            <a href="${project.github}" target="_blank" class="project-link" rel="noopener noreferrer">
              <i class="fab fa-github"></i> Code
            </a>
            ${project.paper ? `<a href="${project.paper}" target="_blank" class="project-link" rel="noopener noreferrer">
              <i class="fas fa-file-alt"></i> Paper
            </a>` : `<a href="${project.demo}" target="_blank" class="project-link" rel="noopener noreferrer">
              <i class="fas fa-external-link-alt"></i> Demo
            </a>`}
          </div>
        </div>
      </div>
    `).join('');
    
    // Add stagger animation
    const projectCards = projectsContainer.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      setTimeout(() => {
        card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 200);
    });
  }
}

// Initialize EmailJS (replace with your own public key)
// Comment this out if you don't have EmailJS set up yet
// emailjs.init("YOUR_PUBLIC_KEY");

// Enhanced contact form handling with EmailJS
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state with enhanced animation
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    submitBtn.style.transform = 'scale(0.98)';
    
    try {
      // Get form data
      const formData = new FormData(contactForm);
      
      // Check if EmailJS is available
      if (typeof emailjs !== 'undefined') {
        // Using your actual EmailJS credentials
        await emailjs.send(
          'service_rq2vqsq', // Your EmailJS service ID
          'template_ii7hxhu', // Your EmailJS template ID
          {
            subject: formData.get('subject'),
            from_name: formData.get('from_name'),
            from_email: formData.get('from_email'),
            message: formData.get('message'),
            email: formData.get('from_email')
          }
        );
        
        showMessage('✨ Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();
        
        // Add success animation
        submitBtn.style.background = 'var(--gradient-accent)';
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
      } else {
        // Fallback: Log form data and show success message
        console.log('Contact Form Submission:', {
          subject: formData.get('subject'),
          from_name: formData.get('from_name'),
          from_email: formData.get('from_email'),
          message: formData.get('message')
        });
        showMessage('✨ Message received! I\'ll get back to you soon. (Note: EmailJS not configured yet)', 'success');
        contactForm.reset();
        
        submitBtn.style.background = 'var(--gradient-accent)';
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Received!';
      }
      
    } catch (error) {
      console.error('Error sending email:', error);
      showMessage('❌ Failed to send message. Please email me directly at vvenuth1@asu.edu', 'error');
    } finally {
      // Reset button after delay
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.style.transform = 'scale(1)';
        submitBtn.style.background = '';
      }, 2000);
    }
  });
}

// Show success/error messages
function showMessage(message, type) {
  const existingMessage = document.querySelector('.message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}-message`;
  messageDiv.textContent = message;
  
  const form = document.querySelector('.contact-form');
  if (form) {
    form.insertBefore(messageDiv, form.firstChild);
    
    // Remove message after 5 seconds
    setTimeout(() => {
      messageDiv.remove();
    }, 5000);
  }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Enhanced initialization with performance optimization
document.addEventListener('DOMContentLoaded', () => {
  // Use requestAnimationFrame for smooth initialization
  requestAnimationFrame(() => {
    loadSkills();
    loadProjects();
  });
  
  // Emergency loader removal with better detection
  setTimeout(() => {
    if (loader && getComputedStyle(loader).display !== 'none') {
      console.warn('Emergency loader removal triggered');
      loader.style.opacity = '0';
      loader.style.transform = 'scale(0.8)';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 300);
    }
  }, 4000);
  
  // Add page loaded class for CSS animations
  setTimeout(() => {
    document.body.classList.add('page-loaded');
  }, 500);
});

// Animate elements on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all animatable elements when they exist
setTimeout(() => {
  const animateElements = document.querySelectorAll('.skill-item, .project-card, .experience-card, .timeline-content, .stat');
  
  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}, 1000);