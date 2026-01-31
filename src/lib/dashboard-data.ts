import { supabaseAdmin } from '@/lib/supabase';
import type { HealthMetric } from '@/lib/types';
import { format, subDays, startOfDay, parseISO } from 'date-fns';

const RECENT_DAYS = 7;

export interface DashboardData {
  recent: HealthMetric[];
  today: HealthMetric | null;
  yesterday: HealthMetric | null;
  byDay: Array<{
    date: string;
    steps: number;
    sleepHours: number;
    energyLevel: number | null;
  }>;
}

function toLocalDateKey(iso: string): string {
  return format(parseISO(iso), 'yyyy-MM-dd');
}

export async function getDashboardData(): Promise<DashboardData> {
  const since = subDays(new Date(), RECENT_DAYS);
  const { data: rows, error } = await supabaseAdmin
    .from('health_metrics')
    .select('id, recorded_at, steps, sleep_minutes, active_energy_kcal, exercise_minutes, weight_kg, resting_hr, energy_level, raw_data')
    .gte('recorded_at', since.toISOString())
    .order('recorded_at', { ascending: false });

  if (error) {
    console.error('[dashboard] Supabase error:', error);
    return {
      recent: [],
      today: null,
      yesterday: null,
      byDay: [],
    };
  }

  const recent = (rows ?? []) as HealthMetric[];
  const todayKey = format(startOfDay(new Date()), 'yyyy-MM-dd');
  const yesterdayKey = format(startOfDay(subDays(new Date(), 1)), 'yyyy-MM-dd');

  let today: HealthMetric | null = null;
  let yesterday: HealthMetric | null = null;
  for (const r of recent) {
    const key = toLocalDateKey(r.recorded_at);
    if (key === todayKey && !today) today = r;
    if (key === yesterdayKey && !yesterday) yesterday = r;
  }

  const byDayMap = new Map<
    string,
    { steps: number; sleepMinutes: number; energyLevel: number | null }
  >();
  for (let d = RECENT_DAYS - 1; d >= 0; d--) {
    const day = subDays(new Date(), d);
    const key = format(startOfDay(day), 'yyyy-MM-dd');
    byDayMap.set(key, { steps: 0, sleepMinutes: 0, energyLevel: null });
  }
  for (const r of recent) {
    const key = toLocalDateKey(r.recorded_at);
    const cur = byDayMap.get(key);
    if (!cur) continue;
    cur.steps += r.steps ?? 0;
    cur.sleepMinutes += r.sleep_minutes ?? 0;
    if (cur.energyLevel == null && r.energy_level != null)
      cur.energyLevel = r.energy_level;
  }

  const byDay = Array.from(byDayMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, { steps, sleepMinutes, energyLevel }]) => ({
      date,
      steps,
      sleepHours: Math.round((sleepMinutes / 60) * 10) / 10,
      energyLevel,
    }));

  return { recent, today, yesterday, byDay };
}
