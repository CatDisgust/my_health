import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/** Expected webhook payload (all fields optional). */
type HealthIngestBody = {
  date?: string;
  steps?: number;
  sleep_minutes?: number;
  weight?: number;
  heart_rate?: number;
  energy?: number;
  exercise_time?: number;
  active_energy?: number;
};

export async function POST(request: Request) {
  // 1. Security: validate x-api-secret
  const apiSecret = request.headers.get('x-api-secret');
  const expectedSecret = process.env.API_SECRET_KEY;

  if (!expectedSecret) {
    console.error('[health-ingest] API_SECRET_KEY is not set');
    return NextResponse.json(
      { error: 'Server misconfiguration' },
      { status: 500 },
    );
  }

  if (apiSecret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as HealthIngestBody;

    const dateStr = body.date ?? new Date().toISOString();
    const recordedAt = new Date(dateStr);
    if (Number.isNaN(recordedAt.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format (expected ISO string)' },
        { status: 400 },
      );
    }

    const row = {
      recorded_at: recordedAt.toISOString(),
      steps: body.steps ?? null,
      sleep_minutes: body.sleep_minutes ?? null,
      weight_kg: body.weight ?? null,
      resting_hr: body.heart_rate ?? null,
      energy_level: body.energy ?? null,
      exercise_minutes: body.exercise_time ?? null,
      active_energy_kcal: body.active_energy ?? null,
      raw_data: body as Record<string, unknown>,
    };

    const { data, error } = await supabaseAdmin
      .from('health_metrics')
      .insert(row)
      .select('id')
      .single();

    if (error) {
      console.error('[health-ingest] Supabase insert error:', error);
      return NextResponse.json(
        { success: false, error: error.message, details: error },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      id: data.id,
    });
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    console.error('[health-ingest] Unexpected error:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}
