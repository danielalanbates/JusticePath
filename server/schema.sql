-- JusticePath Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  date_of_birth DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Cases table
CREATE TABLE IF NOT EXISTS cases (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  case_number VARCHAR(50),
  court_name VARCHAR(255),
  case_type VARCHAR(50), -- criminal, civil, appeal, expungement
  status VARCHAR(50), -- active, pending, closed, appealed
  charge_description TEXT,
  attorney_id INTEGER,
  next_court_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  case_id INTEGER REFERENCES cases(id),
  title VARCHAR(255),
  document_type VARCHAR(50), -- motion, evidence, correspondence, court_order
  file_path VARCHAR(500),
  encrypted BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Evidence items
CREATE TABLE IF NOT EXISTS evidence (
  id SERIAL PRIMARY KEY,
  case_id INTEGER REFERENCES cases(id),
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(255),
  description TEXT,
  evidence_type VARCHAR(50), -- photo, video, document, witness_statement, audio
  file_path VARCHAR(500),
  date_collected DATE,
  chain_of_custody TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rehabilitation plans
CREATE TABLE IF NOT EXISTS rehab_plans (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  goal_type VARCHAR(50), -- education, vocational, mental_health, substance_abuse, community_service
  goal_description TEXT,
  target_completion DATE,
  status VARCHAR(50), -- in_progress, completed, paused
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Progress tracking
CREATE TABLE IF NOT EXISTS progress_entries (
  id SERIAL PRIMARY KEY,
  rehab_plan_id INTEGER REFERENCES rehab_plans(id),
  user_id INTEGER REFERENCES users(id),
  entry_type VARCHAR(50), -- course_completed, hours_logged, milestone_reached, counseling_session
  description TEXT,
  hours_completed DECIMAL(5,2),
  entry_date DATE,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Court dates
CREATE TABLE IF NOT EXISTS court_dates (
  id SERIAL PRIMARY KEY,
  case_id INTEGER REFERENCES cases(id),
  user_id INTEGER REFERENCES users(id),
  date_time TIMESTAMP,
  court_location VARCHAR(255),
  hearing_type VARCHAR(100),
  notes TEXT,
  reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resources directory
CREATE TABLE IF NOT EXISTS resources (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  category VARCHAR(50), -- legal_aid, housing, employment, mental_health, substance_abuse, education
  description TEXT,
  contact_info TEXT,
  address VARCHAR(255),
  phone VARCHAR(20),
  website VARCHAR(255),
  service_area VARCHAR(100), -- geographic coverage
  eligibility_requirements TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages (for mentor/support)
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER REFERENCES users(id),
  recipient_id INTEGER REFERENCES users(id),
  content TEXT,
  is_encrypted BOOLEAN DEFAULT true,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_cases_user ON cases(user_id);
CREATE INDEX idx_documents_user ON documents(user_id);
CREATE INDEX idx_evidence_case ON evidence(case_id);
CREATE INDEX idx_court_dates_case ON court_dates(case_id);
CREATE INDEX idx_resources_category ON resources(category);
