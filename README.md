# Font Group System

A single-page application to manage font uploads and groups, built with Node.js, Express, MongoDB, vanilla JavaScript, and Tailwind CSS.

## Setup

1. Install Node.js (v16+).
2. Install MongoDB locally or use MongoDB Atlas.
3. Clone the repository: `git clone https://github.com/yourusername/font-group-system`.
4. Install dependencies: `npm install`.
5. Create `.env` with `MONGODB_URI` and `PORT` (see `.env` example).
6. Ensure `uploads/fonts/` is writable.
7. Start the server: `npm start`.
8. Access at `http://localhost:3000`.

## Features

- Upload `.ttf` fonts via drag-and-drop or file input.
- List fonts with previews ("Example Style") and Delete buttons.
- Create font groups (minimum two fonts) with dynamic row addition.
- List, edit, and delete font groups.
- Single-page application with no reloads (AJAX).

## Tech Stack

- Backend: Node.js, Express.js, MongoDB, Multer
- Frontend: Vanilla JavaScript, Tailwind CSS

## Endpoints

- `POST /api/fonts`: Upload a `.ttf` font.
- `GET /api/fonts`: List all fonts.
- `DELETE /api/fonts/:id`: Delete a font.
- `POST /api/groups`: Create a font group.
- `GET /api/groups`: List all groups.
- `PUT /api/groups/:id`: Update a group.
- `DELETE /api/groups/:id`: Delete a group.
