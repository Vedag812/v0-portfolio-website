<div align="center">

# 🎬 Vedant Agarwal — Portfolio

**A Netflix-inspired, full-stack portfolio website with CMS, live data integrations, and premium animations.**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vedant-agarwal-812.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

[Live Demo](https://vedant-agarwal-812.vercel.app) · [Report Bug](https://github.com/Vedag812/v0-portfolio-website/issues) · [Request Feature](https://github.com/Vedag812/v0-portfolio-website/issues)

</div>

---

## ✨ Features

### 🎥 Netflix-Themed UI
- **Profile selection screen** — "Who's watching?" style with Recruiter, Student, and Explorer profiles
- **Cinematic hero sections** with background GIFs and gradient overlays
- **Custom 404 page** with glitching text animation and floating particles
- **Dark theme** with Netflix red accents throughout

### 📊 Live Data Integrations
- **LeetCode Stats** — Real-time problem count, ranking, streak, and difficulty breakdown via LeetCode's GraphQL API
- **Explorer Page** — Live articles from **Dev.to** and **Hacker News**, auto-refreshed hourly
- **GitHub Repos** — Auto-fetched project data from GitHub API

### 🛠️ Content Management System (CMS)
- **Admin Dashboard** (`/admin`) — Edit all site content, projects, and media
- **Redis-backed storage** via Upstash — all content changes persist instantly
- **Real-time updates** — edits reflect on the live site immediately

### 🎨 Visual Polish
- **Scroll-reveal animations** — Sections fade in as you scroll
- **Card shimmer effect** — Light sweep on hover
- **Gradient borders** — Red glow on card hover
- **Staggered grid entrance** — Project cards cascade in with delays
- **Glassmorphism** — Frosted glass effects on contact cards
- **GSAP animations** — 3D card perspective effects on the profile page

### 📱 Responsive Design
- Fully responsive across desktop, tablet, and mobile
- Optimized touch interactions for mobile users
- Adaptive layouts (3-col → 2-col → 1-col grids)

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4 |
| **Database** | Upstash Redis |
| **Animations** | GSAP, CSS keyframes |
| **Deployment** | Vercel |
| **Analytics** | Vercel Analytics |
| **Font** | Geist Sans & Mono |

---

## 📁 Project Structure

```
├── app/
│   ├── about/          # About page
│   ├── admin/          # CMS admin dashboard
│   ├── api/            # API routes
│   │   ├── content/    # CMS content CRUD
│   │   ├── explorer/   # Live articles (Dev.to + HN)
│   │   ├── leetcode/   # LeetCode stats
│   │   ├── projects/   # Projects CRUD
│   │   └── verify/     # Admin auth
│   ├── browse/         # Profile selection
│   ├── contact/        # Contact page
│   ├── experience/     # Experience page
│   ├── explorer/       # Tech articles & movies
│   ├── projects/       # Projects grid
│   └── skills/         # Skills + LeetCode stats
├── components/         # React components
├── data/               # Static data (projects.json)
├── hooks/              # Custom hooks
└── lib/                # Utilities
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Vedag812/v0-portfolio-website.git
cd v0-portfolio-website

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```env
ADMIN_TOKEN=your_admin_password
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
GITHUB_TOKEN=your_github_pat          # optional, for private repos
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## 📸 Screenshots

| Home | Projects | Explorer |
|------|----------|----------|
| Netflix-style splash | 3-column grid with filters | Live AI/tech articles |

| Skills + LeetCode | Contact | 404 Page |
|-------------------|---------|----------|
| Stats card with progress bars | Glassmorphism form | Glitching "404" text |

---

## 🔑 Key Pages

| Route | Description |
|-------|-------------|
| `/` | Cinematic splash screen |
| `/browse` | Netflix "Who's watching?" profile picker |
| `/about` | Bio, education, skills, languages |
| `/skills` | Skill categories + LeetCode stats card |
| `/projects` | Responsive project grid with category filters |
| `/experience` | Work experience timeline |
| `/contact` | Contact form + social links |
| `/explorer` | Live tech articles, movies & career posts |
| `/admin` | CMS dashboard (password-protected) |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ by [Vedant Agarwal](https://github.com/Vedag812)**

</div>