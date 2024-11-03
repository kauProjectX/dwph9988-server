export class MemberError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export class DuplicateEmailError extends MemberError {
  constructor() {
    super('이미 사용 중인 이메일입니다.', 409);
  }
}

export class InvalidPasswordError extends MemberError {
  constructor() {
    super(
      '비밀번호는 영문, 숫자, 특수문자를 포함한 8자 이상이어야 합니다.',
      400
    );
  }
}

export class InvalidCredentialsError extends MemberError {
  constructor() {
    super('이메일 또는 비밀번호가 일치하지 않습니다.', 401);
  }
}

export class RequiredFieldMissingError extends MemberError {
  constructor(field) {
    super(`${field}은(는) 필수 입력항목입니다.`, 400);
  }
}

export class InvalidPhoneNumberError extends MemberError {
  constructor() {
    super('올바른 전화번호 형식이 아닙니다. (예: 01012345678)', 400);
  }
}

export class InvalidBirthdayError extends MemberError {
  constructor() {
    super('올바른 생년월일 형식이 아닙니다. (예: 1990-01-01)', 400);
  }
}

export class InvalidUserTypeError extends MemberError {
  constructor() {
    super('올바른 사용자 유형이 아닙니다. (1: 보호자, 2: 어르신)', 400);
  }
}
