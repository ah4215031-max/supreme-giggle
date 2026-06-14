import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Validation rules
export const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('الاسم مطلوب')
    .isLength({ min: 3 }).withMessage('الاسم يجب أن يكون 3 أحرف على الأقل'),
  body('email')
    .toLowerCase()
    .isEmail().withMessage('البريد الإلكتروني غير صحيح'),
  body('password')
    .isLength({ min: 6 }).withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'g')
    .withMessage('كلمة المرور يجب أن تحتوي على أحرف صغيرة وكبيرة وأرقام'),
  body('phone')
    .isMobilePhone('ar-SA').withMessage('رقم الهاتف غير صحيح')
];

export const loginValidation = [
  body('email')
    .toLowerCase()
    .isEmail().withMessage('البريد الإلكتروني غير صحيح'),
  body('password')
    .notEmpty().withMessage('كلمة المرور مطلوبة')
];

// Middleware to handle validation errors
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};
