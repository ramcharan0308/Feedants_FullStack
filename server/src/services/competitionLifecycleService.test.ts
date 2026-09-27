import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  CompetitionLifecycleService,
  CompetitionLifecycleState,
} from './competitionLifecycleService.js';

describe('CompetitionLifecycleService', () => {
  const mockDates = {
    submissionStarts: '2026-08-06T04:00:00.000Z',
    registerBefore: '2026-08-10T23:50:00.000Z',
    submissionEnds: '2026-08-30T23:55:00.000Z',
    resultDate: '2026-09-01T23:50:00.000Z',
  };

  it('should evaluate REGISTRATION_OPEN state before registration deadline with available spots', () => {
    const serverTime = new Date('2026-08-01T12:00:00.000Z');
    const result = CompetitionLifecycleService.evaluateStatus({
      dates: mockDates,
      totalSpots: 20,
      bookedSpots: 1,
      serverTime,
    });

    assert.strictEqual(result.state, CompetitionLifecycleState.REGISTRATION_OPEN);
    assert.strictEqual(result.isRegistrationOpen, true);
    assert.strictEqual(result.isSubmissionOpen, false);
    assert.strictEqual(result.isSoldOut, false);
    assert.strictEqual(result.remainingSpots, 19);
    assert.ok(result.secondsUntilRegistrationCloses > 0);
  });

  it('should evaluate SOLD_OUT state when bookedSpots equal totalSpots', () => {
    const serverTime = new Date('2026-08-01T12:00:00.000Z');
    const result = CompetitionLifecycleService.evaluateStatus({
      dates: mockDates,
      totalSpots: 20,
      bookedSpots: 20,
      serverTime,
    });

    assert.strictEqual(result.isSoldOut, true);
    assert.strictEqual(result.isRegistrationOpen, false);
    assert.strictEqual(result.remainingSpots, 0);
  });

  it('should evaluate SUBMISSION_OPEN state during submission window', () => {
    const serverTime = new Date('2026-08-15T12:00:00.000Z');
    const result = CompetitionLifecycleService.evaluateStatus({
      dates: mockDates,
      totalSpots: 20,
      bookedSpots: 5,
      serverTime,
    });

    assert.strictEqual(result.state, CompetitionLifecycleState.SUBMISSION_OPEN);
    assert.strictEqual(result.isSubmissionOpen, true);
    assert.strictEqual(result.isRegistrationOpen, false); // Past registerBefore
  });

  it('should evaluate REGISTRATION_CLOSED when deadline passed before submission starts', () => {
    const customDates = {
      ...mockDates,
      registerBefore: '2026-08-03T23:50:00.000Z',
      submissionStarts: '2026-08-06T04:00:00.000Z',
    };
    const serverTime = new Date('2026-08-04T12:00:00.000Z');
    const result = CompetitionLifecycleService.evaluateStatus({
      dates: customDates,
      totalSpots: 20,
      bookedSpots: 5,
      serverTime,
    });

    assert.strictEqual(result.state, CompetitionLifecycleState.REGISTRATION_CLOSED);
    assert.strictEqual(result.isRegistrationOpen, false);
  });

  it('should evaluate UNDER_JUDGING state after submission deadline and before result date', () => {
    const serverTime = new Date('2026-08-31T12:00:00.000Z');
    const result = CompetitionLifecycleService.evaluateStatus({
      dates: mockDates,
      totalSpots: 20,
      bookedSpots: 5,
      serverTime,
    });

    assert.strictEqual(result.state, CompetitionLifecycleState.UNDER_JUDGING);
    assert.strictEqual(result.isSubmissionOpen, false);
    assert.strictEqual(result.isRegistrationOpen, false);
  });

  it('should evaluate COMPLETED state on/after result date', () => {
    const serverTime = new Date('2026-09-02T12:00:00.000Z');
    const result = CompetitionLifecycleService.evaluateStatus({
      dates: mockDates,
      totalSpots: 20,
      bookedSpots: 5,
      serverTime,
    });

    assert.strictEqual(result.state, CompetitionLifecycleState.COMPLETED);
  });

  it('should bounds check remainingSpots when bookedSpots exceeds totalSpots', () => {
    const serverTime = new Date('2026-08-01T12:00:00.000Z');
    const result = CompetitionLifecycleService.evaluateStatus({
      dates: mockDates,
      totalSpots: 20,
      bookedSpots: 25, // Logical overflow guard
      serverTime,
    });

    assert.strictEqual(result.remainingSpots, 0);
    assert.strictEqual(result.isSoldOut, true);
  });
});
