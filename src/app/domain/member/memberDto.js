import Joi from 'joi';

export const signupSchema = Joi.object({
  userId: Joi.string().email().required().messages({
    'string.email': '유효한 이메일 주소를 입력해주세요.',
    'any.required': '이메일은 필수 입력항목입니다.',
  }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-zA-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/)
    .required()
    .messages({
      'string.min': '비밀번호는 최소 8자 이상이어야 합니다.',
      'string.pattern.base':
        '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.',
      'any.required': '비밀번호는 필수 입력항목입니다.',
    }),
  userName: Joi.string().required().messages({
    'any.required': '이름은 필수 입력항목입니다.',
  }),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10,11}$/)
    .required()
    .messages({
      'string.pattern.base': '올바른 전화번호 형식이 아닙니다.',
      'any.required': '전화번호는 필수 입력항목입니다.',
    }),
  birthday: Joi.date().required().messages({
    'any.required': '생년월일은 필수 입력항목입니다.',
  }),
  userType: Joi.number().valid(1, 2).required().messages({
    'any.only': '올바른 사용자 유형이 아닙니다. (1: 보호자, 2: 어르신)',
    'any.required': '사용자 유형은 필수 선택항목입니다. (1: 보호자, 2: 어르신)',
  }),
});

export const loginSchema = Joi.object({
  userId: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateProfileSchema = Joi.object({
  userName: Joi.string().optional(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10,11}$/)
    .optional()
    .messages({
      'string.pattern.base': '올바른 전화번호 형식이 아닙니다.',
    }),
  birthday: Joi.date().optional(),
})
  .min(1)
  .messages({
    'object.min': '수정할 정보를 최소 1개 이상 입력해주세요.',
  });
