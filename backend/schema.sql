-- =========================================================================
-- ESQUEMA DO BANCO DE DADOS SUPABASE (PSICOPLAY)
-- Execute este script no SQL Editor do seu projeto Supabase
-- =========================================================================

-- Tabela de Pacientes
CREATE TABLE IF NOT EXISTS patients (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT, -- ID do Terapeuta autenticado no Clerk
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  birth_date TEXT,
  diagnosis TEXT NOT NULL,
  cid TEXT,
  guardian_name TEXT NOT NULL,
  guardian_phone TEXT,
  school_grade TEXT,
  avatar_color TEXT DEFAULT '#A8E6CF',
  sensory_profile JSONB DEFAULT '{}'::jsonb,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Sessões de Atendimento Clínico
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT, -- ID do Terapeuta autenticado no Clerk
  patient_id TEXT REFERENCES patients(id) ON DELETE CASCADE,
  patient_name TEXT,
  session_date TEXT NOT NULL,
  session_time TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 50,
  therapist_name TEXT NOT NULL,
  initial_mood TEXT,
  final_mood TEXT,
  games_played TEXT[],
  clinical_observations TEXT,
  family_recommendations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Métricas e Reações nos Jogos Terapêuticos
CREATE TABLE IF NOT EXISTS game_metrics (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT, -- ID do Terapeuta autenticado no Clerk
  session_id TEXT REFERENCES sessions(id) ON DELETE SET NULL,
  patient_id TEXT REFERENCES patients(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  game_title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration_seconds INTEGER NOT NULL,
  score INTEGER NOT NULL,
  touches_count INTEGER DEFAULT 0,
  mistakes_count INTEGER DEFAULT 0,
  autonomy TEXT NOT NULL, -- 'independente', 'dica_verbal', 'apoio_gestual', 'apoio_fisico_leve'
  sensory_state TEXT NOT NULL, -- 'calmo', 'focado', 'em_alerta', 'sobrecarregado', 'desatento'
  clinical_notes TEXT
);

-- Tabela de Agendamentos / Calendário Clínico
CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT, -- ID do Terapeuta autenticado no Clerk
  patient_id TEXT REFERENCES patients(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  diagnosis TEXT,
  appointment_date TEXT NOT NULL,
  appointment_time TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 50,
  status TEXT DEFAULT 'confirmado', -- 'confirmado', 'em_atendimento', 'concluido', 'cancelado'
  target_goals TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices de consulta rápida
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_patient_id ON sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_metrics_user_id ON game_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_metrics_patient_id ON game_metrics(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);

-- =========================================================================
-- Habilitação de RLS (Row Level Security) e Políticas de Acesso
-- =========================================================================
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso para a tabela patients
DROP POLICY IF EXISTS "Permitir leitura de pacientes" ON patients;
CREATE POLICY "Permitir leitura de pacientes" ON patients FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir escrita de pacientes" ON patients;
CREATE POLICY "Permitir escrita de pacientes" ON patients FOR ALL USING (true) WITH CHECK (true);

-- Políticas de acesso para a tabela sessions
DROP POLICY IF EXISTS "Permitir leitura de sessões" ON sessions;
CREATE POLICY "Permitir leitura de sessões" ON sessions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir escrita de sessões" ON sessions;
CREATE POLICY "Permitir escrita de sessões" ON sessions FOR ALL USING (true) WITH CHECK (true);

-- Políticas de acesso para a tabela game_metrics
DROP POLICY IF EXISTS "Permitir leitura de métricas" ON game_metrics;
CREATE POLICY "Permitir leitura de métricas" ON game_metrics FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir escrita de métricas" ON game_metrics;
CREATE POLICY "Permitir escrita de métricas" ON game_metrics FOR ALL USING (true) WITH CHECK (true);

-- Políticas de acesso para a tabela appointments
DROP POLICY IF EXISTS "Permitir leitura de agendamentos" ON appointments;
CREATE POLICY "Permitir leitura de agendamentos" ON appointments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir escrita de agendamentos" ON appointments;
CREATE POLICY "Permitir escrita de agendamentos" ON appointments FOR ALL USING (true) WITH CHECK (true);

