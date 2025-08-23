class PerformanceMonitor {
  private metrics = new Map<string, number[]>();

  startTimer(label: string): () => void {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(label, duration);
    };
  }

  recordMetric(label: string, value: number): void {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    
    const values = this.metrics.get(label)!;
    values.push(value);
    
    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift();
    }
  }

  getAverage(label: string): number {
    const values = this.metrics.get(label) || [];
    if (values.length === 0) return 0;
    
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  getAllMetrics(): Record<string, { avg: number; count: number }> {
    const result: Record<string, { avg: number; count: number }> = {};
    
    for (const [label, values] of this.metrics.entries()) {
      result[label] = {
        avg: this.getAverage(label),
        count: values.length
      };
    }
    
    return result;
  }
}

export const perfMonitor = new PerformanceMonitor();

// React hook for component performance
export function usePerformanceMonitor(componentName: string) {
  return {
    startRender: () => perfMonitor.startTimer(`${componentName}:render`),
    recordApiCall: (apiName: string, duration: number) => 
      perfMonitor.recordMetric(`api:${apiName}`, duration)
  };
}