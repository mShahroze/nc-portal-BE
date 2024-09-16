declare namespace Express {
  export interface Request {
    user?: UserType; // Replace `UserType` with the specific type of your user object
  }
}
