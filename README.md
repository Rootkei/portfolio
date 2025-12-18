# AI-Powered Portfolio Template

A modern, dynamic portfolio website built with vanilla HTML, CSS, and JavaScript. Features a beautiful dark theme with glassmorphism effects, smooth animations, and a powerful admin panel for easy content management.

## ✨ Features

- 🎨 **Modern Design**: Glassmorphism effects, gradient accents, and smooth animations
- 🌙 **Dark Theme**: Eye-friendly dark color scheme with vibrant accent colors
- 📱 **Fully Responsive**: Looks great on desktop, tablet, and mobile devices
- 🔄 **Dynamic Content**: All content loaded from JSON file
- ⚡ **Admin Panel**: Easy-to-use JSON editor with live preview
- 🎯 **Management Dashboard**: User-friendly CRUD interface (Vietnamese)
- 💾 **LocalStorage**: Changes persist in browser
- 📥 **Import/Export**: Download and upload your portfolio data
- 🎭 **Scroll Animations**: Smooth reveal animations as you scroll
- 🚀 **No Dependencies**: Pure HTML, CSS, and JavaScript (no frameworks)

## 🚀 Quick Start

1. **Open the portfolio**:
   - Simply open `index.html` in your web browser
   - Or use a local server (recommended):
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx serve
     ```

2. **Edit your portfolio** (3 ways):
   
   **Option A: Management Dashboard (Recommended)** ⭐
   - Open `manage.html` in your browser
   - Use the tabbed interface to edit all sections
   - Add, edit, or delete items with easy forms
   - Click "Lưu Tất Cả" to save changes
   
   **Option B: Admin Panel**
   - Open `admin.html` in your browser
   - Edit the JSON data directly
   - Click "Save Changes" to update
   - View changes in the live preview
   
   **Option C: Direct JSON Editing**
   - Edit `data/portfolio.json` with your information

3. **Customize your data**:
   - Replace sample data with your own information
   - Upload your profile photo
   - Add your projects and experience

## 📁 Project Structure

```
portfolio/
├── index.html          # Main portfolio page
├── admin.html          # Admin panel for editing
├── css/
│   ├── variables.css   # CSS variables (colors, spacing, etc.)
│   ├── animations.css  # Animation keyframes and utilities
│   └── main.css        # Main stylesheet
├── js/
│   ├── data-loader.js  # JSON data loader
│   ├── main.js         # Main application logic
│   └── admin.js        # Admin panel logic
└── data/
    └── portfolio.json  # Your portfolio data
```

## 📝 Editing Your Portfolio

### Method 1: Admin Panel (Recommended)

1. Open `admin.html` in your browser
2. Edit the JSON in the editor
3. Click "Save Changes"
4. Preview updates in real-time

**Admin Panel Features:**
- ✏️ JSON editor with syntax highlighting
- 👁️ Live preview
- 💾 Save to localStorage
- 📥 Import JSON file
- 📤 Export JSON file
- 🔄 Reset to original data

### Method 2: Direct JSON Editing

Edit `data/portfolio.json` directly:

```json
{
  "personal": {
    "name": "Your Name",
    "title": "Your Title",
    "tagline": "Your tagline",
    "bio": "Your bio",
    "photo": "URL to your photo",
    "email": "your@email.com",
    "phone": "+1234567890",
    "location": "Your City",
    "resume": "URL to your resume"
  },
  "experience": [...],
  "skills": {...},
  "projects": [...],
  "social": [...]
}
```

## 🎨 Customization

### Colors

Edit `css/variables.css` to change colors:

```css
:root {
  --color-accent-primary: #6366f1;    /* Primary accent color */
  --color-accent-secondary: #8b5cf6;  /* Secondary accent color */
  --color-bg-primary: #0a0e27;        /* Background color */
  /* ... more variables */
}
```

### Fonts

Change fonts in `css/variables.css`:

```css
:root {
  --font-family-primary: 'Inter', sans-serif;
}
```

Update the Google Fonts import in `css/main.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=YourFont:wght@400;500;600;700&display=swap');
```

### Sections

Add or remove sections by editing `index.html` and updating the corresponding JavaScript in `js/main.js`.

## 📊 Data Structure

### Personal Information
```json
{
  "personal": {
    "name": "string",
    "title": "string",
    "tagline": "string",
    "bio": "string",
    "photo": "URL",
    "email": "string",
    "phone": "string",
    "location": "string",
    "resume": "URL"
  }
}
```

### Experience
```json
{
  "experience": [
    {
      "company": "string",
      "position": "string",
      "location": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM" | "Present",
      "current": boolean,
      "description": "string",
      "highlights": ["string"],
      "technologies": ["string"]
    }
  ]
}
```

### Skills
```json
{
  "skills": {
    "Category Name": [
      {
        "name": "string",
        "level": 0-100
      }
    ]
  }
}
```

### Projects
```json
{
  "projects": [
    {
      "title": "string",
      "description": "string",
      "image": "URL",
      "technologies": ["string"],
      "github": "URL",
      "demo": "URL",
      "featured": boolean
    }
  ]
}
```

## 🌐 Deployment

### GitHub Pages

1. Push your code to GitHub
2. Go to Settings → Pages
3. Select your branch and `/root` folder
4. Your site will be live at `https://yourusername.github.io/repository-name`

### Netlify

1. Drag and drop your folder to [Netlify](https://app.netlify.com)
2. Your site is live!

### Vercel

```bash
npm i -g vercel
vercel
```

## 🔮 Future Enhancements (Phase 2 & 3)

- 🔌 **Browser Extension**: Sync data from LinkedIn
- 🤖 **AI Integration**: Groq API for AI chatbot
- 📄 **PDF Export**: Generate CV from portfolio data
- 🎯 **Multiple Templates**: Different CV styles
- 📧 **Contact Form**: Working contact form with backend

## 🛠️ Technologies Used

- HTML5
- CSS3 (Custom Properties, Grid, Flexbox)
- Vanilla JavaScript (ES6+)
- Font Awesome Icons
- Google Fonts (Inter)

## 📄 License

MIT License - feel free to use this template for your own portfolio!

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## 💡 Tips

- Use the admin panel to make quick edits
- Export your JSON regularly as backup
- Test on multiple devices for responsiveness
- Optimize images for faster loading
- Use high-quality project screenshots

## 📧 Support

If you have questions or need help, feel free to open an issue!

---

**Made with ❤️ using HTML, CSS, and JavaScript**
