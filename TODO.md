# TODO.md

# Workstream Backend TODO

Enterprise Workflow Management System

Target:

* Backend first
* Trial-ready in 2 weeks
* Multi-user login
* Username-based authentication
* Progress update per designer
* Every individual can update their own assigned tasks
* Task tracking with real data

Stack:

* Bun
* ElysiaJS
* TypeScript
* Drizzle ORM
* PostgreSQL
* JWT
* HttpOnly Cookie
* Winston Logger
* Multer (Upload Helper)
* Docker optional

Version 1.3

---

# 1. Backend Project Setup

* [x] Create backend project with Bun
* [x] Setup TypeScript
* [x] Setup ElysiaJS
* [x] Setup project scripts
* [x] Setup folder structure
* [x] Setup environment variables
* [x] Setup CORS
* [x] Setup global error handler
* [x] Setup response helper
* [x] Setup Winston logger helper

---

# 2. Required Packages

* [x] Install ElysiaJS
* [x] Install Drizzle ORM
* [x] Install Drizzle Kit
* [x] Install PostgreSQL driver
* [x] Install JWT package
* [x] Install bcrypt package
* [x] Install Zod
* [x] Install Winston
* [x] Install Multer
* [x] Install cookie plugin
* [x] Install CORS plugin
* [x] Install static file plugin for uploads
* [x] Install nanoid helper if needed

Suggested:

```bash
bun add elysia @elysiajs/cors @elysiajs/cookie @elysiajs/jwt @elysiajs/static drizzle-orm postgres bcryptjs zod nanoid winston multer

bun add -d drizzle-kit
```

---

# 3. Folder Structure

* [x] Create `src/app.ts`
* [x] Create `src/server.ts`
* [x] Create `src/config/env.ts`
* [x] Create `src/config/cors.ts`
* [x] Create `src/config/logger.ts`
* [x] Create `src/db/index.ts`
* [x] Create `src/db/schema`
* [x] Create `src/db/seed.ts`
* [x] Create `src/plugins`
* [x] Create `src/middleware`
* [x] Create `src/modules`
* [x] Create `src/shared`
* [x] Create `src/shared/errors`
* [x] Create `src/shared/utils`
* [x] Create `src/shared/constants`
* [x] Create `src/shared/validations`
* [x] Create `src/shared/upload`
* [x] Create `src/shared/upload/multer.ts`
* [x] Create `drizzle.config.ts`

---

# 4. Environment Variables

* [x] Add `.env`
* [x] Add `.env.example`

Required env:

```env
NODE_ENV=development
PORT=3000

DATABASE_URL=postgresql://postgres:password@localhost:5432/workstream

JWT_SECRET=change_me
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:5173

COOKIE_NAME=workstream_token
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax

UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

---

# 5. Database Setup

* [x] Setup PostgreSQL database
* [x] Configure Drizzle connection
* [x] Create Drizzle schema
* [x] Generate migration
* [x] Run migration
* [x] Create seed script
* [x] Run seed script

---

# 6. Drizzle Schema

Create enums:

* [x] Role
* [x] TaskStatus
* [x] PriorityLevel
* [x] ActivityAction
* [x] NotificationType

Create tables:

* [x] User
* [x] Category
* [x] Priority
* [x] PatternSize
* [x] Task
* [x] TaskComment
* [x] RevisionNote
* [x] ProgressLog
* [x] ActivityLog
* [x] Notification
* [x] Attachment

User fields:

```text
id
username
name
passwordHash
role
isActive
createdAt
updatedAt
```

Important:

* [x] Username must be unique
* [x] Do not use email authentication
* [x] Email field is not required

---

# 7. Seed Data

Create initial users:

* [x] Super Admin
* [x] Designer 1
* [x] Designer 2
* [x] Viewer

Example usernames:

```text
admin
designer1
designer2
viewer
```

Roles:

```text
SUPER_ADMIN
DESIGNER
VIEWER
```

Default categories:

* [x] New Design
* [x] Tracing
* [x] Resize Pattern
* [x] Color Adjustment
* [x] Repeat Pattern
* [x] Revision
* [x] Other

Default priorities:

* [x] Low
* [x] Medium
* [x] High
* [x] Urgent

Default pattern sizes:

* [x] 10
* [x] 12
* [x] 14

Default tasks:

* [x] Resize Pattern Ukuran 10
* [x] Resize Pattern Ukuran 12
* [x] Resize Pattern Ukuran 14
* [x] Tracing Artwork A-1245
* [x] Color Adjustment Motif Floral
* [x] Repeat Pattern Check
* [x] Revisi Warna Navy
* [x] Layout Motif Rotary
* [x] Cleanup File Design

---

# 8. API Response Standard

Success:

```json
{
  "success": true,
  "message": "Request successful",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "username",
      "message": "Username is required"
    }
  ]
}
```

Pagination:

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "items": [],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

---

# 9. Auth Module

Routes:

```text
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

