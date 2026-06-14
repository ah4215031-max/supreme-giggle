import { Request, Response } from 'express';
import ReportTemplate from '../models/ReportTemplate';

// إنشاء قالب تقرير جديد
export const createTemplate = async (req: Request, res: Response) => {
  try {
    const {
      templateName,
      hospitalName,
      hospitalLogo,
      hospitalAddress,
      hospitalPhone,
      hospitalEmail,
      headerColor,
      footerText,
      watermark,
      watermarkOpacity,
      watermarkPosition,
      signatureRequired,
      approvalRequired
    } = req.body;

    const createdBy = (req as any).user?.id;
    if (!createdBy) {
      return res.status(401).json({
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      });
    }

    const newTemplate = new ReportTemplate({
      templateName,
      hospitalName,
      hospitalLogo,
      hospitalAddress,
      hospitalPhone,
      hospitalEmail,
      headerColor,
      footerText,
      watermark,
      watermarkOpacity,
      watermarkPosition,
      signatureRequired,
      approvalRequired,
      createdBy
    });

    await newTemplate.save();

    return res.status(201).json({
      success: true,
      message: 'تم إنشاء القالب بنجاح',
      data: newTemplate
    });
  } catch (error: any) {
    console.error('خطأ في إنشاء القالب:', error);
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ في إنشاء القالب',
      error: error.message
    });
  }
};

// الحصول على جميع القوالب
export const getAllTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await ReportTemplate.find({ isActive: true })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: templates,
      count: templates.length
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب القوالب',
      error: error.message
    });
  }
};

// الحصول على قالب واحد
export const getTemplateById = async (req: Request, res: Response) => {
  try {
    const { templateId } = req.params;

    const template = await ReportTemplate.findById(templateId).populate('createdBy', 'name email');

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'القالب غير موجود'
      });
    }

    return res.status(200).json({
      success: true,
      data: template
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب القالب',
      error: error.message
    });
  }
};

// تحديث القالب
export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const { templateId } = req.params;
    const updates = req.body;

    const template = await ReportTemplate.findByIdAndUpdate(
      templateId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'القالب غير موجود'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'تم تحديث القالب بنجاح',
      data: template
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ في تحديث القالب',
      error: error.message
    });
  }
};

// حذف القالب
export const deleteTemplate = async (req: Request, res: Response) => {
  try {
    const { templateId } = req.params;

    const template = await ReportTemplate.findByIdAndUpdate(
      templateId,
      { isActive: false },
      { new: true }
    );

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'القالب غير موجود'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'تم حذف القالب بنجاح'
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ في حذف القالب',
      error: error.message
    });
  }
};
