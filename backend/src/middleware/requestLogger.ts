import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Log request
  if (process.env.NODE_ENV === 'development') {
    console.log(`📝 ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  }

  // Override end to log response time
  const originalEnd = res.end.bind(res);
  
  res.end = function(...args: any[]) {
    const duration = Date.now() - start;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
    }
    
    return originalEnd(...args);
  };

  next();
}; 