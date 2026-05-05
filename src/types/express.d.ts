type Role = "ADMIN" | "USER";
declare namespace Express {
  interface Request {
    userId?: number;
    userRole?: Role;
  }
}
