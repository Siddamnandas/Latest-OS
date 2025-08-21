import '@testing-library/jest-dom/vitest';
import { expect, afterEach } from 'vitest';
import { toHaveNoViolations } from 'jest-axe';
import { cleanup } from '@testing-library/react';

expect.extend(toHaveNoViolations);

afterEach(() => cleanup());

class MockPointerEvent extends MouseEvent {}
(globalThis as any).PointerEvent = MockPointerEvent;