Tasks:

* [x] Create auth module
* [x] Create login validation
* [x] Create login service
* [x] Compare password with bcrypt
* [x] Generate JWT
* [x] Set JWT in HttpOnly Cookie
* [x] Create logout route
* [x] Clear cookie on logout
* [x] Create me route
* [x] Return authenticated user
* [x] Handle inactive user
* [x] Handle invalid credential

Login payload:

```json
{
  "username": "designer1",
  "password": "password123"
}
```

Login response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "username": "designer1",
      "name": "Designer 1",
      "role": "DESIGNER"
    }
  }
}
```

---

# 10. Auth Middleware

* [x] Create `requireAuth`
* [x] Read JWT from cookie
* [x] Verify JWT
* [x] Attach user to request context
* [x] Reject missing token
* [x] Reject invalid token
* [x] Reject inactive user

---

# 11. Role Middleware

* [x] Create `requireRole`
* [x] Support role list
* [x] Allow SUPER_ADMIN all access
* [x] Restrict DESIGNER mutation to assigned tasks only
* [x] Restrict VIEWER to read only

Roles:

```text
SUPER_ADMIN
DESIGNER
VIEWER
```

---

# 12. User Module

Routes:

```text
GET    /api/v1/users
POST   /api/v1/users
GET    /api/v1/users/:id
PATCH  /api/v1/users/:id
DELETE /api/v1/users/:id
```

Tasks:

* [x] Create users module
* [x] Get users with pagination
* [x] Search user by username/name
* [x] Filter by role
* [x] Filter by active status
* [x] Create user
* [x] Hash password
* [x] Update user
* [x] Deactivate user
* [x] Prevent deleting self
* [x] Prevent duplicate username
* [x] Create activity log for user creation
* [x] Create activity log for role update

Access:

* [x] SUPER_ADMIN only for create/update/delete
* [x] SUPER_ADMIN can list all users
* [x] DESIGNER can only read own profile
* [x] VIEWER read only if needed

---

# 13. Settings Module

Routes:

```text
GET /api/v1/settings/categories
GET /api/v1/settings/priorities
GET /api/v1/settings/pattern-sizes
```

Trial scope:

* [x] Get categories
* [x] Get priorities
* [x] Get pattern sizes

Can postpone:

* [ ] Create category
* [ ] Update category
* [ ] Deactivate category
* [ ] Create priority
* [ ] Update priority
* [ ] Deactivate priority
* [ ] Create pattern size
* [ ] Update pattern size

---

# 14. Task Module

Routes:

```text
GET    /api/v1/tasks
GET    /api/v1/tasks/board
POST   /api/v1/tasks
GET    /api/v1/tasks/:id
PATCH  /api/v1/tasks/:id
DELETE /api/v1/tasks/:id
```

Tasks:

* [x] Create task module
* [x] Create task validation
* [x] Get task list with pagination
* [x] Get board grouped by status
* [x] Get task detail
* [x] Create task
* [x] Update task
* [x] Soft delete task
* [x] Filter by status
* [x] Filter by designer
* [x] Filter by category
* [x] Filter by priority
* [x] Filter by pattern size (10, 12, 14)
* [x] Filter by due date
* [x] Search by title/reference number
* [x] Sort by due date
* [x] Sort by updatedAt

Access:

* [x] SUPER_ADMIN can view all tasks
* [x] SUPER_ADMIN can create/update/delete tasks
* [x] DESIGNER can view assigned tasks
* [x] DESIGNER can update their own assigned tasks
* [x] VIEWER read only

---

# 15. Task Status Module

Route:

```text
PATCH /api/v1/tasks/:id/status
```

Tasks:

* [x] Validate status
* [x] Update status
* [x] If status DONE, set completedAt
* [x] If status not DONE, clear completedAt if needed
* [x] Create activity log
* [x] Create notification if status changed
* [x] Return updated task

Valid statuses:

```text
QUEUE
WORKING
CHECKING
REVISION
READY_UPLOAD
DONE
```

UI labels:

```text
QUEUE        = Antrian
WORKING      = Dikerjakan
CHECKING     = Dicek
REVISION     = Revisi
READY_UPLOAD = Siap Upload
DONE         = Selesai
```

Important:

* [ ] Status update does not automatically change progress
* [ ] Progress remains manually controlled

---

# 16. Task Progress Module

Route:

```text
PATCH /api/v1/tasks/:id/progress
```

Payload:

```json
{
  "progress": 65,
  "note": "Tracing selesai, tinggal cleanup detail."
}
```

Tasks:

* [x] Validate progress is integer 0-100
* [x] Validate progress range based on current status
* [x] Update task progress
* [x] Update task progressNote
* [x] Create progress log
* [x] Create activity log
* [x] Return updated task

Progress rules:

```text
QUEUE        = 0
WORKING      = 15-80
CHECKING     = 80-90
REVISION     = 50-85
READY_UPLOAD = 90-99
DONE         = 100
```

Access:

* [x] SUPER_ADMIN can update any task progress
* [x] DESIGNER can update their own assigned task progress
* [x] VIEWER cannot update progress

---

# 17. Individual Task Ownership Rules

Rules:

* [x] Every task must have one assigned designer
* [x] Every designer only updates their own tasks
* [x] Designers cannot modify tasks owned by others
* [x] Designers can update status
* [x] Designers can update progress
* [x] Designers can add comments
* [x] Designers can add revision notes
* [x] Ownership validation must happen in backend

Validation flow:

```text
JWT User
↓

