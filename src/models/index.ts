import { UserData, WorkLog, Template, FirestoreTimestamp } from '../types/index.js';

export class UserModel implements UserData {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  createdAt: FirestoreTimestamp;
  lastLogin: FirestoreTimestamp;

  constructor({
    uid,
    email,
    displayName,
    role = 'user',
    status = 'active',
    createdAt = null,
    lastLogin = null,
  }: Partial<UserData> & { uid: string; email: string }) {
    this.uid = uid;
    this.email = email;
    this.displayName = displayName || '';
    this.role = role || 'user';
    this.status = status || 'active';
    this.createdAt = createdAt ?? null;
    this.lastLogin = lastLogin ?? null;
  }

  toFirestore(): Omit<UserData, 'uid'> {
    return {
      displayName: this.displayName,
      email: this.email,
      role: this.role,
      status: this.status,
      createdAt: this.createdAt,
      lastLogin: this.lastLogin,
    };
  }
}

export class WorkLogModel implements WorkLog {
  id?: string;
  date: string;
  name: string;
  client: string;
  place: string;
  supportType: string;
  departureTime: string;
  arrivalTime: string;
  startTime: string;
  endTime: string;
  supportHours: number;
  details: string;
  submittedBy: string;
  timestamp?: FirestoreTimestamp;

  constructor(payload: Partial<WorkLog> = {}) {
    this.id = payload.id;
    this.date = payload.date || '';
    this.name = payload.name || '';
    this.client = payload.client || '';
    this.place = payload.place || '';
    this.supportType = payload.supportType || '';
    this.departureTime = payload.departureTime || '';
    this.arrivalTime = payload.arrivalTime || '';
    this.startTime = payload.startTime || '';
    this.endTime = payload.endTime || '';
    this.supportHours = payload.supportHours || 0;
    this.details = payload.details || '';
    this.submittedBy = payload.submittedBy || '';
    this.timestamp = payload.timestamp;
  }

  toFirestore(): Omit<WorkLog, 'id'> {
    return {
      date: this.date,
      name: this.name,
      client: this.client,
      place: this.place,
      supportType: this.supportType,
      departureTime: this.departureTime,
      arrivalTime: this.arrivalTime,
      startTime: this.startTime,
      endTime: this.endTime,
      supportHours: this.supportHours,
      details: this.details,
      submittedBy: this.submittedBy,
      timestamp: this.timestamp,
    };
  }

  static fromForm(form: HTMLFormElement, userUid: string): WorkLogModel {
    return new WorkLogModel({
      date: (form.elements.namedItem('date') as HTMLInputElement)?.value || '',
      name: (form.elements.namedItem('name') as HTMLInputElement)?.value || '',
      client: (form.elements.namedItem('client') as HTMLInputElement)?.value || '',
      place: (form.elements.namedItem('place') as HTMLInputElement)?.value || '',
      supportType: (form.elements.namedItem('supportType') as HTMLSelectElement)?.value || '',
      departureTime: (form.elements.namedItem('departureTime') as HTMLInputElement)?.value || '',
      arrivalTime: (form.elements.namedItem('arrivalTime') as HTMLInputElement)?.value || '',
      startTime: (form.elements.namedItem('startTime') as HTMLInputElement)?.value || '',
      endTime: (form.elements.namedItem('endTime') as HTMLInputElement)?.value || '',
      supportHours:
        parseFloat((form.elements.namedItem('supportHours') as HTMLInputElement)?.value) || 0,
      details: (form.elements.namedItem('details') as HTMLTextAreaElement)?.value || '',
      submittedBy: userUid,
    });
  }
}

export class TemplateModel implements Template {
  id?: string;
  name: string;
  client: string;
  place: string;
  supportType: string;
  details: string;

  constructor({ name, client, place, supportType, details }: Partial<Template> = {}) {
    this.name = name || '';
    this.client = client || '';
    this.place = place || '';
    this.supportType = supportType || '';
    this.details = details || '';
  }

  toFirestore(): Template {
    return {
      name: this.name,
      client: this.client,
      place: this.place,
      supportType: this.supportType,
      details: this.details,
    };
  }

  static fromForm(form: HTMLFormElement, fallbackName: string = ''): TemplateModel {
    const templateName = fallbackName || (form.dataset.templateName as string) || '';
    return new TemplateModel({
      name: templateName,
      client: (form.elements.namedItem('client') as HTMLInputElement)?.value || '',
      place: (form.elements.namedItem('place') as HTMLInputElement)?.value || '',
      supportType: (form.elements.namedItem('supportType') as HTMLSelectElement)?.value || '',
      details: (form.elements.namedItem('details') as HTMLTextAreaElement)?.value || '',
    });
  }
}
