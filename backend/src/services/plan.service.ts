import { query } from '../db/postgres.js';
import { getLLMProvider } from '../llm/factory.js';
import {
  PLAN_DEVOTIONAL_PROMPT,
  PLAN_PRAYER_PROMPT,
} from '../llm/prompts/plan.js';

export interface PlanPassage {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  label: string;
}

export interface PlanReading {
  day: number;
  title: string;
  passages: PlanPassage[];
}

export interface PlanCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
  planCount: number;
}

export interface Plan {
  id: string;
  slug: string;
  categorySlug: string;
  title: string;
  description: string;
  coverImage: string | null;
  durationDays: number;
  readings: PlanReading[];
  sortOrder: number;
}

export interface PlanContent {
  day: number;
  contentType: string;
  content: string;
}

export interface PlanProgress {
  currentDay: number;
  completedDays: number[];
  completedAt: string | null;
}

export async function getAllCategories(): Promise<PlanCategory[]> {
  const result = await query(
    `SELECT pc.*, COUNT(p.id)::int as plan_count
     FROM plan_categories pc
     LEFT JOIN plans p ON p.category_id = pc.id
     GROUP BY pc.id
     ORDER BY pc.sort_order`
  );

  return result.rows.map(row => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    icon: row.icon,
    sortOrder: row.sort_order,
    planCount: row.plan_count,
  }));
}

export async function getAllPlans(categorySlug?: string, userId?: string | null): Promise<(Plan & { progress: PlanProgress | null })[]> {
  const params: any[] = [];
  let idx = 1;

  let sql = `
    SELECT p.*, pc.slug as category_slug, pp.current_day, pp.completed_days, pp.completed_at
    FROM plans p
    JOIN plan_categories pc ON pc.id = p.category_id
    LEFT JOIN plan_progress pp ON pp.plan_id = p.id`;

  if (userId) {
    sql += ` AND pp.user_id = $${idx++}`;
    params.push(userId);
  }

  if (categorySlug) {
    sql += ` WHERE pc.slug = $${idx++}`;
    params.push(categorySlug);
  }

  sql += ' ORDER BY p.sort_order';

  const result = await query(sql, params);

  return result.rows.map(row => ({
    id: row.id,
    slug: row.slug,
    categorySlug: row.category_slug,
    title: row.title,
    description: row.description,
    coverImage: row.cover_image,
    durationDays: row.duration_days,
    readings: row.readings,
    sortOrder: row.sort_order,
    progress: row.current_day !== null
      ? {
          currentDay: row.current_day,
          completedDays: row.completed_days || [],
          completedAt: row.completed_at,
        }
      : null,
  }));
}

export async function getPlan(slug: string, userId?: string | null): Promise<(Plan & { progress: PlanProgress | null; content: PlanContent[] }) | null> {
  let sql = `
    SELECT p.*, pc.slug as category_slug, pp.current_day, pp.completed_days, pp.completed_at
    FROM plans p
    JOIN plan_categories pc ON pc.id = p.category_id
    LEFT JOIN plan_progress pp ON pp.plan_id = p.id`;

  const params: any[] = [];
  let idx = 1;

  if (userId) {
    sql += ` AND pp.user_id = $${idx++}`;
    params.push(userId);
  }

  sql += ` WHERE p.slug = $${idx++}`;
  params.push(slug);

  const planResult = await query(sql, params);

  if (planResult.rows.length === 0) return null;

  const row = planResult.rows[0];

  const contentResult = await query(
    'SELECT day, content_type, content FROM plan_content WHERE plan_id = $1 ORDER BY day, content_type',
    [row.id]
  );

  return {
    id: row.id,
    slug: row.slug,
    categorySlug: row.category_slug,
    title: row.title,
    description: row.description,
    coverImage: row.cover_image,
    durationDays: row.duration_days,
    readings: row.readings,
    sortOrder: row.sort_order,
    progress: row.current_day !== null
      ? {
          currentDay: row.current_day,
          completedDays: row.completed_days || [],
          completedAt: row.completed_at,
        }
      : null,
    content: contentResult.rows.map(r => ({
      day: r.day,
      contentType: r.content_type,
      content: r.content,
    })),
  };
}

