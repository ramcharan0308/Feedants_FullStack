import { Request, Response, NextFunction } from 'express';
import { CompetitionService } from '../services/competitionService.js';

export class CompetitionController {
  public static getDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const competitionId = req.params.id;
      const userId = req.userId; // Extracted from x-user-id header by middleware

      const data = await CompetitionService.getCompetitionDetails(competitionId, userId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public static getWinners = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const competitionId = req.params.id;
      const winners = await CompetitionService.getPastWinners(competitionId);

      res.status(200).json({
        success: true,
        data: {
          winners,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public static register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const competitionId = req.params.id;
      const userId = req.userId!; // Guaranteed by requireUserContext middleware
      const { paymentToken } = req.body;

      const data = await CompetitionService.registerUser(competitionId, userId, paymentToken);

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public static submit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const competitionId = req.params.id;
      const userId = req.userId!;
      const { mediaUrl, caption } = req.body;

      const data = await CompetitionService.submitEntry(competitionId, userId, mediaUrl, caption);

      res.status(201).json({
        success: true,
        message: 'Submission uploaded successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
