# Loopspace

## Table of Contents
1. [Project Description](#project-description)
2. [Tech Stack](#tech-stack)
3. [Getting Started Locally](#getting-started-locally)
4. [Available Scripts](#available-scripts)
5. [Project Scope](#project-scope)
6. [Project Status](#project-status)
7. [License](#license)

---

## Project Description

Loopspace is an open-source platform for knowledge sharing and community building.  
**The MVP version includes only a simple chatbot for conversation, administrator registration, and the ability to add channels, courses, and individual lessons. Supabase is used as the main database. Other features described in this document will be added in the future. Test coverage is not complete yet, but will be improved.**

---

## Tech Stack

### Frontend
- **Next.js**: React framework with server-side rendering (SSR) and static site generation (SSG).
- **TypeScript**: Static typing for improved code quality.
- **Tailwind CSS**: Utility-first CSS framework for responsive and aesthetic designs.
- **Shadcn/ui**: Accessible React component library.

### Backend
- **Supabase**: PostgreSQL database, authentication, and backend-as-a-service.
- **Openrouter.ai**: AI model integration for advanced functionalities.

### CI/CD and Hosting
- **GitHub Actions**: Automated workflows for building, testing, and deploying.
- **DigitalOcean**: Docker-based hosting with scalable resources.

---

## Getting Started Locally

Follow these steps to set up the project locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/loopspace.git
   cd loopspace
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Run the development server:**
   ```bash
   pnpm dev
   ```

4. **Access the application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

The following scripts are available in the project:

- `pnpm dev`: Starts the development server.
- `pnpm build`: Builds the application for production.
- `pnpm start`: Starts the production server.
- `pnpm lint`: Runs ESLint to check for code quality issues.

---

## Project Scope

### MVP Features
- **Chatbot:**
  - Simple AI chatbot for conversation.
- **Administrator registration:**
  - Ability to register an administrator account.
- **Channels, Courses, Lessons:**
  - Add thematic channels.
  - Create courses within channels.
  - Add individual lessons to courses.
- **Database:**
  - Supabase as the main backend and database.

### Excluded from MVP
- User activity history.
- Advanced AI chatbot for learning support and quiz generation.
- Bookmarks and personal notes.
- Advanced customization options.
- Comments under materials.
- Video player and video uploads.
- User management and password reset.
- Full test coverage (tests will be improved in the future).

---

## Project Status

The project is currently in the **MVP development phase**.  
Only the chatbot and basic content structure are implemented.  
Other features and full test coverage will be added in the future.

---

## License

This project is open-source. The specific license will be added soon.

``