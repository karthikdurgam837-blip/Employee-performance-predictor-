import { Employee, ModelMetrics, FeatureWeights } from '../types';

/**
 * Simulates a Random Forest / Logistic Regression classifier
 * In a real app, this would be a call to a trained model.
 */
export function trainAndPredict(
  trainingData: Employee[], 
  customWeights?: FeatureWeights
): { employees: Employee[], metrics: ModelMetrics } {
  // 1. Feature weights
  const weights = customWeights || {
    tenure: 0.15,
    lastReview: 0.35,
    training: 0.25,
    projects: 0.25
  };

  const results = trainingData.map(emp => {
    // Normalize weights to sum to 1 for calculation
    const totalWeight = weights.tenure + weights.lastReview + weights.training + weights.projects;
    
    // Calculate prediction score
    const score = ((emp.tenureMonths / 60) * weights.tenure +
                  (emp.lastReviewScore / 5) * weights.lastReview +
                  (emp.trainingHours / 40) * weights.training +
                  (emp.projectsCompleted / 12) * weights.projects) / totalWeight;
    
    // Non-linear interaction simulation
    let interactionBonus = 0;
    if (emp.trainingHours > 30 && emp.lastReviewScore > 4) interactionBonus = 0.1;
    if (emp.engagementScore > 90) interactionBonus += 0.05;

    // Add some noise to simulate non-perfect model
    const predictionScore = score + interactionBonus + (Math.random() - 0.5) * 0.05;
    const predictedPerformance = predictionScore > 0.52 ? 'High' : 'Low';
    
    return {
      ...emp,
      predictedPerformance: predictedPerformance as 'High' | 'Low',
      predictionProbability: Math.min(0.99, Math.max(0.01, predictionScore))
    };
  });

  // 2. Calculate Metrics
  let tp = 0, fp = 0, tn = 0, fn = 0;

  results.forEach(emp => {
    if (emp.actualPerformance === 'High' && emp.predictedPerformance === 'High') tp++;
    if (emp.actualPerformance === 'Low' && emp.predictedPerformance === 'High') fp++;
    if (emp.actualPerformance === 'Low' && emp.predictedPerformance === 'Low') tn++;
    if (emp.actualPerformance === 'High' && emp.predictedPerformance === 'Low') fn++;
  });

  const accuracy = (tp + tn) / results.length;
  const precision = tp / (tp + fp) || 0;
  const recall = tp / (tp + fn) || 0;
  const f1Score = (2 * precision * recall) / (precision + recall) || 0;

  return {
    employees: results,
    metrics: {
      accuracy,
      precision,
      recall,
      f1Score,
      confusionMatrix: { tp, fp, tn, fn }
    }
  };
}
