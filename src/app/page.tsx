export const dynamic = 'force-dynamic';

import { format } from 'date-fns';
import { Footprints, Moon, Battery, Scale, Activity } from 'lucide-react';
import { getDashboardData } from '@/lib/dashboard-data';
import { ActivityComposedChart, SleepEnergyAreaChart } from '@/components/dashboard-charts';

function kpiCompare(
  todayVal: number | null | undefined,
  yesterdayVal: number | null | undefined,
  higherIsBetter: boolean
): 'up' | 'down' | null {
  if (todayVal == null || yesterdayVal == null) return null;
  if (todayVal === yesterdayVal) return null;
  const better = higherIsBetter ? todayVal > yesterdayVal : todayVal < yesterdayVal;
  return better ? 'up' : 'down';
}

function KpiCard({
  title,
  value,
  unit,
  yesterdayValue,
  higherIsBetter = true,
  icon: Icon,
}: {
  title: string;
  value: number | null | undefined;
  unit: string;
  yesterdayValue?: number | null;
  higherIsBetter?: boolean;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const display = value != null ? `${value}${unit}` : '--';
  const trend = kpiCompare(value, yesterdayValue, higherIsBetter);

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
      <div className="flex items-center justify-between">
        <span className="text-zinc-400 text-sm">{title}</span>
        <Icon className="h-4 w-4 text-zinc-500" />
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-white">{display}</span>
        {trend === 'up' && (
          <span className="text-green-500 text-sm" aria-label="up vs yesterday">
            ↑
          </span>
        )}
        {trend === 'down' && (
          <span className="text-red-500 text-sm" aria-label="down vs yesterday">
            ↓
          </span>
        )}
      </div>
      {value == null && (
        <p className="mt-1 text-xs text-zinc-500">No data yet</p>
      )}
    </div>
  );
}

export default async function DashboardPage() {
  const { recent, today, yesterday, byDay } = await getDashboardData();

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight">
            MyHealth OS
          </h1>
          <time
            dateTime={format(new Date(), 'yyyy-MM-dd')}
            className="text-zinc-400 text-sm"
          >
            {format(new Date(), 'MMM d, yyyy')}
          </time>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-medium text-zinc-400">
            Today&apos;s stats
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            <KpiCard
              title="Steps"
              value={today?.steps}
              unit=""
              yesterdayValue={yesterday?.steps}
              higherIsBetter
              icon={Footprints}
            />
            <KpiCard
              title="Sleep"
              value={
                today?.sleep_minutes != null
                  ? Math.round((today.sleep_minutes / 60) * 10) / 10
                  : null
              }
              unit=" hrs"
              yesterdayValue={
                yesterday?.sleep_minutes != null
                  ? Math.round((yesterday.sleep_minutes / 60) * 10) / 10
                  : null
              }
              higherIsBetter
              icon={Moon}
            />
            <KpiCard
              title="Energy"
              value={today?.energy_level}
              unit="/10"
              yesterdayValue={yesterday?.energy_level}
              higherIsBetter
              icon={Battery}
            />
            <KpiCard
              title="Weight"
              value={today?.weight_kg}
              unit=" kg"
              yesterdayValue={yesterday?.weight_kg}
              higherIsBetter={false}
              icon={Scale}
            />
            <KpiCard
              title="Exercise"
              value={today?.exercise_minutes}
              unit=" mins"
              yesterdayValue={yesterday?.exercise_minutes}
              higherIsBetter
              icon={Activity}
            />
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-sm font-medium text-zinc-400">Charts</h2>
          <div className="space-y-8">
            <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
              <h3 className="mb-3 text-sm font-medium text-zinc-300">
                Activity (last 7 days)
              </h3>
              <ActivityComposedChart data={byDay} />
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
              <h3 className="mb-3 text-sm font-medium text-zinc-300">
                Sleep vs Energy (last 7 days)
              </h3>
              <SleepEnergyAreaChart data={byDay} />
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-sm font-medium text-zinc-400">
            Last 5 entries
          </h2>
          <div className="overflow-hidden rounded-lg border border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/50">
                  <th className="px-4 py-3 font-medium text-zinc-400">
                    Recorded
                  </th>
                  <th className="px-4 py-3 font-medium text-zinc-400">Steps</th>
                  <th className="px-4 py-3 font-medium text-zinc-400">Sleep</th>
                  <th className="px-4 py-3 font-medium text-zinc-400">
                    Energy
                  </th>
                  <th className="px-4 py-3 font-medium text-zinc-400">
                    Weight
                  </th>
                  <th className="px-4 py-3 font-medium text-zinc-400">
                    Exercise
                  </th>
                </tr>
              </thead>
              <tbody>
                {recent.slice(0, 5).map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-zinc-800/80 last:border-0"
                  >
                    <td className="px-4 py-3 text-zinc-300">
                      {format(
                        new Date(row.recorded_at),
                        'MMM d, HH:mm'
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {row.steps != null ? row.steps : '--'}
                    </td>
                    <td className="px-4 py-3">
                      {row.sleep_minutes != null
                        ? `${(row.sleep_minutes / 60).toFixed(1)}h`
                        : '--'}
                    </td>
                    <td className="px-4 py-3">
                      {row.energy_level != null ? row.energy_level : '--'}
                    </td>
                    <td className="px-4 py-3">
                      {row.weight_kg != null
                        ? `${row.weight_kg} kg`
                        : '--'}
                    </td>
                    <td className="px-4 py-3">
                      {row.exercise_minutes != null
                        ? `${row.exercise_minutes} min`
                        : '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recent.length === 0 && (
              <p className="px-4 py-8 text-center text-zinc-500">
                No data yet
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
