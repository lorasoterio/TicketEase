-- ============================================================
-- TicketEase – PostgreSQL Schema
-- ============================================================

-- ── ENUM Types ───────────────────────────────────────────────
CREATE TYPE user_role       AS ENUM ('Student', 'Staff', 'Admin');
CREATE TYPE ticket_type     AS ENUM ('Document Request', 'Inquiry');
CREATE TYPE ticket_priority AS ENUM ('Low', 'Normal', 'High');
CREATE TYPE ticket_status   AS ENUM (
    'Pending', 'Assigned', 'In Progress',
    'Ready for Pickup', 'Completed', 'Rejected', 'Closed'
);

-- ── Shared trigger function for updated_at ───────────────────
-- Create once; reused by every table that has an updated_at column.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ── 1. Users ─────────────────────────────────────────────────
CREATE TABLE Users (
    user_id       INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email         VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role          user_role NOT NULL,
    is_active     BOOLEAN DEFAULT TRUE,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_updated_at_users
BEFORE UPDATE ON Users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 2. Students ──────────────────────────────────────────────
CREATE TABLE Students (
    student_id        INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id           INT NOT NULL UNIQUE,
    school_student_id VARCHAR(50) UNIQUE,
    full_name         VARCHAR(100),
    course_program    VARCHAR(100),
    year_level        VARCHAR(20),
    contact_number    VARCHAR(20),
    address           TEXT,
    is_verified       BOOLEAN DEFAULT FALSE,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TRIGGER set_updated_at_students
BEFORE UPDATE ON Students
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 3. Staffs ────────────────────────────────────────────────
CREATE TABLE Staffs (
    staff_id       INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id        INT NOT NULL UNIQUE,
    full_name      VARCHAR(100),
    position       VARCHAR(50),
    department     VARCHAR(50),
    contact_number VARCHAR(20),
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TRIGGER set_updated_at_staffs
BEFORE UPDATE ON Staffs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 4. Tickets ───────────────────────────────────────────────
-- Fix: assigned_staff_id now correctly references Staffs, not TicketAssignments.
CREATE TABLE Tickets (
    ticket_id            INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id           INT NOT NULL,
    ticket_type          ticket_type NOT NULL,
    subject              VARCHAR(255),
    description          TEXT,
    priority             ticket_priority DEFAULT 'Normal',
    status               ticket_status DEFAULT 'Pending',
    estimated_completion TIMESTAMP,
    assigned_staff_id    INT,
    created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id)        REFERENCES Students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_staff_id) REFERENCES Staffs(staff_id) ON DELETE SET NULL
);

CREATE TRIGGER set_updated_at_tickets
BEFORE UPDATE ON Tickets
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 5. TicketAssignments ─────────────────────────────────────
-- Tracks the full assignment history (audit trail).
CREATE TABLE TicketAssignments (
    assignment_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ticket_id     INT NOT NULL,
    assigned_to   INT NOT NULL, -- staff_id
    assigned_by   INT NOT NULL, -- staff_id (admin/supervisor)
    assigned_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id)   REFERENCES Tickets(ticket_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES Staffs(staff_id),
    FOREIGN KEY (assigned_by) REFERENCES Staffs(staff_id)
);

-- ── 6. TicketStatusHistory ───────────────────────────────────
-- Tracks every status transition.
-- Fix: changed_by is nullable so ON DELETE SET NULL is valid.
CREATE TABLE TicketStatusHistory (
    status_history_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ticket_id         INT NOT NULL,
    old_status        ticket_status,
    new_status        ticket_status,
    changed_by        INT,           -- nullable: user may be deleted
    changed_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id)  REFERENCES Tickets(ticket_id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES Users(user_id) ON DELETE SET NULL
);

-- ── 7. TicketMessages ────────────────────────────────────────
-- Handles conversation between student and staff.
-- Fix: sender_id is nullable so ON DELETE SET NULL is valid.
CREATE TABLE TicketMessages (
    message_id  INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ticket_id   INT NOT NULL,
    sender_id   INT,           -- nullable: user may be deleted
    message     TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE, -- TRUE = staff-only note
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES Tickets(ticket_id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES Users(user_id) ON DELETE SET NULL
);

-- ── 8. Notifications ─────────────────────────────────────────
-- Fix: added ON DELETE CASCADE to user_id so deleting a user
--      removes their notifications instead of being blocked.
CREATE TABLE Notifications (
    notification_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id         INT NOT NULL,
    ticket_id       INT,
    message         VARCHAR(255) NOT NULL,
    is_read         BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)   REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (ticket_id) REFERENCES Tickets(ticket_id) ON DELETE CASCADE
);

-- ── 9. AuditLogs ─────────────────────────────────────────────
-- Fix: user_id is nullable so ON DELETE SET NULL is valid.
CREATE TABLE AuditLogs (
    log_id      INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     INT,           -- nullable: user may be deleted
    action_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),  -- e.g. 'Ticket', 'Assignment'
    entity_id   INT,
    description TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE SET NULL
);
