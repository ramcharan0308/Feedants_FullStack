import { resolveCTAState } from './ctaStateResolver';
import { ILifecycleInfo, IUserState } from '../types/competition';

export const runFrontendCTATests = () => {
  const baseLifecycle: ILifecycleInfo = {
    state: 'REGISTRATION_OPEN',
    isRegistrationOpen: true,
    isSubmissionOpen: false,
    isSoldOut: false,
    secondsUntilRegistrationCloses: 1000,
    secondsUntilSubmissionStarts: 500,
    secondsUntilSubmissionEnds: 2000,
    serverTime: new Date().toISOString(),
  };

  const baseUserState: IUserState = {
    isRegistered: false,
    registrationId: null,
    registeredAt: null,
    hasSubmitted: false,
    submissionId: null,
    submissionStatus: null,
  };

  // State 1: Unregistered + registration open + spots available -> Register Now
  const state1 = resolveCTAState(baseLifecycle, baseUserState, '2026-08-06T04:00:00Z', 99);
  if (state1.disabled || state1.action !== 'REGISTER') {
    throw new Error('State 1 assertion failed');
  }

  // State 3: Registered + submission not open -> Submission Not Started
  const userStateReg: IUserState = { ...baseUserState, isRegistered: true };
  const state3 = resolveCTAState(baseLifecycle, userStateReg, '2026-08-06T04:00:00Z', 99);
  if (!state3.disabled || state3.title !== 'Submission Not Started') {
    throw new Error('State 3 assertion failed');
  }

  // State 4: Registered + submission open + no submission -> Upload Submission
  const lifecycleSubOpen: ILifecycleInfo = { ...baseLifecycle, isSubmissionOpen: true, state: 'SUBMISSION_OPEN' };
  const state4 = resolveCTAState(lifecycleSubOpen, userStateReg, '2026-08-06T04:00:00Z', 99);
  if (state4.disabled || state4.action !== 'OPEN_SUBMISSION') {
    throw new Error('State 4 assertion failed');
  }

  // State 5: Registered + submission uploaded -> Submission Uploaded
  const userStateSubmitted: IUserState = { ...baseUserState, isRegistered: true, hasSubmitted: true };
  const state5 = resolveCTAState(baseLifecycle, userStateSubmitted, '2026-08-06T04:00:00Z', 99);
  if (!state5.disabled || state5.title !== 'Submission Uploaded') {
    throw new Error('State 5 assertion failed');
  }

  // State 6: Unregistered + sold out -> Sold Out
  const lifecycleSoldOut: ILifecycleInfo = { ...baseLifecycle, isSoldOut: true, isRegistrationOpen: false };
  const state6 = resolveCTAState(lifecycleSoldOut, baseUserState, '2026-08-06T04:00:00Z', 99);
  if (!state6.disabled || state6.title !== 'Sold Out') {
    throw new Error('State 6 assertion failed');
  }

  // State 7: Registration closed -> Registration Closed
  const lifecycleClosed: ILifecycleInfo = { ...baseLifecycle, isRegistrationOpen: false, state: 'REGISTRATION_CLOSED' };
  const state7 = resolveCTAState(lifecycleClosed, baseUserState, '2026-08-06T04:00:00Z', 99);
  if (!state7.disabled || state7.title !== 'Registration Closed') {
    throw new Error('State 7 assertion failed');
  }

  console.log('✅ All 6 StickyBottomCTA frontend state assertions passed!');
};

runFrontendCTATests();
