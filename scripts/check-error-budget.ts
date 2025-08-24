import fs from 'fs';
import path from 'path';

const budgetFile = process.env.ERROR_BUDGET_FILE || path.join(process.cwd(), 'monitoring', 'error-budget.json');

try {
  const content = fs.readFileSync(budgetFile, 'utf-8');
  const data = JSON.parse(content);
  if (data.error_budget_exhausted) {
    console.error('Error budget exhausted. Blocking deploy.');
    process.exit(1);
  }
  console.log('Error budget remaining:', data.error_budget_remaining ?? 'unknown');
} catch (err) {
  console.warn('Error budget file not found or invalid, assuming budget available.');
  console.warn(err instanceof Error ? err.message : err);
}
