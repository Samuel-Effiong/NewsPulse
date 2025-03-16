
# NewsPulse

NewsPulse is a full‑stack web application that allows users to view, filter, and interact with news articles. The project features a Django REST API backend and a React frontend. Users can view articles with infinite scrolling, like or dislike articles, filter by tag, view detailed article pages (with carousels for multiple images), and see overall site statistics.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Technologies](#technologies)
- [Setup and Installation](#setup-and-installation)
  - [Backend Setup (Django)](#backend-setup-django)
  - [Frontend Setup (React)](#frontend-setup-react)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Features

- **News Listing:**
  - Paginated news list with infinite scrolling.
  - Display of featured image, published date, and tags.
- **Detailed News View:**
  - View full news content.
  - Automatic view count increment on each visit.
  - Like and dislike functionality with real‑time updates.
  - Multiple images displayed via a responsive, auto‑scrolling carousel (testimonial style).
- **News Filtering by Tag:**
  - Filter news articles by tag.
- **Statistics Page:**
  - Overview of site statistics (total news, likes, dislikes, etc.).
- **Admin Panel:**
  - Django Admin integration for content management.
- **File Uploads:**
  - Upload and store featured images and additional news images, saved in folders named after the news article.
- **Responsive Design:**
  - Frontend built using React and Bootstrap, optimized for mobile devices.
- **CORS & WhiteNoise:**
  - Django configured to handle CORS.
  - WhiteNoise serves static and media files in production.

## Project Structure

```
NewsPulse/
├── backend/                  # Django Project
│   ├── config/            # Django project configuration
│   │   ├── settings/         # Settings (base, local, production)
│   │   ├── urls.py           # Root URL configuration
│   │   └── wsgi.py           # WSGI entry point
│   │
│   ├── apps/
│   │   └── news/             # News app (models, views, serializers, urls, tests)
│   │       ├── migrations/   # Django migrations
│   │       ├── models.py     # Models (News, NewsImage, Tag)
│   │       ├── serializers.py
│   │       ├── views.py
│   │       ├── stats_views.py
│   │       └── urls.py
│   │
│   ├── requirements.txt  # Python dependencies
│   └── manage.py           # Django management
│└── frontend/               # React Application
    ├── public/             # Public static assets
    │   ├── index.html
    │   └── favicon.ico
    ├── src/                # Source code
    │   ├── components/     # React components (NewsItem.jsx, Stats.jsx, etc.)
    │   ├── pages/          # Page components (HomePage.jsx, NewsByTag.jsx, StatsPage.jsx)
    │   ├── services/       # API integration (api.js)
    │   ├── styles/         # CSS styles (App.css, index.css)
    │   ├── App.jsx         # Main application component
    │   └── index.jsx       # React entry point
    ├── .env                # Environment variables
    ├── package.json        # NPM configuration and dependencies
    └── README.md           # This file
```

## Technologies

- **Backend:**
  - Django 5.x, Django REST Framework, django-cors-headers, WhiteNoise, Pillow.
- **Frontend:**
  - React, React Router v6, Axios, Bootstrap 5.
- **Others:**
  - Git, Virtualenv or Poetry for Python dependencies, npm for frontend dependencies.

## Setup and Installation

### Backend Setup (Django)

1. **Clone the Repository:**

   ```bash
   git clone <repository-url>
   cd NewsPulse/backend
   ```

2. **Create a Virtual Environment & Install Dependencies:**

   Using **virtualenv**:
   ```bash
   python -m venv venv
   source venv/bin/activate      # On Windows use: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Database Migrations:**

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **Create a Superuser (for admin access):**

   ```bash
   python manage.py createsuperuser
   ```

5. **Run the Development Server:**

   ```bash
   python manage.py runserver
   ```

### Frontend Setup (React)

1. **Navigate to the Frontend Directory:**

   ```bash
   cd ../frontend
   ```

2. **Install Node Dependencies:**

   ```bash
   npm install
   ```

3. **Set Environment Variables:**

   Create a `.env` file in the `frontend/` directory with:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:8000/api/v1
   ```

4. **Start the Development Server:**

   ```bash
   npm start
   ```

   This will launch your React app at [http://localhost:3000](http://localhost:3000).

## Configuration

- **CORS:**
  Django is configured with `django-cors-headers` to allow your React app at `http://localhost:3000` access to the API.
- **Media Files:**
  Uploaded images are stored in the `media/` folder. During development, Django serves these files. In production, WhiteNoise (or another dedicated solution) serves static and media files.
- **WhiteNoise:**
  In production, WhiteNoise is configured in your `wsgi.py` and settings to serve static and (optionally) media files.

## Running the Application

- **Development:**
  Run Django backend on port 8000 and React frontend on port 3000. The React app communicates with the Django API
- **Production:**
  Build the React app using `npm run build`, then configure Django to serve the build output (using WhiteNoise and a catch‑all view) for a fully integrated deployment.


## Troubleshooting

- **CORS Issues:**
  Verify that your `django-cors-headers` settings allow your frontend's origin and that your Django server is running with the correct settings.
- **File Uploads:**
  Ensure `MEDIA_URL` and `MEDIA_ROOT` are correctly set. Check that Pillow is installed.
- **Infinite Scrolling & Pagination:**
  Confirm that your API paginates responses correctly and that your frontend correctly increments page numbers.
- **WhiteNoise Configuration:**
  If media files aren’t served in production, double‑check your `wsgi.py` and static file settings.
