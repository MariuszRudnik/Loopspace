# Database: Create migration

...existing content...

## Example Migration

Below is an example migration for creating the `courses` table:

```sql
-- Migration: Create courses table
-- Purpose: Store course data with metadata and ownership
-- Special considerations: Enable RLS and define policies for public and owner access

create table courses (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text,
    thumbnail_url text,
    is_public boolean default false,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    created_by uuid references profiles(id) on delete cascade
);

-- Enable Row Level Security (RLS)
alter table courses enable row level security;

-- RLS Policies
create policy "Public access to courses" on courses
    for select using (is_public = true);

create policy "Manage own courses" on courses
    for all using (auth.uid() = created_by);
```

### Additional Examples

#### Creating the admin_users table:

```sql
-- Admin users table to track administrator privileges
create table admin_users (
    user_id uuid primary key references profiles(id) on delete cascade,
    granted_at timestamp with time zone default now(),
    granted_by uuid references profiles(id)
);

-- Enable RLS
alter table admin_users enable row level security;

-- Only allow administrators to see who else is an administrator
create policy "Administrators can manage admin_users" on admin_users
    for all using (exists (select 1 from admin_users where user_id = auth.uid()));
```

#### Creating the lessons table:

```sql
create table lessons (
    id uuid default gen_random_uuid() primary key,
    course_id uuid not null references courses(id) on delete cascade,
    title text not null,
    content text,
    order_number integer not null,
    is_published boolean default false,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table lessons enable row level security;

-- RLS policies
create policy "Public access to lessons of public courses" on lessons
    for select using (
        exists (
            select 1 from courses 
            where courses.id = lessons.course_id 
            and courses.is_public = true
        )
    );

create policy "Course creators can manage lessons" on lessons
    for all using (
        exists (
            select 1 from courses
            where courses.id = lessons.course_id
            and courses.created_by = auth.uid()
        )
    );
```

Follow this structure for all other tables and policies.
