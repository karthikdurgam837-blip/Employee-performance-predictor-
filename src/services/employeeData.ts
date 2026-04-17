import { Employee } from '../types';

const DEPARTMENTS = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'] as const;
const NAMES = ['Alex Rivers', 'Jordan Smith', 'Casey Chen', 'Taylor Morgan', 'Riley Vance', 'Morgan Blake', 'Peyton Wood', 'Skyler Grey', 'Quinn Hart', 'Avery Lane'];

export function generateSyntheticData(count: number = 50): Employee[] {
  return Array.from({ length: count }, (_, i) => {
    const department = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
    const tenureMonths = Math.floor(Math.random() * 48) + 3;
    const trainingHours = Math.floor(Math.random() * 40);
    const projectsCompleted = Math.floor(Math.random() * 10);
    const lastReviewScore = Math.floor(Math.random() * 3) + 2 + (trainingHours > 20 ? 0.5 : 0);
    const engagementScore = Math.floor(Math.random() * 40) + 60;

    // Simple heuristic for "actual" labels to simulate a pattern
    // A high performer usually has balanced tenure, training, and good review
    const score = (tenureMonths / 48) * 0.2 + 
                 (trainingHours / 40) * 0.3 + 
                 (projectsCompleted / 10) * 0.3 + 
                 (lastReviewScore / 5) * 0.2;
    
    const actualPerformance = score > 0.6 ? 'High' : 'Low';

    return {
      id: `EMP-${1000 + i}`,
      name: NAMES[i % NAMES.length] + ' ' + (i + 1),
      department,
      tenureMonths,
      lastReviewScore: Math.min(5, lastReviewScore),
      trainingHours,
      projectsCompleted,
      engagementScore,
      actualPerformance,
      skills: {
        technical: Math.floor(Math.random() * 40) + 60,
        communication: Math.floor(Math.random() * 50) + 50,
        leadership: Math.floor(Math.random() * 60) + 40,
        reliability: Math.floor(Math.random() * 30) + 70,
        innovation: Math.floor(Math.random() * 50) + 50,
      }
    };
  });
}
