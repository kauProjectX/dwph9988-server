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
