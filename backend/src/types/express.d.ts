declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        userId: string;
        email: string;
        role: 'DONOR' | 'CREATOR' | 'ADMIN';
      };
    }
  }
}

export {};
