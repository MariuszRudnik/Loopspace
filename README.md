
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

Loopspace is an open-source platform designed for knowledge sharing, video courses, and community building. It aims to provide a free, self-hosted alternative to commercial platforms like Circle.so, eliminating subscription costs for small businesses, educators, and independent creators.

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
- **User Management:**
  - Add users and assign passwords manually.
  - Password reset functionality.
- **Educational Materials:**
  - Upload video files (MP4) from a local server.
  - Add articles and external resource links.
- **Comments:**
  - Users can comment on educational materials.

### Excluded from MVP
- User activity history.
- AI-powered chatbot for learning support.
- Bookmarks and personal notes.
- Advanced customization options.

---

## Project Status

The project is currently in the **MVP development phase**. The roadmap includes:
1. **Phase 1:** Implementing core MVP features.
2. **Phase 2:** Functional and usability testing.
3. **Phase 3:** Publishing the project as open-source on GitHub.

---

## License

This project is open-source. The specific license will be added soon.

