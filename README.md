# 🎬 Movie Explorer

> **A cinematic React app for exploring movies, genres, and personal favorites — powered by TMDB API.**  
> Built with **React + Vite + React Router + Axios + CSS Modules**  
> Theme: **Cinematic Ocean 🌊**

---

## 🧭 Table of Contents
- [Overview](#-overview)
- [Tech Stack & Project Structure](#-tech-stack--project-structure)
- [Main Pages](#-main-pages)
- [Components](#-components)
- [API Layer](#-api-layer)
- [Hooks & State Management](#-hooks--state-management)
- [Favorites System](#-favorites-system)
- [Import / Export JSON](#-import--export-json)
- [Styling (Cinematic Ocean)](#-styling-cinematic-ocean)
- [Routing Logic](#-routing-logic)
- [Future Improvements](#-future-improvements)
- [Credits](#-credits)

---

## 📖 Overview

**Movie Explorer** is a single-page React application that allows users to:
- Browse and search for movies from TMDB API  
- Filter by genres  
- View detailed movie pages with trailers and recommendations  
- Save favorites locally (no login or server required)  
- Add notes and ratings  
- Export or import their collection as JSON  

All user data (favorites, notes, ratings) is stored in **LocalStorage** — completely client-side.

---


---

## 🏠 Main Pages

### **Home.jsx**
- Fetches popular movies and genres.
- Displays hero section (with backdrop), quick genres, and popular movies.
- Shows stats: *popular count*, *genres count*, *favorites count*.
- CTA buttons: “Open Catalog” and “About Project”.

### **Movies.jsx**
- Full movie catalog with:
  - Search bar (debounced input)
  - Genre filter (expandable on mobile)
  - Paginated movie grid
  - Skeleton loading state

### **Favorites.jsx**
- Displays user’s saved movies.
- Supports:
  - Add/remove from favorites
  - Add notes and ratings
  - **Export/Import JSON**
  - **Clear All** (red danger button)

### **MovieDetail.jsx**
- Shows detailed movie info:
  - Poster, overview, rating, genres
  - YouTube trailer
  - Recommendations list
  - Star rating & note box

### **About.jsx**
- Information about the project, features, privacy, and tech stack.

### **Login / Register**
- Basic authentication mock pages (using `AuthProvider` context).

---

## ⚙️ Components

| Component | Purpose |
|------------|----------|
| **Card** | Displays movie poster, title, rating, and favorite star |
| **SearchBar** | Search input with debounce |
| **GenreFilter** | Horizontal or collapsible genre list |
| **SkeletonGrid** | Shimmer placeholders during loading |
| **EmptyState** | Shown when no data is found |
| **NoteBox / StarRating** | Personal rating and notes for a movie |

---

## 🌐 API Layer

All TMDB API logic is wrapped inside `/api`.

Example:
```js
import client from "./client";

export default async function fetchPopular(page = 1) {
  const res = await client.get("/movie/popular", { params: { page } });
  return res.data;
}
| File                | Description                                    |
| ------------------- | ---------------------------------------------- |
| **client.js**       | Axios setup + TMDB API key injection           |
| **movies.js**       | Fetch popular movies                           |
| **movieDetails.js** | Fetch movie details, trailers, recommendations |
| **search.js**       | Search movies                                  |
| **genres.js**       | Fetch all genres                               |
| **images.js**       | Generate poster/backdrop URLs                  |
🪝 Hooks & State Management
useFavorites

Manages favorites using LocalStorage:

{
  items,           // list of favorite movies
  add(movie),      // add to favorites
  remove(id),      // remove from favorites
  toggle(movie),   // toggle favorite
  clear()          // remove all
}

useDebounce

Delays execution (used in search).

useScrollTop

Scrolls to top when route changes.

⭐ Favorites System

Stored in LocalStorage under favorites.

Includes metadata:

{ "id": 123, "title": "Inception", "posterUrl": "...", "year": 2010 }


Supports rating and notes.

Favorites page automatically refreshes outdated movie info from TMDB.

🔁 Import / Export JSON

FavTransferPanel component allows:

Export JSON → Save favorites to file.

Import JSON → Load favorites back.

Clear All → Remove everything (styled red button).

<button className="btn btn-danger" onClick={clearAll}>
  Clear all
</button>

🎨 Styling (Cinematic Ocean)

Deep oceanic dark theme with turquoise glow.

Palette

--bg: #0B0C10;
--surface: #1F2833;
--accent: #45A29E;
--accent-strong: #66FCF1;
--text: #C5C6C7;
--border: #273140;


Features

Rounded corners (8–16px)

Soft shadows & neon glows

Adaptive grid for movies

Cinematic hero gradients

Accessible focus rings

Responsive (mobile → desktop)

🧭 Routing Logic
Path	Component	Description
/	Home	Main landing
/movies	Movies	Movie catalog
/movies/:id	MovieDetail	Details + trailer
/favorites	Favorites	User favorites
/about	About	Info page
/login, /register	Auth forms	
🚀 Future Improvements

User collections / playlists

Light mode theme

Offline poster caching

Advanced filters (year, rating, country)

Social sharing for lists

Progressive Web App (PWA) mode

🪶 Credits

This product uses the TMDB API but is not endorsed or certified by TMDB.

Created with ❤️ by Madiar Abubek
Built for educational & portfolio purposes.

