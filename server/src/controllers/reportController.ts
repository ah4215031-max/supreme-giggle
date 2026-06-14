import { Request, Response } from 'express';
import MedicalReport from '../models/MedicalReport';
import Patient from '../models/Patient';
import User from '../models/User';
import { v4 as uuidv4 } from 'uuid';

// إنشاء تقرير طبي جديد
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
      hospital,
      department,
      confidentiality,
      tags,
      notes
    } = req.body;

    // التحقق من وجود المريض
    const patient = await Patient.findById(patientId).populate('userId');
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'المريض غير موجود'
      });
    }

    // توليد رقم تقرير فريد
    const reportId = `RPT-${new Date().getFullYear()}-${uuidv4().substring(0, 8).toUpperCase()}`;

    // الحصول على بيانات الطبيب من الـ session
    const doctorId = (req as any).user?.id;
    if (!doctorId) {
      return res.status(401).json({
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      });
    }

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
      hospital,
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
      .populate('patientId', 'userId')
      .populate('doctorId', 'userId')
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
    console.error('خطأ في جلب التقارير:', error);
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
    console.error('خطأ في جلب التقرير:', error);
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
    console.error('خطأ في تحديث التقرير:', error);
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ في تحديث التقرير',
      error: error.message
    });
  }
};

// تحديث حالة التقرير
export const updateReportStatus = async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;

    const validStatuses = ['draft', 'completed', 'approved', 'archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'حالة التقرير غير صحيحة'
      });
    }

    const report = await MedicalReport.findByIdAndUpdate(
      reportId,
      { status },
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
      message: `تم تغيير حالة التقرير إلى ${status}`,
      data: report
    });
  } catch (error: any) {
    console.error('خطأ في تحديث حالة التقرير:', error);
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ في تحديث حالة التقرير',
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
    console.error('خطأ في حذف التقرير:', error);
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ في حذف التقرير',
      error: error.message
    });
  }
};

// تصدير التقرير كـ PDF
export const exportReportPDF = async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;

    const report = await MedicalReport.findById(reportId)
      .populate('patientId')
      .populate('doctorId');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'التقرير غير موجود'
      });
    }

    // هنا يتم إضافة مكتبة PDF مثل pdfkit أو html2pdf
    // للآن نرسل البيانات للـ frontend ليتم تصديرها
    return res.status(200).json({
      success: true,
      message: 'جاهز للتصدير',
      data: report
    });
  } catch (error: any) {
    console.error('خطأ في تصدير التقرير:', error);
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ في تصدير التقرير',
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
    console.error('خطأ في البحث عن التقارير:', error);
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ في البحث عن التقارير',
      error: error.message
    });
  }
};
