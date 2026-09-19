# Game Tracker

A full-stack web application built with **React 19**, **Vite**, **Express**, and **CSS3** that enables users to browse, search, and track video games using live data from the **Internet Game Database (IGDB) API**.

---

## Features

### Current Features
* **IGDB Proxy Architecture:** Express server handles Twitch OAuth2 client-credential authentication, automatic token refresh, and proxied queries to the IGDB API.
* **Game Discovery:** Displays popular and trending titles sorted by community hype, with content filtering to exclude adult/unrated titles.
* **Live Search:** Dynamic search bar integrated into the header querying IGDB with formatted metadata (cover art, release dates, aggregate scores).
* **Responsive Card Grid:** Custom Flexbox/CSS Grid catalog layout featuring rating badges, platform indicators, and hover animations.

### In Active Development (Roadmap)
* [ ] LocalStorage / Database integration for user library and backlog tracking.
* [ ] Countdown on game's which haven't been released yet but have a known release date.
* [ ] Platform and genre filtering via the homepage filter dropdowns.
* [ ] User authentication and multi-list sorting (Backlog, Playing, Completed).
* [ ] User Review's 

---

## Tech Stack

* **Frontend:** React 19, React Router v7, HTML5, Vanilla CSS3
* **Backend:** Node.js, Express 5, Axios, CORS, Dotenv
* **Build Tool:** Vite 8
* **Data Source:** [IGDB API](https://api-docs.igdb.com/) (via Twitch Developer Services)

---

## Architecture Overview

```text
Browser (React / Vite on :5173)
       │
       ▼  HTTP Fetch
Express Proxy Server (:5000)
       │  • Handles OAuth token lifecycle
       │  • Attaches Client-ID & Bearer Token
       ▼  POST (IGDB Query Language)
Twitch / IGDB API (v4)
```

Direct frontend browser requests to IGDB are blocked by CORS policies and expose client secrets. The included Express server (`server.js`) acts as a secure intermediary to fetch and cache the OAuth token and proxy search/catalog requests.

---

## Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* A [Twitch Developer Portal](https://dev.twitch.tv/console) account with a registered application (`Client ID` and `Client Secret`)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/TMA033/game-tracker.git
   cd game-tracker
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
   Open two terminals:

   * **Terminal 1 (Start Backend Server):**
     ```bash
     node server.js
     ```
     *(Runs on `http://localhost:5000`)*

   * **Terminal 2 (Start Frontend Dev Server):**
     ```bash
     npm run dev
     ```
     *(Runs on `http://localhost:5173`)*

5. Open your browser and navigate to `http://localhost:5173`.

---

## Project Structure

```text
├── public/
│   └── game-images/           # Sample static game assets
├── src/
│   ├── assets/                # Logos, SVG icons, and loading animations
│   ├── components/
│   │   ├── Header.jsx         # Navigation and search bar component
│   │   └── Header.css         # Header styling
│   ├── pages/
│   │   ├── HomePage.jsx       # Grid view and search results container
│   │   └── HomePage.css       # Catalog and card styles
│   ├── App.jsx                # Router route definitions
│   ├── main.jsx               # Root React entry point
│   └── index.css              # Global styles and resets
├── .env                       # Secrets (ignored by git)
├── .gitignore
├── package.json
├── server.js                  # Express proxy server for IGDB
├── vite.config.js
└── README.md
```

---

## Author

* **Toyosi Adeniji** – [GitHub](https://github.com/TMA033)