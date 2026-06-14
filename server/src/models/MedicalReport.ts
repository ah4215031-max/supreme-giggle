import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicalReport extends Document {
  reportId: string;
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  appointmentId?: mongoose.Types.ObjectId;
  reportType: 'diagnosis' | 'lab-result' | 'imaging' | 'surgery' | 'consultation' | 'general';
  title: string;
  content: string;
  findings: string;
  recommendations: string;
  // معلومات المستشفى والعلامة المائية
  templateId?: mongoose.Types.ObjectId;
  hospitalInfo?: {
    hospitalName: string;
    hospitalLogo?: string;
    hospitalAddress?: string;
    hospitalPhone?: string;
    hospitalEmail?: string;
  };
  watermarkSettings?: {
    watermarkImage?: string;
    watermarkText?: string;
    watermarkOpacity?: number;
    watermarkPosition?: 'center' | 'diagonal' | 'top-right';
  };
  // التوقيع والموافقة
  signature?: {
    doctorName: string;
    doctorLicense: string;
    signatureImage?: string;
    signedAt: Date;
  };
  approvalInfo?: {
    approvedBy?: mongoose.Types.ObjectId;
    approvedAt?: Date;
    approvalStatus?: 'pending' | 'approved' | 'rejected';
    approvalNotes?: string;
  };
  attachments?: {
    filename: string;
    fileUrl: string;
    fileType: string;
    uploadedAt: Date;
  }[];
  hospital?: string;
  department?: string;
  reportDate: Date;
  status: 'draft' | 'completed' | 'approved' | 'archived';
  confidentiality: 'public' | 'private' | 'restricted';
  tags?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const medicalReportSchema = new Schema<IMedicalReport>(
  {
    reportId: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
      index: true
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
      default: null
    },
    reportType: {
      type: String,
      enum: ['diagnosis', 'lab-result', 'imaging', 'surgery', 'consultation', 'general'],
      required: true
    },
    title: {
      type: String,
      required: [true, 'يرجى إدخال عنوان التقرير'],
      minlength: [5, 'العنوان يجب أن يكون على الأقل 5 أحرف']
    },
    content: {
      type: String,
      required: [true, 'يرجى إدخا�� محتوى التقرير'],
      minlength: [20, 'المحتوى يجب أن يكون على الأقل 20 حرف']
    },
    findings: {
      type: String,
      required: [true, 'يرجى إدخال النتائج']
    },
    recommendations: {
      type: String,
      required: [true, 'يرجى إدخال التوصيات']
    },
    // معلومات المستشفى
    templateId: {
      type: Schema.Types.ObjectId,
      ref: 'ReportTemplate'
    },
    hospitalInfo: {
      hospitalName: String,
      hospitalLogo: String,
      hospitalAddress: String,
      hospitalPhone: String,
      hospitalEmail: String
    },
    watermarkSettings: {
      watermarkImage: String,
      watermarkText: String,
      watermarkOpacity: {
        type: Number,
        default: 0.1
      },
      watermarkPosition: {
        type: String,
        enum: ['center', 'diagonal', 'top-right'],
        default: 'center'
      }
    },
    signature: {
      doctorName: String,
      doctorLicense: String,
      signatureImage: String,
      signedAt: Date
    },
    approvalInfo: {
      approvedBy: Schema.Types.ObjectId,
      approvedAt: Date,
      approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      },
      approvalNotes: String
    },
    attachments: [
      {
        filename: String,
        fileUrl: String,
        fileType: String,
        uploadedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    hospital: String,
    department: String,
    reportDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['draft', 'completed', 'approved', 'archived'],
      default: 'draft'
    },
    confidentiality: {
      type: String,
      enum: ['public', 'private', 'restricted'],
      default: 'private'
    },
    tags: [String],
    notes: String
  },
  {
    timestamps: true
  }
);

// Indexes
medicalReportSchema.index({ patientId: 1, reportDate: -1 });
medicalReportSchema.index({ doctorId: 1, reportDate: -1 });
medicalReportSchema.index({ reportId: 1 });
medicalReportSchema.index({ status: 1 });

export default mongoose.model<IMedicalReport>('MedicalReport', medicalReportSchema);
