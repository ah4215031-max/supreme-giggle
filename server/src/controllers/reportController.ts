import { Request, Response } from 'express';
import MedicalReport from '../models/MedicalReport';
import ReportTemplate from '../models/ReportTemplate';
import { v4 as uuidv4 } from 'uuid';

// إنشاء تقرير طبي مع معلومات المستشفى والعلامة المائية
export const createReport = async (req: Request, res: Response) => {
  try {
    const {
      patientId,
      appointmentId,
      reportType,
      title,
      content,
      findings,
      recommendations,
      templateId,
      watermarkText,
      watermarkOpacity,
      watermarkPosition,
      hospitalInfo,
      department,
      confidentiality,
      tags,
      notes
    } = req.body;

    const doctorId = (req as any).user?.id;
    if (!doctorId) {
      return res.status(401).json({
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      });
    }

    // جلب التقرير من القالب إن وجد
    let template = null;
    let finalHospitalInfo = hospitalInfo;
    let watermarkSettings = {
      watermarkText: watermarkText || 'سري - تم تصدير من منصة صحتي',
      watermarkOpacity: watermarkOpacity || 0.1,
      watermarkPosition: watermarkPosition || 'center'
    };

    if (templateId) {
      template = await ReportTemplate.findById(templateId);
      if (template) {
        finalHospitalInfo = {
          hospitalName: template.hospitalName,
          hospitalLogo: template.hospitalLogo,
          hospitalAddress: template.hospitalAddress,
          hospitalPhone: template.hospitalPhone,
          hospitalEmail: template.hospitalEmail
        };
        watermarkSettings = {
          watermarkText: watermarkText || template.watermark || 'سري',
          watermarkOpacity: watermarkOpacity || template.watermarkOpacity || 0.1,
          watermarkPosition: watermarkPosition || template.watermarkPosition || 'center'
        };
      }
    }

    // توليد رقم التقرير الفريد
    const reportId = `RPT-${new Date().getFullYear()}-${uuidv4().substring(0, 8).toUpperCase()}`;

    // إنشاء التقرير
    const newReport = new MedicalReport({
      reportId,
      patientId,
      doctorId,
      appointmentId: appointmentId || null,
      reportType,
      title,
      content,
      findings,
      recommendations,
      templateId: templateId || null,
      hospitalInfo: finalHospitalInfo,
      watermarkSettings,
      department,
      confidentiality: confidentiality || 'private',
      tags: tags || [],
      notes
    });

    await newReport.save();

    return res.status(201).json({
      success: true,
      message: 'تم إنشاء التقرير بنجاح',
      data: newReport
    });
  } catch (error: any) {
    console.error('خطأ في إنشاء التقرير:', error);
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ في إنشاء التقرير',
      error: error.message
    });
  }
};

// إضافة توقيع الطبيب على التقرير
export const signReport = async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;
    const { doctorName, doctorLicense, signatureImage } = req.body;

    const report = await MedicalReport.findByIdAndUpdate(
      reportId,
      {
        signature: {
          doctorName,
          doctorLicense,
          signatureImage,
          signedAt: new Date()
        },
        status: 'completed'
      },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'التقرير غير موجود'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'تم توقيع التقرير بنجاح',
      data: report
    });
  } catch (error: any) {
    console.error('خطأ في توقيع التقرير:', error);
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ في توقيع التقرير',
      error: error.message
    });
  }
};

// موافقة مسؤول على التقرير
export const approveReport = async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;
    const { approvalNotes } = req.body;
    const approvedBy = (req as any).user?.id;

    const report = await MedicalReport.findByIdAndUpdate(
      reportId,
      {
        approvalInfo: {
          approvedBy,
          approvedAt: new Date(),
          approvalStatus: 'approved',
          approvalNotes
        },
        status: 'approved'
      },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'التقرير غير موجود'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'تم الموافقة على التقرير بنجاح',
      data: report
    });
  } catch (error: any) {
    console.error('خطأ في الموافقة على التقرير:', error);
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ في الموافقة على التقرير',
      error: error.message
    });
  }
};

// الحصول على جميع التقارير
export const getAllReports = async (req: Request, res: Response) => {
  try {
    const { patientId, doctorId, status, reportType, page = 1, limit = 10 } = req.query;

    const filters: any = {};
    if (patientId) filters.patientId = patientId;
    if (doctorId) filters.doctorId = doctorId;
    if (status) filters.status = status;
    if (reportType) filters.reportType = reportType;

    const skip = (Number(page) - 1) * Number(limit);

    const reports = await MedicalReport.find(filters)
      .populate('patientId')
      .populate('doctorId')
      .sort({ reportDate: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await MedicalReport.countDocuments(filters);

    return res.status(200).json({
      success: true,
      data: reports,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب التقارير',
      error: error.message
    });
  }
};

// الحصول على تقرير واحد
export const getReportById = async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;

    const report = await MedicalReport.findById(reportId)
      .populate('patientId')
      .populate('doctorId')
      .populate('appointmentId');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'التقرير غير موجود'
      });
    }

    return res.status(200).json({
      success: true,
      data: report
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب التقرير',
      error: error.message
    });
  }
};

// تحديث التقرير
export const updateReport = async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;
    const updates = req.body;

    const report = await MedicalReport.findByIdAndUpdate(
      reportId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'التقرير غير موجود'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'تم تحديث التقرير بنجاح',
      data: report
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ في تحديث التقرير',
      error: error.message
    });
  }
};

// حذف التقرير
export const deleteReport = async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;

    const report = await MedicalReport.findByIdAndDelete(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'التقرير غير موجود'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'تم حذف التقرير بنجاح'
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ في حذف التقرير',
      error: error.message
    });
  }
};

// البحث عن التقارير
export const searchReports = async (req: Request, res: Response) => {
  try {
    const { keyword, reportType, status } = req.query;

    const filters: any = {};
    if (keyword) {
      filters.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { content: { $regex: keyword, $options: 'i' } },
        { findings: { $regex: keyword, $options: 'i' } }
      ];
    }
    if (reportType) filters.reportType = reportType;
    if (status) filters.status = status;

    const reports = await MedicalReport.find(filters)
      .populate('patientId')
      .populate('doctorId')
      .sort({ reportDate: -1 })
      .limit(20);

    return res.status(200).json({
      success: true,
      data: reports,
      count: reports.length
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ في البحث عن التقارير',
      error: error.message
    });
  }
};
