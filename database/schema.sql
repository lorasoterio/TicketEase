-- ============================================================
-- TicketEase – PostgreSQL Schema
-- ============================================================

-- ── ENUM Types ───────────────────────────────────────────────
CREATE TYPE user_role       AS ENUM ('Student', 'Staff', 'Admin');
-- NOTE: ticket_type is intentionally kept as a simple ENUM for now.
-- If document sub-types grow (transcripts, certificates, etc.) consider
-- replacing this with a DocumentTypes reference table for extensibility.
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
-- Users.is_active is the single source of truth for login state.
-- Staffs does NOT duplicate this flag to avoid inconsistency.
CREATE TABLE Users (
    user_id       INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email         VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role          user_role NOT NULL,
    is_active     BOOLEAN DEFAULT TRUE,  -- single source of truth for account state
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
    verified_by       INT,           -- staff_id who performed verification
    verified_at       TIMESTAMP,     -- when verification occurred
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)    REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES Staffs(staff_id) ON DELETE SET NULL
);

CREATE TRIGGER set_updated_at_students
BEFORE UPDATE ON Students
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_students_user_id    ON Students(user_id);
CREATE INDEX idx_students_verified_by ON Students(verified_by);

-- ── 3. Staffs ────────────────────────────────────────────────
-- No is_active here; use Users.is_active as the single login-state flag.
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

CREATE INDEX idx_staffs_user_id ON Staffs(user_id);

-- ── 4. Tickets ───────────────────────────────────────────────
-- assigned_staff_id is a denormalized "current assignee" shortcut.
-- It MUST be updated atomically (within the same transaction) whenever
-- a new row is inserted into TicketAssignments.
CREATE TABLE Tickets (
    ticket_id            INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id           INT NOT NULL,
    ticket_type          ticket_type NOT NULL,
    subject              VARCHAR(255),
    description          TEXT,
    priority             ticket_priority DEFAULT 'Normal',
    status               ticket_status DEFAULT 'Pending',
    estimated_completion TIMESTAMP,
    completed_at         TIMESTAMP,     -- actual completion/closure timestamp
    assigned_staff_id    INT,           -- denormalized current assignee; sync via transaction
    created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id)        REFERENCES Students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_staff_id) REFERENCES Staffs(staff_id) ON DELETE SET NULL
);

CREATE TRIGGER set_updated_at_tickets
BEFORE UPDATE ON Tickets
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_tickets_student_id        ON Tickets(student_id);
CREATE INDEX idx_tickets_assigned_staff_id ON Tickets(assigned_staff_id);

-- ── 5. TicketAssignments ─────────────────────────────────────
-- Full assignment history (audit trail).
-- Inserting here should always be paired with updating Tickets.assigned_staff_id
-- in the same transaction.
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

CREATE INDEX idx_ta_ticket_id   ON TicketAssignments(ticket_id);
CREATE INDEX idx_ta_assigned_to ON TicketAssignments(assigned_to);
CREATE INDEX idx_ta_assigned_by ON TicketAssignments(assigned_by);

-- ── 6. TicketStatusHistory ───────────────────────────────────
-- Every status transition is recorded here.
-- changed_by is nullable so a hard-deleted user does not block the row.
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

CREATE INDEX idx_tsh_ticket_id ON TicketStatusHistory(ticket_id);

-- ── 7. TicketMessages ────────────────────────────────────────
-- Conversation between student and staff.
-- sender_id is nullable so a hard-deleted user does not block the row.
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

CREATE INDEX idx_tm_ticket_id ON TicketMessages(ticket_id);

-- ── 8. TicketAttachments ─────────────────────────────────────
-- Stores file uploads linked to a ticket (and optionally a message).
CREATE TABLE TicketAttachments (
    attachment_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ticket_id     INT NOT NULL,
    message_id    INT,               -- optionally linked to a specific message
    uploaded_by   INT NOT NULL,      -- user_id
    file_name     VARCHAR(255) NOT NULL,
    file_path     VARCHAR(500) NOT NULL,
    file_size     INT,               -- bytes
    uploaded_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id)   REFERENCES Tickets(ticket_id) ON DELETE CASCADE,
    FOREIGN KEY (message_id)  REFERENCES TicketMessages(message_id) ON DELETE SET NULL,
    FOREIGN KEY (uploaded_by) REFERENCES Users(user_id)
);

CREATE INDEX idx_attach_ticket_id  ON TicketAttachments(ticket_id);
CREATE INDEX idx_attach_message_id ON TicketAttachments(message_id);

-- ── 9. Notifications ─────────────────────────────────────────
-- In-platform alerts. Cascades on both user and ticket deletion.
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

CREATE INDEX idx_notif_user_id   ON Notifications(user_id);
CREATE INDEX idx_notif_ticket_id ON Notifications(ticket_id);

-- ── 10. AuditLogs ────────────────────────────────────────────
-- Full system-wide action log. user_id is nullable so a hard-deleted
-- user does not prevent the log row from surviving.
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

CREATE INDEX idx_audit_user_id ON AuditLogs(user_id);
CREATE INDEX idx_audit_entity  ON AuditLogs(entity_type, entity_id);
