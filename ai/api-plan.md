# REST API Plan

## 1. Resources

### Core Resources
- **Profiles** (`/profiles`) - User profile management
- **Channels** (`/channels`) - Kanały tworzone przez użytkowników (nadrzędna struktura)
- **Courses** (`/courses`) - Kursy należące do określonego kanału
- **Chapters** (`/chapters`) - Rozdziały należące do określonego kursu
- **Lessons** (`/lessons`) - Lekcje należące do określonego rozdziału
- **Enrollments** (`/enrollments`) - Course enrollment management
- **Progress** (`/progress`) - User learning progress tracking
- **Comments** (`/comments`) - Lesson comments and discussions
- **AdminUsers** (`/admin`) - Administrator management

## 2. Endpoints

### Profiles

### Channels

#### POST /api/channels/add
- Body: `{ name: string, description?: string }`
- Response: Nowy kanał (obiekt kanału)
- Access: Tylko dla zalogowanych użytkowników  
- Uwierzytelnienie: Token pobierany z ciasteczek (supabase-auth-token)

#### GET /api/channels/list
- Response: Lista kanałów stworzonych przez zalogowanego użytkownika
- Access: Tylko kanały użytkownika  
- Uwierzytelnienie: Token pobierany z ciasteczek

#### DELETE /api/channels/delete
- Body: `{ channelId: string }`
- Response: `{ message: "Kanał usunięty pomyślnie" }`
- Access: Kanał może być usunięty tylko przez właściciela
- Uwierzytelnienie: Token pobierany z ciasteczek (supabase-auth-token)

#### POST /api/channels/:channelId/courses
- Body: `{ title: string, description?: string, thumbnail_url?: string, is_public?: boolean }`
- Response: Nowy kurs dodany do kanału
- Access: Tylko właściciel kanału

#### GET /api/channels/:channelId/courses
- Response: Lista kursów w danym kanale
- Access: Właściciel kanału lub użytkownicy z dostępem do kanału

### Courses

#### GET /api/courses
- Query params: `search`, `page`, `limit`, `is_public`, `channelId`
- Response: `{ data: Course[], meta: { total, page, limit } }`
- Access: Public courses or owned courses

#### POST /api/courses
- Body: `{ title, description?, thumbnail_url?, is_public?, channelId }`
- Response: `Course`
- Access: Authenticated users with access to channel

#### GET /api/courses/:id
- Response: `Course` with chapters
- Access: Public or enrolled or owner

#### PUT /api/courses/:id
- Body: `{ title?, description?, thumbnail_url?, is_public? }`
- Response: `Course`
- Access: Course owner or admin

#### DELETE /api/courses/:id
- Access: Course owner or admin

#### GET /api/chapters/:id
- Response: `Chapter` with lessons
- Access: Public course or enrolled or owner

#### GET /api/chapters/:courseId
- Query params: `page`, `limit`
- Response: `{ data: Chapter[], meta: { total, page, limit } }`
- Access: Public course or enrolled or owner

#### POST /api/chapters/:courseId
- Body: `{ title, description?, order_number, is_published? }`
- Response: `Chapter`
- Access: Course owner or admin

