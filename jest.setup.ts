import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

import { jest } from '@jest/globals';

// Define MockHeaders class first
class MockHeaders {
  constructor(init?: any) {}
  append = jest.fn();
  delete = jest.fn();
  get = jest.fn().mockReturnValue(null);
  has = jest.fn().mockReturnValue(false);
  set = jest.fn();
}

// Simple compatibility polyfills - don't replace global Request/Response
const originalRequest = global.Request;
const originalResponse = global.Response;

// Override NextRequest constructor to work with our mock
let MockNextRequest: any;
try {
  const { NextRequest } = require('next/server');
  MockNextRequest = class extends NextRequest {
    constructor(input: URL | RequestInfo, init?: RequestInit) {
      if (typeof input === 'string') {
        input = input.startsWith('http') ? input : `http://localhost:3000${input}`;
      }
      super(input, init);
    }
  };
} catch {
  // Fallback if NextRequest can't be imported
  MockNextRequest = class MockRequest {
    url: string;
    method: string;
    headers: MockHeaders;
    body: any;

    constructor(url: string, init?: RequestInit) {
      const fullUrl = url.startsWith('http') ? url : `http://localhost:3000${url}`;
      this.url = fullUrl;
      this.method = init?.method || 'GET';
      this.headers = new MockHeaders(init?.headers);
      this.body = init?.body;
    }

    clone() {
      return new MockNextRequest(this.url, {
        method: this.method,
        headers: this.headers,
        body: this.body,
      });
    }
  };
}

// Monkey patch global.NextRequest
(global as any).NextRequest = MockNextRequest;

(global as any).Response = originalResponse || class MockResponse {
  constructor(body?: any, init?: ResponseInit) {
    this.status = init?.status || 200;
    this.statusText = init?.statusText || '';
    this.ok = this.status >= 200 && this.status < 300;
    this.headers = new MockHeaders(init?.headers);
    this.body = body;
  }
  status: number;
  statusText: string;
  ok: boolean;
  headers: any;
  body: any;

  json() {
    if (typeof this.body === 'string') {
      try {
        return Promise.resolve(JSON.parse(this.body));
      } catch {
        return Promise.resolve(this.body);
      }
    }
    return Promise.resolve(this.body || {});
  }

  text() {
    return Promise.resolve(this.body ? JSON.stringify(this.body) : '');
  }

  clone() {
    return new (global as any).Response(this.body, {
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
    });
  }
};

(global as any).Headers = MockHeaders;

(global as any).FormData = class MockFormData {
  append = jest.fn();
  delete = jest.fn();
  get = jest.fn();
  getAll = jest.fn().mockReturnValue([]);
  has = jest.fn().mockReturnValue(false);
  set = jest.fn();
  entries = jest.fn().mockReturnValue([][Symbol.iterator]());
  keys = jest.fn().mockReturnValue([][Symbol.iterator]());
  values = jest.fn().mockReturnValue([][Symbol.iterator]());
  [Symbol.iterator] = jest.fn().mockReturnValue([][Symbol.iterator]());
  forEach = jest.fn();
};

afterEach(() => cleanup());

class MockPointerEvent extends MouseEvent {}
(globalThis as any).PointerEvent = MockPointerEvent;

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: '',
      asPath: '',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    };
  },
}));

// Mock Next.js navigation (App Router)
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Set environment variables for tests
// Note: NODE_ENV remains as set by Jest, other vars are overridden
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.NEXTAUTH_URL = 'http://localhost:3000';
process.env.NEXTAUTH_SECRET = 'test-secret';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.DEMO_PASSWORD = 'testing';
process.env.NEXT_PUBLIC_SOCKET_URL = 'ws://localhost:3001';
process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY = 'test-public-key';
process.env.VAPID_PRIVATE_KEY = 'test-private-key';

// Mock next-auth
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(() => Promise.resolve(null)),
}));

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(() => Promise.resolve(null)),
}));

// Mock toast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
    toasts: [],
    dismiss: jest.fn(),
  }),
  ToastContext: {
    Provider: ({ children }: { children: React.ReactNode }) => children,
  },
}));

// Mock logger to silence debug output in tests
jest.mock('@/lib/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(), // Silences all debug logs
  },
  apiLogger: {
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
  dbLogger: {
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));
