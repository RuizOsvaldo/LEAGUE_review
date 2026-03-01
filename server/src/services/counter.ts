// In-memory counter stub (template demo feature)
const counters: Record<string, number> = {};
const COUNTER_NAME = 'demo';

export async function getCounter() {
  const value = counters[COUNTER_NAME] ?? 0;
  return { name: COUNTER_NAME, value };
}

export async function incrementCounter() {
  counters[COUNTER_NAME] = (counters[COUNTER_NAME] ?? 0) + 1;
  return { name: COUNTER_NAME, value: counters[COUNTER_NAME] };
}
