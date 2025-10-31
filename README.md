# Blann's Developer Portfolio

A modern, responsive developer portfolio website with interactive particle background effects that respond to mouse movements.

## 🌟 Features

- **Interactive Background**: Canvas-based particle animation with mouse interaction
- **Multi-Page Layout**:

  - Home: Hero section with call-to-action buttons
  - About: Personal information, skills, and detailed work history
  - Projects: Showcase of 6 sample projects with descriptions
  - Contact: Contact form and social media links

- **Responsive Design**: Fully responsive across all devices
- **Modern UI/UX**:

  - Gradient effects
  - Smooth animations
  - Card-based layouts
  - Hover effects
  - Glassmorphism design

- **Social Media Integration**: Links to:

  - GitHub
  - LinkedIn
  - Facebook
  - Email

- **Work Experience Timeline**: Visual timeline showing job history from 2018 to present

## 📁 Structure

```
blanns-portfolio/
├── css/
│   └── style.css       # All styles including animations
├── js/
│   └── main.js         # Interactive background & form handling
├── images/             # (Ready for your images)
├── index.html          # Home page
├── about.html          # About page with experience
├── projects.html       # Projects showcase
└── contact.html        # Contact form & social links
```

## 🎨 Features Breakdown

### Interactive Background

- Particle system with 100+ animated particles
- Particles respond to mouse movement
- Connected particles with dynamic lines
- Smooth animations using RequestAnimationFrame
- Cursor glow effect

### Work Experience Section

- Timeline layout (2018-Present)
- 4 positions included:
  - Web Development Intern (2018-2019)
  - Junior Web Developer (2019-2021)
  - Full Stack Developer (2021-2023)
  - Senior Full Stack Developer (2023-Present)

### Skills Section

- Frontend: React, Vue, Angular, TypeScript
- Backend: Node.js, Python, Django, Flask
- Tools: Docker, AWS, CI/CD

### Contact Page

- Working contact form (with demo alert)
- Social media links with icons
- Email contact
- Interactive hover effects

## 🚀 How to Use

1. Open `index.html` in your web browser
2. Customize the content:
   - Update personal information in all HTML files
   - Replace placeholder text with your actual experience
   - Add your real social media links in `contact.html`
   - Update email addresses

## 🎯 Customization Tips

### Colors

Edit the CSS variables in `style.css`:

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --accent-color: #f093fb;
}
```

### Social Links

Update in `contact.html`:

- GitHub: Line 73
- LinkedIn: Line 81
- Facebook: Line 89
- Email: Lines 97, 143

### Projects

Add your real projects in `projects.html` - replace the placeholder gradients with actual project images.

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 📱 Responsive Breakpoints

- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

## 💻 Technologies Used

- HTML5
- CSS3 (Flexbox, Grid, Animations)
- Vanilla JavaScript (ES6+)
- Canvas API for particle effects

## ✨ Special Effects

1. **Particle System**: Mouse-interactive particles with connection lines
2. **Cursor Glow**: Radial gradient follows cursor
3. **Scroll Animations**: Elements fade in on scroll
4. **Navbar Effect**: Changes on scroll
5. **Card Hover Effects**: Transform and shadow on hover
6. **Timeline Animations**: Staggered fade-in effects

## 📝 Notes

- The contact form currently shows a demo alert. To make it functional, you'll need to add backend handling or use a service like Formspree, EmailJS, or Netlify Forms.
- Social media URLs are placeholders - update them with your actual profiles.
- Add your own images to the `images/` folder and update references in HTML.

---

**Created with modern web technologies for a stunning developer portfolio experience!** 🚀

