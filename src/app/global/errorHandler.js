// src/app/global/errorHandler.js
import logger from './logger.js';
import { errResponse } from './response.js';

class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toResponse() {
    return errResponse({
      isSuccess: false,
      message: this.message,
    });
  }
}

class BadRequestError extends CustomError {
  constructor(message = '잘못된 요청입니다.') {
    super(message, 400);
  }
}

class UnauthorizedError extends CustomError {
  constructor(message = '인증이 필요합니다.') {
    super(message, 401);
  }
}

class ForbiddenError extends CustomError {
  constructor(message = '권한이 없습니다.') {
    super(message, 403);
  }
}

class NotFoundError extends CustomError {
  constructor(message = '리소스를 찾을 수 없습니다.') {
    super(message, 404);
  }
}

class ConflictError extends CustomError {
  constructor(message = '리소스가 이미 존재합니다.') {
    super(message, 409);
  }
}

class InternalServerError extends CustomError {
  constructor(message = '서버 내부 오류가 발생했습니다.') {
    super(message, 500);
  }
}

// 에러 미들웨어
const errorMiddleware = (err, req, res, next) => {
  // 에러 로깅
  logger.error(`${err.name}: ${err.message}`);
  logger.error(`Stack: ${err.stack}`);
  logger.error(`Request: ${req.method} ${req.originalUrl}`);
  logger.error(`Body: ${JSON.stringify(req.body)}`);

  if (err instanceof CustomError) {
    return res.status(err.status).json(err.toResponse());
  }

  // Prisma 에러 처리
  if (err?.code?.startsWith('P')) {
    let message = '데이터베이스 오류가 발생했습니다.';
    let status = 500;

    switch (err.code) {
      case 'P2002':
        message = '중복된 데이터가 존재합니다.';
        status = 409;
        break;
      case 'P2025':
        message = '데이터를 찾을 수 없습니다.';
        status = 404;
        break;
    }

    return res.status(status).json(
      errResponse({
        isSuccess: false,
        message,
      })
    );
  }

  // 예상치 못한 에러
  return res.status(500).json(
    errResponse({
      isSuccess: false,
      message: '서버 내부 오류가 발생했습니다.',
    })
  );
};

export {
  CustomError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  errorMiddleware,
};
