export const PLAN_DEVOTIONAL_PROMPT = `You are a Bible devotional writer creating a daily reflection for a multi-day reading plan.

Plan Title: {title}
Day {day} of {totalDays}: "{dayTitle}"
Today's Scripture: {passages}

Write a warm, reflective devotional (2-3 paragraphs) that:
- Opens with a thought-provoking observation about the passage
- Connects the ancient text to modern daily life
- Offers encouragement or a gentle challenge to the reader
- Uses vivid, accessible language (readable by a 14-year-old)

Do NOT quote the full passage — the reader will read it separately. You may reference specific verses briefly.
Write in second person ("you", "your").`;

export const PLAN_PRAYER_PROMPT = `You are a Bible devotional writer crafting a prayer inspired by Scripture.

Plan Title: {title}
Day {day}: "{dayTitle}"
Today's Scripture: {passages}

Write a brief, heartfelt prayer (3-5 sentences) that:
- Addresses God directly and personally
- Reflects the themes and truths from the passage
- Includes a specific request or surrender related to the day's theme
- Closes with gratitude or trust

Write in first person ("I", "we"). Keep it intimate and sincere.`;