Get Task

↓

Compare assignedToId === user.id

↓

Allow or Reject
```

---

# 18. Comment Module

Routes:

```text
GET  /api/v1/tasks/:id/comments
POST /api/v1/tasks/:id/comments
```

Tasks:

* [x] Create comment module
* [x] Get task comments
* [x] Add comment
* [x] Create activity log
* [x] Create notification if needed

Access:

* [x] SUPER_ADMIN can comment all tasks
* [x] DESIGNER can comment assigned tasks
* [x] VIEWER can read comments only

---

# 19. Revision Note Module

Routes:

```text
GET  /api/v1/tasks/:id/revisions
POST /api/v1/tasks/:id/revisions
```

Tasks:

* [x] Create revision module
* [x] Get revision notes
* [x] Add revision note
* [x] Create activity log
* [x] Create notification

Access:

* [x] SUPER_ADMIN can add revision notes
* [x] DESIGNER can add revision notes for assigned tasks
* [x] VIEWER read only

---

# 20. Activity Module

Route:

```text
GET /api/v1/activity
```

Tasks:

* [x] Create activity module
* [x] Get activity logs with pagination
* [x] Filter by user
* [x] Filter by task
* [x] Filter by action
* [x] Filter by date range
* [x] Format oldValue/newValue consistently

Access:

* [x] SUPER_ADMIN can view all activity
* [x] DESIGNER can view own related activity
* [x] VIEWER read only

---

# 21. Workload Module

Routes:

```text
GET /api/v1/workload
GET /api/v1/workload/:designerId
```

Tasks:

* [x] Create workload module
* [x] Get workload grouped by designer
* [x] Count active tasks per designer
* [x] Count working tasks per designer
* [x] Count revision tasks per designer
* [x] Count overdue tasks per designer
* [x] Calculate average progress per designer
* [x] Get designer workload detail
* [x] Group designer tasks by status
* [x] Sort designer tasks by due date

Access:

* [x] SUPER_ADMIN can view all workload
* [x] DESIGNER can view own workload
* [x] VIEWER read only

---

# 22. Dashboard Module

Route:

```text
GET /api/v1/dashboard/summary
```

Tasks:

* [x] Create dashboard module
* [x] Return total tasks
* [x] Return working count
* [x] Return revision count
* [x] Return ready upload count
* [x] Return overdue count
* [x] Return my tasks
* [x] Return due today tasks
* [x] Return workload summary
* [x] Return recent activity

Role behavior:

* [x] SUPER_ADMIN sees all task summary
* [x] DESIGNER sees own task summary
* [x] VIEWER sees read-only summary

---

# 23. Notification Module

Routes:

```text
GET   /api/v1/notifications
PATCH /api/v1/notifications/:id/read
PATCH /api/v1/notifications/read-all
```

Trial priority:

* [x] Create notification model usage
* [x] Create notification on task assigned
* [x] Create notification on revision added
* [x] Create notification on status changed
* [x] Get notifications for logged-in user
* [x] Mark notification as read
* [x] Mark all as read

Can postpone:

* [ ] Deadline approaching cron
* [ ] Overdue cron

---

# 24. Attachment Module

Routes:

```text
POST   /api/v1/tasks/:id/attachments
DELETE /api/v1/attachments/:id
```

Trial priority:

* [x] Setup upload directory
* [x] Setup Multer helper (Using Elysia native)
* [x] Configure Multer disk storage (Using Elysia native)
* [x] Configure unique filename generator
* [x] Configure file filter
* [x] Validate file type
* [x] Validate file size
* [x] Upload preview file
* [x] Save attachment metadata
* [x] Delete attachment soft delete
* [x] Serve uploaded files

Allowed:

```text
jpg
jpeg
png
pdf
```

Max size:

```text
5MB
```

Can postpone:

* [ ] Advanced file preview
* [ ] Multiple upload optimization

---

# 25. Validation Rules

Global validation:

* [ ] Required fields
* [ ] String length limit
* [ ] Valid enum values
* [ ] Valid date format
* [ ] Progress range by status
* [ ] File size limit
* [ ] File type limit

Task validation:

* [ ] title required
* [ ] categoryId required
* [ ] priorityId required
* [ ] patternSize required (10, 12, 14)
* [ ] assignedToId required
* [ ] referenceNumber optional
* [ ] dueDate optional
* [ ] description optional
* [ ] fileReference optional

---

# 26. Security Checklist

* [ ] Password hashed
* [ ] JWT secret from env
* [ ] JWT in HttpOnly Cookie
* [ ] Cookie secure in production
* [ ] SameSite configured
* [ ] CORS restricted to frontend origin
* [ ] No passwordHash in response
* [ ] RBAC enforced in backend
* [ ] Ownership validation enforced
* [ ] Upload file validation
* [ ] Soft delete instead of hard delete for important records

---

# 27. Trial Deployment

Local trial options:

* [ ] Run on office local network
* [ ] Backend accessible from LAN IP
* [ ] Frontend points to backend LAN IP
* [ ] PostgreSQL running locally or Docker

Production-like option:

* [ ] Nginx reverse proxy
* [ ] Docker compose
* [ ] PostgreSQL volume
* [ ] Uploads volume
* [ ] Environment configured

---

# 28. Testing Checklist

Auth:

* [ ] Super Admin login
* [ ] Designer login
* [ ] Viewer login
* [ ] Logout
* [ ] Invalid login rejected

Task:

* [ ] Super Admin create task
* [ ] Designer sees assigned task
* [ ] Designer cannot edit other designer task
* [ ] Designer can update own progress
* [ ] Designer can update own status
* [ ] Designer can add comment
* [ ] Progress validation works

Workload:

* [ ] Workload grouped by designer
* [ ] Designer detail works
* [ ]
