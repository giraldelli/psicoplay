import { Patient, SessionRecord, GameMetricRecord, Appointment } from './types.ts';
import { getSupabase, isSupabaseConfigured } from './supabase.ts';

export const INITIAL_PATIENTS: Patient[] = [];
export const INITIAL_APPOINTMENTS: Appointment[] = [];
export const INITIAL_METRICS: GameMetricRecord[] = [];
export const INITIAL_SESSIONS: SessionRecord[] = [];

const CHAVES_STORAGE = {
  PATIENTS: 'psicoplay_patients_v2',
  SESSIONS: 'psicoplay_sessions_v2',
  METRICS: 'psicoplay_metrics_v2',
  APPOINTMENTS: 'psicoplay_appointments_v2',
};

export class DataService {
  private static carregarLocal<T>(chave: string, valorPadrao: T): T {
    if (typeof window === 'undefined') return valorPadrao;
    try {
      const conteudo = localStorage.getItem(chave);
      if (!conteudo) {
        localStorage.setItem(chave, JSON.stringify(valorPadrao));
        return valorPadrao;
      }
      return JSON.parse(conteudo) as T;
    } catch {
      return valorPadrao;
    }
  }

  private static salvarLocal<T>(chave: string, dados: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(chave, JSON.stringify(dados));
    } catch (erro) {
      console.warn('Erro ao salvar no localStorage:', erro);
    }
  }

  // Sincronização remota inicial a partir do Supabase
  static async carregarDadosRemotos(usuarioId?: string): Promise<{
    pacientes: Patient[];
    agendamentos: Appointment[];
    metricas: GameMetricRecord[];
    sessoes: SessionRecord[];
  }> {
    if (!isSupabaseConfigured()) {
      return {
        pacientes: this.getPatients(),
        agendamentos: this.getAppointments(),
        metricas: this.getMetrics(),
        sessoes: this.getSessions(),
      };
    }

    const sb = getSupabase();
    if (!sb) {
      return {
        pacientes: this.getPatients(),
        agendamentos: this.getAppointments(),
        metricas: this.getMetrics(),
        sessoes: this.getSessions(),
      };
    }

    try {
      let queryPacientes = sb.from('patients').select('*').order('created_at', { ascending: false });
      let queryAgendamentos = sb.from('appointments').select('*').order('appointment_date', { ascending: true });
      let queryMetricas = sb.from('game_metrics').select('*').order('created_at', { ascending: false });
      let querySessoes = sb.from('sessions').select('*').order('created_at', { ascending: false });

      if (usuarioId) {
        queryPacientes = queryPacientes.eq('user_id', usuarioId);
        queryAgendamentos = queryAgendamentos.eq('user_id', usuarioId);
        queryMetricas = queryMetricas.eq('user_id', usuarioId);
        querySessoes = querySessoes.eq('user_id', usuarioId);
      }

      const [resPacientes, resAgendamentos, resMetricas, resSessoes] = await Promise.all([
        queryPacientes,
        queryAgendamentos,
        queryMetricas,
        querySessoes,
      ]);

      if (resPacientes.data && resPacientes.data.length > 0) {
        const pacientesMapeados: Patient[] = resPacientes.data.map((item: Record<string, unknown>) => ({
          id: String(item.id),
          name: String(item.name || ''),
          age: Number(item.age || 0),
          birthDate: String(item.birth_date || ''),
          diagnosis: String(item.diagnosis || ''),
          cid: String(item.cid || ''),
          guardianName: String(item.guardian_name || ''),
          guardianPhone: String(item.guardian_phone || ''),
          schoolGrade: String(item.school_grade || ''),
          avatarColor: String(item.avatar_color || '#A8E6CF'),
          sensoryProfile: (item.sensory_profile as Patient['sensoryProfile']) || {
            auditorySensitivity: 'baixa',
            visualSensitivity: 'baixa',
            tactileSensitivity: 'baixa',
            hyperfocusInterests: [],
            sensoryTriggers: [],
            calmingTechniques: [],
          },
          notes: String(item.notes || ''),
          createdAt: String(item.created_at || '').split('T')[0],
          sessionsCount: 0,
          lastSessionDate: 'Sem sessões registradas',
        }));
        this.salvarLocal(CHAVES_STORAGE.PATIENTS, pacientesMapeados);
      }

      if (resAgendamentos.data && resAgendamentos.data.length > 0) {
        const agendamentosMapeados: Appointment[] = resAgendamentos.data.map((item: Record<string, unknown>) => ({
          id: String(item.id),
          patientId: String(item.patient_id || ''),
          patientName: String(item.patient_name || ''),
          diagnosis: String(item.diagnosis || ''),
          date: String(item.appointment_date || ''),
          time: String(item.appointment_time || ''),
          durationMinutes: Number(item.duration_minutes || 50),
          status: (item.status as Appointment['status']) || 'confirmado',
          targetGoals: (item.target_goals as string[]) || [],
        }));
        this.salvarLocal(CHAVES_STORAGE.APPOINTMENTS, agendamentosMapeados);
      }

      if (resMetricas.data && resMetricas.data.length > 0) {
        const metricasMapeadas: GameMetricRecord[] = resMetricas.data.map((item: Record<string, unknown>) => ({
          id: String(item.id),
          sessionId: item.session_id ? String(item.session_id) : undefined,
          patientId: String(item.patient_id || ''),
          gameId: String(item.game_id || ''),
          gameTitle: String(item.game_title || ''),
          date: String(item.created_at || '').split('T')[0],
          durationSeconds: Number(item.duration_seconds || 0),
          score: Number(item.score || 0),
          touchesCount: Number(item.touches_count || 0),
          mistakesCount: Number(item.mistakes_count || 0),
          autonomy: (item.autonomy as GameMetricRecord['autonomy']) || 'independente',
          sensoryState: (item.sensory_state as GameMetricRecord['sensoryState']) || 'calmo',
          clinicalNotes: String(item.clinical_notes || ''),
        }));
        this.salvarLocal(CHAVES_STORAGE.METRICS, metricasMapeadas);
      }

      if (resSessoes.data && resSessoes.data.length > 0) {
        const sessoesMapeadas: SessionRecord[] = resSessoes.data.map((item: Record<string, unknown>) => ({
          id: String(item.id),
          patientId: String(item.patient_id || ''),
          patientName: String(item.patient_name || ''),
          date: String(item.session_date || ''),
          time: String(item.session_time || ''),
          durationMinutes: Number(item.duration_minutes || 50),
          therapistName: String(item.therapist_name || ''),
          initialMood: (item.initial_mood as SessionRecord['initialMood']) || 'calmo',
          finalMood: (item.final_mood as SessionRecord['finalMood']) || 'calmo',
          gamesPlayed: (item.games_played as string[]) || [],
          clinicalObservations: String(item.clinical_observations || ''),
          familyRecommendations: String(item.family_recommendations || ''),
          gameMetrics: [],
        }));
        this.salvarLocal(CHAVES_STORAGE.SESSIONS, sessoesMapeadas);
      }
    } catch (erroCarregamento) {
      console.warn('Erro ao sincronizar do Supabase, utilizando cache local:', erroCarregamento);
    }

    return {
      pacientes: this.getPatients(),
      agendamentos: this.getAppointments(),
      metricas: this.getMetrics(),
      sessoes: this.getSessions(),
    };
  }

  // PACIENTES
  static getPatients(): Patient[] {
    return this.carregarLocal<Patient[]>(CHAVES_STORAGE.PATIENTS, INITIAL_PATIENTS);
  }

  static savePatient(paciente: Patient, usuarioId?: string): void {
    const lista = this.getPatients();
    const indiceExistente = lista.findIndex((p) => p.id === paciente.id);
    if (indiceExistente >= 0) {
      lista[indiceExistente] = paciente;
    } else {
      lista.unshift(paciente);
    }
    this.salvarLocal(CHAVES_STORAGE.PATIENTS, lista);

    if (isSupabaseConfigured()) {
      const sb = getSupabase();
      if (sb) {
        sb.from('patients')
          .upsert({
            id: paciente.id,
            user_id: usuarioId || null,
            name: paciente.name,
            age: paciente.age,
            birth_date: paciente.birthDate,
            diagnosis: paciente.diagnosis,
            cid: paciente.cid,
            guardian_name: paciente.guardianName,
            guardian_phone: paciente.guardianPhone,
            school_grade: paciente.schoolGrade,
            avatar_color: paciente.avatarColor,
            sensory_profile: paciente.sensoryProfile,
            notes: paciente.notes,
          })
          .then(({ error }: { error: unknown }) => {
            if (error) console.warn('Erro ao sincronizar paciente no Supabase:', error);
          });
      }
    }
  }

  // AGENDAMENTOS / CALENDÁRIO
  static getAppointments(): Appointment[] {
    return this.carregarLocal<Appointment[]>(CHAVES_STORAGE.APPOINTMENTS, INITIAL_APPOINTMENTS);
  }

  static saveAppointment(agendamento: Appointment, usuarioId?: string): void {
    const lista = this.getAppointments();
    const indiceExistente = lista.findIndex((a) => a.id === agendamento.id);
    if (indiceExistente >= 0) {
      lista[indiceExistente] = agendamento;
    } else {
      lista.push(agendamento);
    }
    this.salvarLocal(CHAVES_STORAGE.APPOINTMENTS, lista);

    if (isSupabaseConfigured()) {
      const sb = getSupabase();
      if (sb) {
        sb.from('appointments')
          .upsert({
            id: agendamento.id,
            user_id: usuarioId || null,
            patient_id: agendamento.patientId,
            patient_name: agendamento.patientName,
            diagnosis: agendamento.diagnosis,
            appointment_date: agendamento.date,
            appointment_time: agendamento.time,
            duration_minutes: agendamento.durationMinutes,
            status: agendamento.status,
            target_goals: agendamento.targetGoals,
          })
          .then(({ error }: { error: unknown }) => {
            if (error) console.warn('Erro ao sincronizar agendamento no Supabase:', error);
          });
      }
    }
  }

  // MÉTRICAS DOS JOGOS
  static getMetrics(pacienteId?: string): GameMetricRecord[] {
    const todas = this.carregarLocal<GameMetricRecord[]>(CHAVES_STORAGE.METRICS, INITIAL_METRICS);
    return pacienteId ? todas.filter((m) => m.patientId === pacienteId) : todas;
  }

  static recordGameMetric(metrica: GameMetricRecord, usuarioId?: string): void {
    const todas = this.carregarLocal<GameMetricRecord[]>(CHAVES_STORAGE.METRICS, INITIAL_METRICS);
    todas.unshift(metrica);
    this.salvarLocal(CHAVES_STORAGE.METRICS, todas);

    const pacientes = this.getPatients();
    const paciente = pacientes.find((p) => p.id === metrica.patientId);
    if (paciente) {
      paciente.sessionsCount = (paciente.sessionsCount || 0) + 1;
      paciente.lastSessionDate = metrica.date;
      this.salvarLocal(CHAVES_STORAGE.PATIENTS, pacientes);
    }

    if (isSupabaseConfigured()) {
      const sb = getSupabase();
      if (sb) {
        sb.from('game_metrics')
          .upsert({
            id: metrica.id,
            user_id: usuarioId || null,
            session_id: metrica.sessionId || null,
            patient_id: metrica.patientId,
            game_id: metrica.gameId,
            game_title: metrica.gameTitle,
            duration_seconds: metrica.durationSeconds,
            score: metrica.score,
            touches_count: metrica.touchesCount,
            mistakes_count: metrica.mistakesCount,
            autonomy: metrica.autonomy,
            sensory_state: metrica.sensoryState,
            clinical_notes: metrica.clinicalNotes,
          })
          .then(({ error }: { error: unknown }) => {
            if (error) console.warn('Erro ao sincronizar métrica no Supabase:', error);
          });
      }
    }
  }

  // SESSÕES CLÍNICAS
  static getSessions(pacienteId?: string): SessionRecord[] {
    const todas = this.carregarLocal<SessionRecord[]>(CHAVES_STORAGE.SESSIONS, INITIAL_SESSIONS);
    return pacienteId ? todas.filter((s) => s.patientId === pacienteId) : todas;
  }

  static saveSession(sessao: SessionRecord, usuarioId?: string): void {
    const todas = this.getSessions();
    todas.unshift(sessao);
    this.salvarLocal(CHAVES_STORAGE.SESSIONS, todas);

    if (isSupabaseConfigured()) {
      const sb = getSupabase();
      if (sb) {
        sb.from('sessions')
          .upsert({
            id: sessao.id,
            user_id: usuarioId || null,
            patient_id: sessao.patientId,
            patient_name: sessao.patientName,
            session_date: sessao.date,
            session_time: sessao.time,
            duration_minutes: sessao.durationMinutes,
            therapist_name: sessao.therapistName,
            initial_mood: sessao.initialMood,
            final_mood: sessao.finalMood,
            games_played: sessao.gamesPlayed,
            clinical_observations: sessao.clinicalObservations,
            family_recommendations: sessao.familyRecommendations,
          })
          .then(({ error }: { error: unknown }) => {
            if (error) console.warn('Erro ao sincronizar sessão no Supabase:', error);
          });
      }
    }
  }
}
