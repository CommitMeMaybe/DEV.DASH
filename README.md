# SYS.DEV — Developer Dashboard

A retro-terminal inspired developer dashboard for tracking GitHub activity, managing tasks, monitoring weather, and analyzing productivity — all in one place.

## Features

### GitHub Activity Dashboard
- **Command Center** — Real-time metrics: commit streak, weekly commits, PR merge rate, and stars gained
- **Activity Snapshot** — Weekly commit distribution chart
- **Contribution Heatmap** — GitHub-style calendar heatmap with green intensity scaling
- **SYS.INSIGHT** — Automated text insights and warnings about your coding patterns
- **Repo Explorer** — Full repository browser with search, language filtering, and user profile display

### Analytics Engine
- **Commits Over Time** — Bar chart with 7d / 30d / 90d range filtering
- **PR Performance** — Line chart tracking merged vs. open pull requests
- **Activity Trends** — Area chart of daily event activity
- **Impact Analysis** — Summary metrics for commits, merge rate, streak, and repos

### Task Management
- Full CRUD task manager with split-panel layout
- Task search, tabs (Active / Done / All)
- Inline editing with character and word count
- Auto-saved to localStorage

### Weather Center
- Current conditions with retro-green temperature display
- 7-day forecast, air quality index, UV index
- Sunrise / sunset times
- Contextual weather messages

### Design
- Dark theme with neon green accent (#00ff99)
- Retro-tech aesthetic using VT323 and JetBrains Mono fonts
- Skeleton loading states on every page
- Fully responsive: mobile, tablet, and desktop
- Slide-out sidebar navigation on mobile

## Built With

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev) | UI framework |
| [Vite 8](https://vitejs.dev) | Build tool and dev server |
| [React Router 7](https://reactrouter.com) | Client-side routing |
| [Recharts](https://recharts.org) | Interactive charts |
| [Lucide React](https://lucide.dev) | Icon set |
| [DOM Purify](https://github.com/cure53/DOMPurify) | Input sanitization |
| [JetBrains Mono](https://www.jetbrains.com/lp/mono/) | Primary font |
| [VT323](https://fonts.google.com/specimen/VT323) | Retro accent font |

## External APIs

| API | Required | Purpose |
|---|---|---|
| [GitHub REST API v3](https://docs.github.com/en/rest) | Yes | User profiles, repos, events, commits, pull requests |
| [OpenWeatherMap API](https://openweathermap.org/api) | Yes | Current weather, forecast, air quality, UV index |

> **Note:** Unauthenticated GitHub API requests are limited to 60/hr. Set `VITE_GITHUB_TOKEN` for a higher limit (5000/hr).

## Getting Started

### Prerequisites
- Node.js >= 18
- npm

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd devdash

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
```

### Environment Variables

Create `.env.local` in the project root:

```env
# Required: OpenWeatherMap API key
# Get one at: https://openweathermap.org/api
VITE_OPENWEATHER_API_KEY=your_api_key_here

# Optional: GitHub Personal Access Token
# Increases rate limit from 60 to 5000 requests/hour
# Create at: https://github.com/settings/tokens
VITE_GITHUB_TOKEN=your_token_here
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── App.jsx                  # Root component with routes
├── App.css
├── index.css                # Global styles and CSS custom properties
├── main.jsx                 # Entry point
├── components/
│   ├── Sidebar.jsx          # Navigation sidebar with mobile drawer
│   ├── Sidebar.css
│   ├── OnboardingModal.jsx  # First-time user setup modal
│   ├── github/
│   │   ├── ContributionHeatmap.jsx  # GitHub-style activity heatmap
│   │   ├── ContributionHeatmap.css
│   │   ├── RepoCard.jsx
│   │   ├── RepoList.jsx
│   │   └── UserProfile.jsx
│   ├── tasks/
│   │   ├── TaskForm.jsx
│   │   ├── TaskItem.jsx
│   │   └── TaskList.jsx
│   ├── dashboard/
│   │   ├── StatCard.jsx
│   │   ├── WeatherWidget.jsx
│   │   └── QuickTaskPreview.jsx
│   └── ui/
│       ├── PrimaryButton.jsx
│       ├── Skeleton.jsx
│       ├── Card.jsx
│       ├── Badge.jsx
│       └── ...
├── hooks/
│   ├── useGitHub.js         # GitHub data fetching with caching
│   ├── useWeather.js        # Weather data fetching with caching
│   ├── useTasks.js          # Task CRUD with localStorage persistence
│   └── useAuth.js           # Session-based local auth
├── pages/
│   ├── Landing.jsx          # Marketing / hero page
│   ├── Login.jsx            # Session login
│   ├── Dashboard.jsx        # Main command center
│   ├── Analytics.jsx        # Charts and metrics
│   ├── Tasks.jsx            # Task manager
│   ├── Weather.jsx          # Weather center
│   ├── GitHub.jsx           # Repository browser
│   └── NotFound.jsx         # 404 page
└── utils/
    ├── sanitize.js          # Input sanitization helpers
    └── constants.js         # App constants
```

## Responsive Breakpoints

| Breakpoint | Target | Behavior |
|---|---|---|
| 1024px | Tablet landscape | Sidebar shrinks, grids collapse |
| 768px | Tablet portrait / large phone | Sidebar becomes slide-out drawer, single-column layouts |
| 640px | Mobile | Full-width buttons, stacked nav |
| 480px | Small mobile | Reduced font sizes, compact spacing |

## Design System

### Colors
- Background: `#0f1115`
- Surface: `#1a1d24`
- Accent: `#00ff99` (green)
- Text primary: `#e2e8f0`
- Text secondary: `#94a3b8`
- Border: `#334155`

### Fonts
- **JetBrains Mono** — Body text, code, UI labels
- **VT323** — Retro display text, metrics, page titles, decorative elements

## License

MIT
