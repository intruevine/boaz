import { z } from 'zod';

// 사용자 스키마
export const UserSchema = z.object({
  uid: z.string(),
  email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
  displayName: z.string().min(1, '이름을 입력해주세요.').max(50, '이름은 50자 이하여야 합니다.'),
  role: z.enum(['admin', 'user']),
  status: z.enum(['active', 'inactive']),
  createdAt: z.date().nullable(),
  lastLogin: z.date().nullable(),
});

// 작업 로그 스키마
export const WorkLogSchema = z.object({
  id: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD 형식으로 입력해주세요.'),
  name: z.string().min(1, '이름을 입력해주세요.'),
  client: z.string().min(1, '고객사명을 입력해주세요.'),
  place: z.string().min(1, '장소를 입력해주세요.'),
  supportType: z.string().min(1, '지원 유형을 선택해주세요.'),
  departureTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'HH:MM 형식으로 입력해주세요.'),
  arrivalTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'HH:MM 형식으로 입력해주세요.'),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'HH:MM 형식으로 입력해주세요.'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'HH:MM 형식으로 입력해주세요.'),
  supportHours: z.number().min(0, '지원 시간은 0 이상이어야 합니다.').max(24, '지원 시간은 24시간을 초과할 수 없습니다.'),
  details: z.string().min(1, '지원 내용을 입력해주세요.').max(2000, '지원 내용은 2000자 이하여야 합니다.'),
  submittedBy: z.string(),
  timestamp: z.date().optional(),
});

// 템플릿 스키마
export const TemplateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, '템플릿 이름을 입력해주세요.').max(100, '템플릿 이름은 100자 이하여야 합니다.'),
  client: z.string().min(1, '고객사명을 입력해주세요.'),
  place: z.string().min(1, '장소를 입력해주세요.'),
  supportType: z.string().min(1, '지원 유형을 선택해주세요.'),
  details: z.string().min(1, '지원 내용을 입력해주세요.').max(2000, '지원 내용은 2000자 이하여야 합니다.'),
});

// 로그인 스키마
export const LoginSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다.'),
});

// 회원가입 스키마
export const SignupSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다.'),
  confirmPassword: z.string(),
  displayName: z.string().min(1, '이름을 입력해주세요.').max(50, '이름은 50자 이하여야 합니다.'),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['confirmPassword'],
});

// 비밀번호 변경 스키마
export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, '현재 비밀번호를 입력해주세요.'),
  newPassword: z.string().min(6, '새 비밀번호는 6자 이상이어야 합니다.'),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: '새 비밀번호가 일치하지 않습니다.',
  path: ['confirmNewPassword'],
});

// 타입 추출
export type User = z.infer<typeof UserSchema>;
export type WorkLog = z.infer<typeof WorkLogSchema>;
export type Template = z.infer<typeof TemplateSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type SignupInput = z.infer<typeof SignupSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;

// 검증 함수
export function validateWorkLog(data: unknown): { success: true; data: WorkLog } | { success: false; errors: string[] } {
  const result = WorkLogSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error.errors.map((e) => e.message) };
}

export function validateTemplate(data: unknown): { success: true; data: Template } | { success: false; errors: string[] } {
  const result = TemplateSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error.errors.map((e) => e.message) };
}

export function validateLogin(data: unknown): { success: true; data: LoginInput } | { success: false; errors: string[] } {
  const result = LoginSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error.errors.map((e) => e.message) };
}

export function validateSignup(data: unknown): { success: true; data: SignupInput } | { success: false; errors: string[] } {
  const result = SignupSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error.errors.map((e) => e.message) };
}
