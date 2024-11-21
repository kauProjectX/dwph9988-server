import Joi from 'joi';

export const weatherQuerySchema = Joi.object({
  nx: Joi.number().required().messages({
    'any.required': 'nx 좌표는 필수입니다.',
    'number.base': 'nx 좌표는 숫자여야 합니다.'
  }),
  ny: Joi.number().required().messages({
    'any.required': 'ny 좌표는 필수입니다.',
    'number.base': 'ny 좌표는 숫자여야 합니다.'
  })
});

export const navigationQuerySchema = Joi.object({
  Lat: Joi.number().required().messages({
    'any.required': '위도 좌표는 필수입니다.',
    'number.base': '위도 좌표는 숫자여야 합니다.'
  }),
  Lot: Joi.number().required().messages({
    'any.required': '경도 좌표는 필수입니다.',
    'number.base': '경도 좌표는 숫자여야 합니다.'
  }),
  Name: Joi.string().required().messages({
    'any.required': '쉼터 이름은 필수입니다.',
    'string.base': '쉼터 이름은 문자열이어야 합니다.'
  })
});
