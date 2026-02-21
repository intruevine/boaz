// 테스트 예시
import { describe, it, expect } from '@jest/globals';
import {
  calculateDuration,
  calculateDurationInHours,
  formatDate,
  escapeHtml,
  debounce,
} from '../utils/helpers.js';

describe('Helper Functions', () => {
  describe('calculateDuration', () => {
    it('should calculate duration between two times', () => {
      expect(calculateDuration('09:00', '18:00')).toBe(480); // 8 hours
    });

    it('should exclude lunch time', () => {
      expect(calculateDuration('11:00', '14:00')).toBe(120); // 2 hours (excluding lunch)
    });

    it('should return 0 for same time', () => {
      expect(calculateDuration('09:00', '09:00')).toBe(0);
    });

    it('should return 0 for negative duration', () => {
      expect(calculateDuration('18:00', '09:00')).toBe(0);
    });
  });

  describe('calculateDurationInHours', () => {
    it('should convert minutes to hours', () => {
      expect(calculateDurationInHours('09:00', '18:00')).toBe(8);
    });

    it('should round to 1 decimal place', () => {
      expect(calculateDurationInHours('09:00', '09:30')).toBe(0.5);
    });
  });

  describe('formatDate', () => {
    it('should format Date object', () => {
      const date = new Date('2024-03-15');
      expect(formatDate(date)).toBe('2024-03-15');
    });

    it('should format date string', () => {
      expect(formatDate('2024-03-15T10:30:00')).toBe('2024-03-15');
    });

    it('should format timestamp', () => {
      expect(formatDate(1710505800000)).toBe('2024-03-15');
    });
  });

  describe('escapeHtml', () => {
    it('should escape HTML entities', () => {
      const input = '<script>alert("XSS")</script>';
      const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('should handle empty string', () => {
      expect(escapeHtml('')).toBe('');
    });
  });

  describe('debounce', () => {
    it('should delay function execution', (done) => {
      let count = 0;
      const debouncedFn = debounce(() => {
        count++;
      }, 50);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(count).toBe(0);

      setTimeout(() => {
        expect(count).toBe(1);
        done();
      }, 100);
    });
  });
});
