import { describe, it, expect } from 'vitest';
import { patientSchema } from './patient.validation';

const validData = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  phone: '+1234567890',
  dateOfBirth: '1990-05-15',
  gender: 'female' as const,
  address: '123 Main St',
};

describe('patientSchema', () => {
  it('passes for valid complete data', () => {
    expect(patientSchema.safeParse(validData).success).toBe(true);
  });

  it('passes when optional bloodGroup is omitted', () => {
    const { bloodGroup: _, ...withoutBloodGroup } = { ...validData, bloodGroup: undefined };
    expect(patientSchema.safeParse(withoutBloodGroup).success).toBe(true);
  });

  it('passes when bloodGroup is provided', () => {
    expect(patientSchema.safeParse({ ...validData, bloodGroup: 'O+' }).success).toBe(true);
  });

  it('fails when name is empty', () => {
    const result = patientSchema.safeParse({ ...validData, name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toContain('Name is required');
    }
  });

  it('fails for invalid email', () => {
    const result = patientSchema.safeParse({ ...validData, email: 'not-an-email' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toContain('Enter a valid email');
    }
  });

  it('fails when phone is empty', () => {
    const result = patientSchema.safeParse({ ...validData, phone: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.phone).toContain('Phone is required');
    }
  });

  it('fails for invalid phone format', () => {
    const result = patientSchema.safeParse({ ...validData, phone: 'abc123' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.phone).toContain('Enter a valid phone number');
    }
  });

  it('fails when dateOfBirth is empty', () => {
    const result = patientSchema.safeParse({ ...validData, dateOfBirth: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.dateOfBirth).toContain('Date of birth is required');
    }
  });

  it('fails for invalid gender value', () => {
    const result = patientSchema.safeParse({ ...validData, gender: 'unknown' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.gender?.length).toBeGreaterThan(0);
    }
  });

  it('fails when address is empty', () => {
    const result = patientSchema.safeParse({ ...validData, address: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.address).toContain('Address is required');
    }
  });
});
