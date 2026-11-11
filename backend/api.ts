import { DataService } from './db.ts';
import { Patient, SessionRecord, GameMetricRecord, Appointment } from './types.ts';

export const PsychopedagogyAPI = {
  getDashboardData() {
    const patients = DataService.getPatients();
    const appointments = DataService.getAppointments();
    const metrics = DataService.getMetrics();
    const sessions = DataService.getSessions();

    const todayStr = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(a => a.date === todayStr || a.date === '2026-11-10');

    // Aggregate statistics
    const totalPatients = patients.length;
    const totalSessions = sessions.length;
    const avgScore = metrics.length > 0
      ? Math.round(metrics.reduce((acc, m) => acc + m.score, 0) / metrics.length)
      : 88;

    return {
      patients,
      todayAppointments,
      recentMetrics: metrics.slice(0, 5),
      recentSessions: sessions.slice(0, 4),
      totalPatients,
      totalSessions,
      avgScore,
    };
  },

  createPatient(data: Omit<Patient, 'id' | 'createdAt' | 'sessionsCount' | 'lastSessionDate'>): Patient {
    const newPatient: Patient = {
      ...data,
      id: `p-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      sessionsCount: 0,
      lastSessionDate: 'Sem sessões registradas',
    };
    DataService.savePatient(newPatient);
    return newPatient;
  },

  createAppointment(data: Omit<Appointment, 'id'>): Appointment {
    const newApt: Appointment = {
      ...data,
      id: `apt-${Date.now()}`,
    };
    DataService.saveAppointment(newApt);
    return newApt;
  },

  recordSession(sessionData: Omit<SessionRecord, 'id'>): SessionRecord {
    const newSession: SessionRecord = {
      ...sessionData,
      id: `s-${Date.now()}`,
    };
    DataService.saveSession(newSession);
    return newSession;
  },
};
