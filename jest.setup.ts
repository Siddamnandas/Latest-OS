import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

// Add Next.js polyfills for API testing
// Mock fetch for testing environment
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: jest.fn().mockResolvedValue({}),
  text: jest.fn().mockResolvedValue(''),
  status: 200,
});

// Polyfill with type assertions to avoid strict type checking
(global as any).Request = class MockRequest {
  constructor(url: string, init?: RequestInit) {}
};

(global as any).Response = class MockResponse {
  constructor(body?: any, init?: any) {
    this.status = init?.status || 200;
    this.ok = this.status >= 200 && this.status < 300;
  }
  status: number;
  ok: boolean;
  json = jest.fn().mockResolvedValue({});
  text = jest.fn().mockResolvedValue('');
  clone = jest.fn().mockReturnValue(this);
};

(global as any).Headers = class MockHeaders {
  constructor(init?: any) {}
  append = jest.fn();
  delete = jest.fn();
  get = jest.fn().mockReturnValue(null);
  has = jest.fn().mockReturnValue(false);
  set = jest.fn();
};

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

// Mock environment variables
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.NEXTAUTH_SECRET = 'test-secret';
process.env.REDIS_URL = 'redis://localhost:6379';

// Mock next-auth
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(() => Promise.resolve(null)),
}));

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(() => Promise.resolve(null)),
}));
