import { ILifecycleInfo, IUserState } from '../types/competition';
import { formatDateFull, formatCurrency } from './formatters';

export const resolveCTAState = (
  lifecycle: ILifecycleInfo,
  userState: IUserState,
  submissionStartsDate: string,
  entryFee: number
) => {
  // STATE 5: Registered + submission already uploaded
  if (userState.isRegistered && userState.hasSubmitted) {
    return {
      title: 'Submission Uploaded',
      subtitle: `Status: ${userState.submissionStatus || 'SUBMITTED'}`,
      disabled: true,
      action: 'NONE',
    };
  }

  // STATE 4: Registered + submission open + no submission
  if (userState.isRegistered && lifecycle.isSubmissionOpen) {
    return {
      title: 'Upload Submission',
      subtitle: 'Registered',
      disabled: false,
      action: 'OPEN_SUBMISSION',
    };
  }

  // STATE 3: Registered + submission not open yet
  if (userState.isRegistered && !lifecycle.isSubmissionOpen) {
    const { dateStr, timeStr } = formatDateFull(submissionStartsDate);
    return {
      title: 'Submission Not Started',
      subtitle: `Starts on ${dateStr} ${timeStr}`,
      disabled: true,
      action: 'NONE',
    };
  }

  // STATE 8: Competition completed
  if (lifecycle.state === 'COMPLETED') {
    return {
      title: 'Competition Completed',
      subtitle: 'Results declared',
      disabled: true,
      action: 'NONE',
    };
  }

  // STATE 7: Registration closed (due to deadline)
  if (lifecycle.state === 'REGISTRATION_CLOSED' || (!lifecycle.isRegistrationOpen && !lifecycle.isSoldOut)) {
    return {
      title: 'Registration Closed',
      subtitle: 'Deadline passed',
      disabled: true,
      action: 'NONE',
    };
  }

  // STATE 6: Unregistered + Sold out
  if (lifecycle.isSoldOut) {
    return {
      title: 'Sold Out',
      subtitle: 'All spots booked',
      disabled: true,
      action: 'NONE',
    };
  }

  // STATE 1: Unregistered + registration open + spots available
  if (lifecycle.isRegistrationOpen) {
    return {
      title: `Register Now (${formatCurrency(entryFee)})`,
      subtitle: 'Instant Confirmation',
      disabled: false,
      action: 'REGISTER',
    };
  }

  return {
    title: 'Unavailable',
    subtitle: '',
    disabled: true,
    action: 'NONE',
  };
};
