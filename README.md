# Archon Trading Platform

A modern, premium trading platform user interface built purely with semantic HTML5 and modern CSS3. No JavaScript frameworks, no CSS libraries—just clean, responsive, and performant code.

## 🌟 Features

- **Modern Web Technologies**: Built with HTML5, CSS3, and Vanilla JavaScript. No bloated frameworks like Bootstrap or Tailwind required.
- **Premium Aesthetics**: Dark professional theme featuring glassmorphism, smooth gradients, and soft shadows.
- **Fully Responsive**: Mobile-first approach scaling up beautifully to tablet and desktop.
- **Interactivity & UI**:
  - Interactive mobile navigation drawer (using the CSS checkbox hack).
  - Expanding/collapsing FAQ accordion.
  - Animated billing toggle switch.
- **Visualizations**:
  - Hero section Candlestick Chart.
  - Portfolio Allocation Donut Chart.
  - P&L Area and Bar Charts.
  - Market trend Sparklines.
- **Advanced Animations**: Floating elements, pulsing indicators, infinite ticker tape, and smooth hover transformations.

## 📁 Project Structure

```text
├── index.html          # Home Page
├── markets.html        # Markets Overview
├── dashboard.html      # User Dashboard UI
├── pricing.html        # Subscription/Pricing Plans
├── academy.html        # Educational Resources
├── about.html          # Company Information & Team
├── contact.html        # Contact Form & Locations
├── login.html          # User Authentication (Login)
├── register.html       # User Authentication (Sign Up)
├── wallet.html         # Wallet UI
├── portfolio-reports.html # Portfolio Reports
├── account-settings.html # Account Settings
├── billing.html        # Billing Information
├── security-settings.html # Security Settings
├── transaction-history.html # Transaction History
├── script.js           # Core Interactivity & Auth Logic
├── trading.js          # Trading Modal & Mock Execution
└── css/
    ├── variables.css   # Design tokens (Colors, Typography, Spacing)
    ├── base.css        # Resets, Globals, Utility classes, Animations
    ├── nav.css         # Navigation bar & Mobile menu styles
    ├── footer.css      # Universal footer styles
    ├── home.css        # Styles specific to the Home page
    ├── markets.css     # Styles specific to the Markets page
    ├── dashboard.css   # Styles specific to the Dashboard page
    ├── pricing.css     # Styles specific to the Pricing page
    ├── academy.css     # Styles specific to the Academy page
    ├── about.css       # Styles specific to the About page
    ├── contact.css     # Styles specific to the Contact page
    └── auth.css        # Shared styles for Login and Register pages
```

## 🚀 Getting Started

Because this project is built entirely with static HTML, CSS, and Vanilla JS, there are no dependencies to install or build processes to run.

### Option 1: Direct File Viewing
Simply navigate to the project directory in your file explorer and double-click `index.html` to open it in your default web browser.

### Option 2: Local Development Server
To view the site over localhost (recommended for accurate relative path resolution):
1. Open your terminal.
2. Navigate to the project directory:
   ```bash
   cd "path/to/Project Archon"
   ```
3. Start a simple Python HTTP server:
   ```bash
   python3 -m http.server 8000
   ```
4. Open your browser and navigate to `http://localhost:8000`.

## 🎨 Design System

This project utilizes a scalable CSS Variable-based design system located in `css/variables.css`. To adjust the theme, simply modify the variables in the `:root` pseudo-class.

- **Primary Accent**: `#00E676`
- **Secondary Accent**: `#2962FF`
- **Background Primary**: `#0B1220`
- **Typography**: Inter (Primary text), JetBrains Mono (Financial numbers)

## 📝 License

This project is open-source and available for personal or portfolio use.