[//]: # (#### GET /api/chapters//:id)

[//]: # (- Response: `Chapter` with lessons)

[//]: # (- Access: Public course or enrolled or owner)

#### PUT /api/chapters/edit/:id
- Body: `{ title?, description?, order_number?, is_published? }`
- Response: `Chapter`
- Access: Course owner or admin

#### DELETE /api/chapters/edit/:id
- Access: Course owner or admin

### Lessons

#### GET /api/chapters/lessons/chapterId
- Query params: `page`, `limit`
- Response: `{ data: Lesson[], meta: { total, page, limit } }`
- Access: Public course or enrolled or owner

#### POST /api/chapters/lessons/:chapterId
- Body: `{ title, content?, order_number, is_published? }`
- Response: `Lesson`
- Access: Course owner or admin

#### GET /api/lessons/:id
- Response: `Lesson` with progress
- Access: Public course or enrolled or owner

#### PUT /api/lessons/:id
- Body: `{ title?, content?, order_number?, is_published? }`
- Response: `Lesson`
- Access: Course owner or admin

#### DELETE /api/lessons/:id
- Access: Course owner or admin

### Enrollments

#### GET /api/courses/:courseId/enrollments
- Query params: `page`, `limit`
- Response: `{ data: Enrollment[], meta: { total, page, limit } }`
- Access: Course owner or admin

#### POST /api/courses/:courseId/enroll
- Response: `Enrollment`
- Access: Authenticated users

#### DELETE /api/courses/:courseId/enroll
- Access: Enrolled user or admin

### Progress

#### GET /api/lessons/:lessonId/progress
- Response: `Progress`
- Access: Own progress only

#### PUT /api/lessons/:lessonId/progress
- Body: `{ last_position?, completed? }`
- Response: `Progress`
- Access: Own progress only

### Comments

#### GET /api/lessons/:lessonId/comments
- Query params: `page`, `limit`
- Response: `{ data: Comment[], meta: { total, page, limit } }`
- Access: Lesson viewers

#### POST /api/lessons/:lessonId/comments
- Body: `{ content }`
- Response: `Comment`
- Access: Enrolled users

#### PUT /api/comments/:id
- Body: `{ content }`
- Response: `Comment`
- Access: Comment owner

#### DELETE /api/comments/:id
- Access: Comment owner or course owner or admin

### Admin

#### GET /api/admin/users
- Query params: `page`, `limit`
- Response: `{ data: AdminUser[], meta: { total, page, limit } }`
- Access: Admins only

#### POST /api/admin/users
- Body: `{ user_id }`
- Response: `AdminUser`
- Access: Admins only

#### DELETE /api/admin/users/:userId
- Access: Admins only

## 3. Authentication and Authorization

### Authentication
- JWT-based authentication
- Tokens provided via Authorization header: `Bearer <token>`
- Token refresh mechanism for extended sessions

### Authorization Levels
1. Public - Unauthenticated access to public resources
2. User - Basic authenticated user access
3. Channel Owner - Extended rights for owned channels
4. Course Owner - Extended rights for owned courses
5. Admin - Full system access

## 4. Validation and Business Logic

### Common Validations
- All IDs must be valid UUIDs
- Pagination: `limit` (1-100), `page` (≥1)
- Text fields: max length constraints as per database schema

### Resource-specific Rules

#### Channels
- Name: Required, 3-255 characters
- Description: Optional, max 2000 characters
- Created by authenticated user only
- Może zawierać dowolną liczbę kursów

#### Courses
- Title: Required, 3-255 characters
- Description: Optional, max 2000 characters
- Thumbnail URL: Optional, valid URL format
- Created by authenticated user only
- Musi należeć do kanału
- Może zawierać dowolną liczbę rozdziałów (chapters)

#### Chapters
- Title: Required, 3-255 characters
- Description: Optional, max 1000 characters
- Order number: Required, positive integer
- Must belong to an existing course
- Może zawierać dowolną liczbę lekcji

#### Lessons
- Title: Required, 3-255 characters
- Order number: Required, positive integer
- Must belong to an existing chapter
- Content: Optional, max 10000 characters

#### Comments
- Content: Required, 1-1000 characters
- Must be associated with an existing lesson
- User must be enrolled in the course

#### Progress
- Last position: Optional, non-negative number
- Completed: Optional boolean
- One progress record per user per lesson

## 5. Error Handling

### Standard Error Response
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {} // Optional additional information
  }
}
```

### Common Error Codes
- 400: Bad Request - Invalid input
- 401: Unauthorized - Missing or invalid authentication
- 403: Forbidden - Insufficient permissions
- 404: Not Found - Resource doesn't exist
- 409: Conflict - Resource state conflict
- 422: Unprocessable Entity - Validation failed
- 429: Too Many Requests - Rate limit exceeded
- 500: Internal Server Error - Server-side error

## 6. Rate Limiting

- 100 requests per minute per user
- 1000 requests per minute per IP for public endpoints
- Rate limit headers included in responses

`