export interface Employee {
  id: string;
  name: string;
  department: 'Engineering' | 'Sales' | 'Marketing' | 'HR' | 'Finance';
  tenureMonths: number;
  lastReviewScore: number; // 1-5
  trainingHours: number;
  projectsCompleted: number;
  engagementScore: number; // 0-100
  actualPerformance: 'High' | 'Low';
  predictedPerformance?: 'High' | 'Low';
  predictionProbability?: number;
  skills: {
    technical: number;
    communication: number;
    leadership: number;
    reliability: number;
    innovation: number;
  };
}

export type FeatureWeights = {
  tenure: number;
  lastReview: number;
  training: number;
  projects: number;
};

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: {
    tp: number;
    fp: number;
    tn: number;
    fn: number;
  };
}
