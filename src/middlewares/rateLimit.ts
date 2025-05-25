import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 requests per windowMs
  message: 'Çok fazla giriş denemesi yapıldı, lütfen 15 dakika sonra tekrar deneyin',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Başarılı istekleri sayma
  skipFailedRequests: false, // Başarısız istekleri say
}); 