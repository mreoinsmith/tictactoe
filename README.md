# Tic-Tac-Toe

A simple, browser-based Tic-Tac-Toe game with two modes: **2 Players (local)** or **vs Computer**. Includes a **turn indicator** and an in-game **timer**. 

## Live Demo

Play here: https://mreoinsmith.github.io/tic-tac-toe/ 

## Features

- ✅ **Two game modes**: 2 Players / vs Computer
- ✅ **Current turn** display
- ✅ **Game timer**
- ✅ **New Game** + **Change Mode** 
- ✅ Lightweight: plain **HTML/CSS/JavaScript** (no build step) 

## Tech Stack

- HTML
- CSS
- JavaScript 

## Project Structure

The app is intentionally small and easy to follow:

- `index.html` – UI / layout
- `style.css` – styling
- `game.js` – game logic and interactions 

## Run Locally

Because this is a static site, you can run it with any simple local server.

### Option A: VS Code “Live Server”
1. Open the project folder in VS Code  
2. Install the **Live Server** extension  
3. Right-click `index.html` → **Open with Live Server**

### Option B: Python (built-in)
From the project folder:

```bash
# Python 3
python -m http.server 8000
Then open: http://localhost:8000

Deploying to GitHub Pages
This project is deployed using GitHub Pages.

Typical setup:

In GitHub, go to Settings → Pages

Under “Build and deployment”, select:

Source: Deploy from a branch

Branch: main (or master) and / (root)

Save — your site will be available at:
https://<username>.github.io/<repo>/

Contributing
If you’d like to improve the AI, add difficulty levels, or enhance styling:

Fork the repo

Create a feature branch

Open a Pull Request

License
No license specified yet. If you want this to be open source, consider adding an MIT License.
