-- Tworzenie tabeli profiles
CREATE TABLE profiles (
                          id uuid PRIMARY KEY,
                          email text NOT NULL,
                          display_name text,
                          avatar_url text,
                          created_at timestamp DEFAULT now(),
                          updated_at timestamp DEFAULT now()
);

-- Tabela admin_users
CREATE TABLE admin_users (
                             user_id uuid PRIMARY KEY REFERENCES profiles(id),
                             granted_at timestamp DEFAULT now(),
                             granted_by uuid REFERENCES profiles(id)
);

-- Tabela channels (bez can_have_* kolumn)
CREATE TABLE channels (
                          id uuid PRIMARY KEY,
                          name text NOT NULL,
                          description text,
                          created_at timestamp DEFAULT now(),
                          updated_at timestamp DEFAULT now(),
                          created_by uuid REFERENCES profiles(id)
);

-- Tabela courses
CREATE TABLE courses (
                         id uuid PRIMARY KEY,
                         title text NOT NULL,
                         description text,
                         thumbnail_url text,
                         is_public boolean DEFAULT false,
                         created_at timestamp DEFAULT now(),
                         updated_at timestamp DEFAULT now(),
                         created_by uuid REFERENCES profiles(id)
);

-- Tabela [lessons]
CREATE TABLE lessons (
                         id uuid PRIMARY KEY,
                         course_id uuid REFERENCES courses(id),
                         title text NOT NULL,
                         content text,
                         order_number text,
                         is_published boolean DEFAULT false,
                         created_at timestamp DEFAULT now()
);

-- Tabela comments
CREATE TABLE comments (
                          id uuid PRIMARY KEY,
                          lesson_id uuid REFERENCES lessons(id),
                          user_id uuid REFERENCES profiles(id),
                          content text,
                          created_at timestamp DEFAULT now(),
                          updated_at timestamp DEFAULT now()
);

-- Tabela progress
CREATE TABLE progress (
                          id uuid PRIMARY KEY,
                          user_id uuid REFERENCES profiles(id),
                          lesson_id uuid REFERENCES lessons(id),
                          completed boolean DEFAULT false,
                          last_position text,
                          updated_at timestamp DEFAULT now()
);

-- Tabela enrollments
CREATE TABLE enrollments (
                             id uuid PRIMARY KEY,
                             user_id uuid REFERENCES profiles(id),
                             course_id uuid REFERENCES courses(id),
                             enrolled_at timestamp DEFAULT now()
);
