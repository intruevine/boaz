import { describe, it, expect } from '@jest/globals';
import {
  WorkLogSchema,
  TemplateSchema,
  LoginSchema,
  SignupSchema,
  validateWorkLog,
} from '../validators/index.js';

describe('Validation Schemas', () => {
  describe('WorkLogSchema', () => {
    const validWorkLog = {
      date: '2024-03-15',
      name: '홍길동',
      client: 'ABC 회사',
      place: '서울',
      supportType: '고객지원',
      departureTime: '08:30',
      arrivalTime: '19:00',
      startTime: '09:00',
      endTime: '18:00',
      supportHours: 8,
      details: '시스템 점검 및 유지보수',
      submittedBy: 'user123',
    };

    it('should validate correct work log', () => {
      const result = WorkLogSchema.safeParse(validWorkLog);
      expect(result.success).toBe(true);
    });

    it('should reject invalid date format', () => {
      const invalid = { ...validWorkLog, date: '2024/03/15' };
      const result = WorkLogSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject empty client', () => {
      const invalid = { ...validWorkLog, client: '' };
      const result = WorkLogSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject invalid time format', () => {
      const invalid = { ...validWorkLog, startTime: '9:00' };
      const result = WorkLogSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject negative support hours', () => {
      const invalid = { ...validWorkLog, supportHours: -1 };
      const result = WorkLogSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('TemplateSchema', () => {
    const validTemplate = {
      name: '기본 템플릿',
      client: 'ABC 회사',
      place: '서울',
      supportType: '고객지원',
      details: '정기 점검',
    };

    it('should validate correct template', () => {
      const result = TemplateSchema.safeParse(validTemplate);
      expect(result.success).toBe(true);
    });

    it('should reject long name', () => {
      const invalid = { ...validTemplate, name: 'a'.repeat(101) };
      const result = TemplateSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('LoginSchema', () => {
    it('should validate correct login', () => {
      const result = LoginSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = LoginSchema.safeParse({
        email: 'invalid-email',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const result = LoginSchema.safeParse({
        email: 'test@example.com',
        password: '123',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('SignupSchema', () => {
    it('should validate correct signup', () => {
      const result = SignupSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        displayName: '홍길동',
      });
      expect(result.success).toBe(true);
    });

    it('should reject mismatched passwords', () => {
      const result = SignupSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'different',
        displayName: '홍길동',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('validateWorkLog', () => {
    it('should return success for valid data', () => {
      const result = validateWorkLog({
        date: '2024-03-15',
        name: '홍길동',
        client: 'ABC 회사',
        place: '서울',
        supportType: '고객지원',
        departureTime: '08:30',
        arrivalTime: '19:00',
        startTime: '09:00',
        endTime: '18:00',
        supportHours: 8,
        details: '시스템 점검',
        submittedBy: 'user123',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('홍길동');
      }
    });

    it('should return errors for invalid data', () => {
      const result = validateWorkLog({
        date: 'invalid-date',
        name: '',
        client: '',
        place: '',
        supportType: '',
        departureTime: 'invalid',
        arrivalTime: 'invalid',
        startTime: 'invalid',
        endTime: 'invalid',
        supportHours: -1,
        details: '',
        submittedBy: '',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });
  });
});
