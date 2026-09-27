import { Router } from 'express';
import { CompetitionController } from '../controllers/competitionController.js';
import { userContext, requireUserContext } from '../middlewares/userContext.js';
import { validateParams, validateBody } from '../middlewares/validateRequest.js';
import {
  getCompetitionParamsSchema,
  registerBodySchema,
  submitBodySchema,
} from '../validations/competitionValidations.js';
import { registrationRateLimiter } from '../middlewares/registrationRateLimiter.js';

const router = Router();

router.get(
  '/competitions/:id',
  validateParams(getCompetitionParamsSchema),
  userContext,
  CompetitionController.getDetails
);

router.get(
  '/competitions/:id/winners',
  validateParams(getCompetitionParamsSchema),
  CompetitionController.getWinners
);

router.post(
  '/competitions/:id/register',
  registrationRateLimiter,
  validateParams(getCompetitionParamsSchema),
  validateBody(registerBodySchema),
  userContext,
  requireUserContext,
  CompetitionController.register
);

router.post(
  '/competitions/:id/submit',
  validateParams(getCompetitionParamsSchema),
  validateBody(submitBodySchema),
  userContext,
  requireUserContext,
  CompetitionController.submit
);

export default router;