export async function generatePlanContent(planId: string, userId: string): Promise<void> {
  // Check if content already exists
  const existing = await query(
    'SELECT COUNT(*) as count FROM plan_content WHERE plan_id = $1',
    [planId]
  );
  if (parseInt(existing.rows[0].count, 10) > 0) return;

  const planResult = await query(
    'SELECT * FROM plans WHERE id = $1',
    [planId]
  );
  if (planResult.rows.length === 0) throw new Error('Plan not found');

  const plan = planResult.rows[0];
  const readings: PlanReading[] = plan.readings;
  const llm = getLLMProvider();

  for (const reading of readings) {
    const passageList = reading.passages.map(p => p.label).join(', ');

    // Generate devotional
    const devPrompt = PLAN_DEVOTIONAL_PROMPT
      .replace('{title}', plan.title)
      .replace('{day}', String(reading.day))
      .replace('{totalDays}', String(plan.duration_days))
      .replace('{dayTitle}', reading.title)
      .replace('{passages}', passageList);

    const devText = await llm.complete([
      { role: 'user', content: devPrompt },
    ]);

    await query(
      `INSERT INTO plan_content (plan_id, day, content_type, content)
       VALUES ($1, $2, 'devotional', $3)
       ON CONFLICT (plan_id, day, content_type) DO UPDATE SET content = $3, generated_at = NOW()`,
      [planId, reading.day, devText]
    );

    // Generate prayer
    const prayerPrompt = PLAN_PRAYER_PROMPT
      .replace('{title}', plan.title)
      .replace('{day}', String(reading.day))
      .replace('{dayTitle}', reading.title)
      .replace('{passages}', passageList);

    const prayerText = await llm.complete([
      { role: 'user', content: prayerPrompt },
    ]);

    await query(
      `INSERT INTO plan_content (plan_id, day, content_type, content)
       VALUES ($1, $2, 'prayer', $3)
       ON CONFLICT (plan_id, day, content_type) DO UPDATE SET content = $3, generated_at = NOW()`,
      [planId, reading.day, prayerText]
    );
  }

  // Initialize progress for this user
  await query(
    `INSERT INTO plan_progress (user_id, plan_id, current_day)
     VALUES ($1, $2, 1)
     ON CONFLICT (user_id, plan_id) DO NOTHING`,
    [userId, planId]
  );
}

export async function updateProgress(userId: string, slug: string, day: number, completed: boolean): Promise<void> {
  const planResult = await query(
    'SELECT id, duration_days FROM plans WHERE slug = $1',
    [slug]
  );
  if (planResult.rows.length === 0) throw new Error('Plan not found');

  const plan = planResult.rows[0];

  // Get current progress for this user
  const progressResult = await query(
    'SELECT completed_days FROM plan_progress WHERE plan_id = $1 AND user_id = $2',
    [plan.id, userId]
  );

  let completedDays: number[] = progressResult.rows.length > 0
    ? (progressResult.rows[0].completed_days || [])
    : [];

  if (completed && !completedDays.includes(day)) {
    completedDays.push(day);
    completedDays.sort((a, b) => a - b);
  } else if (!completed) {
    completedDays = completedDays.filter(d => d !== day);
  }

  const nextDay = Math.min(
    completedDays.length > 0 ? Math.max(...completedDays) + 1 : 1,
    plan.duration_days
  );

  const allComplete = completedDays.length >= plan.duration_days;

  await query(
    `INSERT INTO plan_progress (user_id, plan_id, current_day, completed_days, completed_at)
     VALUES ($1, $2, $3, $4::jsonb, $5)
     ON CONFLICT (user_id, plan_id) DO UPDATE SET
       current_day = $3,
       completed_days = $4::jsonb,
       completed_at = $5`,
    [
      userId,
      plan.id,
      nextDay,
      JSON.stringify(completedDays),
      allComplete ? new Date().toISOString() : null,
    ]
  );
}
