# SocialApp 

A full-stack social media platform enabling users to create profiles, share posts, like and comment on others' posts, follow users, and explore trending content.

>  Prodigy InfoTech Internship — Task 05

---

## Project Overview

SocialApp is a modern social media platform built with the MERN stack. Users can register, create posts with images and tags, interact with other users through likes and comments, follow each other, and receive real-time notifications for interactions.

---

## Technologies Used

### Frontend
- React.js
- React Router DOM
- Axios
- CSS3 (Custom Styling)

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- bcryptjs
- JSON Web Tokens (JWT)
- dotenv
- cors
- Multer
- Cloudinary

---

## Features

- User Registration & Login with JWT Authentication
- Create Posts with Text, Images & Tags
- Like & Unlike Posts
- Comment on Posts
- Follow & Unfollow Users
- User Profile Page with Post Count, Followers & Following
- Notifications for Likes, Comments & Follows
- Explore Page with Trending Posts
- Suggested Users on Explore Page
- Search Users
- Delete Your Own Posts
- Responsive Design

---

## API Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | /api/auth/register | Register new user | Public |
| POST | /api/auth/login | Login user | Public |
| GET | /api/posts | Get all posts | Protected |
| POST | /api/posts | Create a new post | Protected |
| GET | /api/posts/trending | Get trending posts | Protected |
| GET | /api/posts/user/:id | Get posts by user | Protected |
| PUT | /api/posts/:id/like | Like or unlike post | Protected |
| POST | /api/posts/:id/comment | Comment on post | Protected |
| DELETE | /api/posts/:id | Delete a post | Protected |
| GET | /api/users | Get all users | Protected |
| GET | /api/users/:id | Get user profile | Protected |
| PUT | /api/users/:id/follow | Follow or unfollow | Protected |
| GET | /api/users/notifications | Get notifications | Protected |

---

## Live Demo

### Frontend (Website)
https://social-media-qp5hmqto2-rajendran55764.vercel.app

### Backend (API)
https://social-media-app-fj56.onrender.com

---

## Project Structure

social-media-app/
├── backend/
│   ├── config/
│   │   └── cloudinary.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── postRoutes.js
│   │   └── userRoutes.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/axios.js
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
└── README.md

---

## Author

rajendran55764-lab • Prodigy Infotech Internship Task 05
