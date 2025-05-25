import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof SyntaxError || err.message === 'Invalid JSON') {
    return res.status(400).json({ message: 'Geçersiz JSON formatı' });
  }
  console.error(err.stack);
  res.status(500).json({ message: 'Bir hata oluştu!' });
};
