import { Request, Response, NextFunction } from 'express';

interface ErrorWithCode extends Error {
  code?: string | number;
  status?: number;
  msg?: string;
}

export const handle400 = (
  err: ErrorWithCode,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { code } = err;
  const errorCodes400: { [key: string]: string } = {
    '22003': 'Bad Request - Username should be a String',
    '22P02': 'Bad Request - ID should be an Integer',
    '23502': 'Bad Request - Invalid Property/Property Missing!',
  };
  if (errorCodes400[code as string] || err.status === 400) {
    res
      .status(400)
      .send({ message: errorCodes400[code as string] || err.msg });
  } else {
    next(err);
  }
};

export const handle404 = (
  err: ErrorWithCode,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { code } = err;
  const errorCodes404: { [key: string]: string } = {};
  if (errorCodes404[code as string] || err.status === 404) {
    res
      .status(404)
      .send({ message: errorCodes404[code as string] || err.msg });
  } else {
    next(err);
  }
};

export const handle405 = (req: Request, res: Response): void => {
  res.status(405).send({ msg: 'Method Not Allowed' });
};

export const handle422 = (
  err: ErrorWithCode,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { code } = err;
  const errorCodes422: { [key: string]: string } = {
    '23503': 'Unique Key Violation!. Request cannot be processed',
    '23505': 'Unique Key Violation!. Request cannot be processed',
  };
  if (errorCodes422[code as string] || err.status === 422) {
    res
      .status(422)
      .send({ message: errorCodes422[code as string] || err.msg });
  } else {
    next(err);
  }
};

export const handle500 = (
  err: ErrorWithCode,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { code } = err;
  const errorCodes500: { [key: string]: string } = {
    '42703': 'Property does not Exist - Internal Server Error',
  };
  if (errorCodes500[code as string]) {
    res.status(500).send({ message: errorCodes500[code as string] });
  } else {
    next(err);
  }
};
