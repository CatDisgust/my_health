/** Row from Supabase `health_metrics` table. */
export interface HealthMetric {
  id: string;
  recorded_at: string;
  steps: number | null;
  sleep_minutes: number | null;
  active_energy_kcal: number | null;
  exercise_minutes: number | null;
  weight_kg: number | null;
  resting_hr: number | null;
  energy_level: number | null;
  raw_data: Record<string, unknown> | null;
}
