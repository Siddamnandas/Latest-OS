import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const exporter = new OTLPMetricExporter();

const meterProvider = new MeterProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'latest-os',
  }),
});

meterProvider.addMetricReader(
  new PeriodicExportingMetricReader({
    exporter,
    exportIntervalMillis: 60000,
  })
);

const meter = meterProvider.getMeter('latest-os');

export const requestLatency = meter.createHistogram('latestos.request.duration', {
  description: 'Request latency in milliseconds',
  unit: 'ms',
});

export const requestErrors = meter.createCounter('latestos.request.errors', {
  description: 'Total number of request errors',
});
