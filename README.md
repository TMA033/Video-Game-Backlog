# Game Tracker

A full-stack web application built with **React 19**, **Vite**, **Express 5**, and **CSS3** that enables users to browse, search, and inspect video games using live metadata from the **Internet Game Database (IGDB) API**.

---

## Features

### Current Features
* **IGDB Proxy Backend:** Express server manages Twitch OAuth2 client credential handshakes, automated token regeneration, and query routing to avoid browser CORS blocks and protect API secrets.
* **Game Discovery & Live Search:** Fetches popular titles filtered by community hype and handles dynamic search queries with release date, cover art, and aggregate score parsing.
* **Component-Based Catalog Grid:** Decoupled `GameGrid` and `GameCard` architecture featuring hover effects, responsive CSS grid scaling, and rating badges.
* **Detailed Game Pages (`/games/:slug`):** Dynamic routing displaying storylines, summaries, publisher/developer credits, and genre tags.
* **Interactive Media Showcase:**
  * Embedded YouTube trailers and high-res screenshots with a synchronized thumbnail strip.
  * Horizontal mouse-wheel thumbnail scrolling and auto-centering on the active asset.
  * Fullscreen lightbox modal with keyboard/button arrow navigation.
* **Live Release Countdown:** Client-side interval counter calculating days, hours, minutes, and seconds until unreleased titles launch.

### In Active Development (Roadmap)
* [ ] LocalStorage / database persistence for user library and backlog tracking.
* [ ] Platform and genre dropdown filtering on catalog views.
* [ ] User authentication and multi-shelf sorting (Playing, Completed, Dropped).
* [ ] User reviews and community ratings.

---

## Tech Stack

* **Frontend:** React 19, React Router, HTML5, CSS3 (Flexbox & CSS Grid)
* **Backend:** Node.js, Express, Axios, CORS, Dotenv
* **Build Tool:** Vite 8
* **Data Source:** [IGDB API](https://api-docs.igdb.com/) (Twitch Developer Services)

---

## Architecture Overview

```text
Browser (React / Vite on :5173)
       │
       ▼  HTTP Fetch (/api/games/popular, /search, /:slug)
Express Proxy Server (:5000)
       │  • Manages Twitch OAuth token lifecycle
       │  • Attaches Client-ID & Bearer Token
       ▼  POST (IGDB Query Language)
Twitch / IGDB API (v4)
```

Direct frontend browser requests to IGDB are blocked by CORS policies and expose client secrets. The Express server (`server.js`) acts as a secure intermediary to fetch and cache OAuth credentials while formatting game data for frontend consumption.

---

## Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* A [Twitch Developer Portal](https://dev.twitch.tv/console) account with a registered application (`Client ID` and `Client Secret`)

### Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/TMA033/Video-Game-Backlog.git
   cd Video-Game-Backlog
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the project root:
   ```env
   PORT=5000
   TWITCH_CLIENT_ID=your_twitch_client_id_here
   TWITCH_CLIENT_SECRET=your_twitch_client_secret_here
   ```

4. **Run the Application:**
   Open two terminal windows:

   * **Terminal 1 (Backend Server):**
     ```bash
     node server.js
     ```
     *(Runs on `http://localhost:5000`)*

   * **Terminal 2 (Frontend Dev Server):**
     ```bash
     npm run dev
     ```
     *(Runs on `http://localhost:5173`)*

5. Open your browser and navigate to `http://localhost:5173`.

---

## Project Structure

```text
├── public/
│   └── game-images/               # Fallback and static assets
├── src/
│   ├── assets/                    # Icons, logos, and UI SVG assets
│   ├── components/
│   │   ├── Header.jsx             # Navigation and search input
│   │   └── Header.css
│   ├── pages/
│   │   ├── home/
│   │   │   ├── HomePage.jsx       # Discovery and catalog container
│   │   │   ├── GameGrid.jsx       # Grid layout wrapper
│   │   │   ├── GameCard.jsx       # Individual game card component
│   │   │   └── HomePage.css
│   │   └── game details page/
│   │       ├── GameDetails.jsx    # Showcase, countdown, and metadata
│   │       └── GameDetails.css
│   ├── utils/
│   │   └── slugify.js             # URL slug generation utility
│   ├── App.jsx                    # Route hierarchy
│   ├── main.jsx                   # React root mount
│   └── index.css                  # Global resets and palette variables
├── .env                           # Secret credentials (git-ignored)
├── .gitignore
├── package.json
├── server.js                      # Express IGDB proxy server
├── vite.config.js
└── README.md
```

---

## Author

* **Toyosi Adeniji** – [GitHub](https://github.com/TMA033)