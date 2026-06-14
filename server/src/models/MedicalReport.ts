import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicalReport extends Document {
  reportId: string;  // رقم التقرير الفريد
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  appointmentId?: mongoose.Types.ObjectId;
  reportType: 'diagnosis' | 'lab-result' | 'imaging' | 'surgery' | 'consultation' | 'general';
  title: string;
  content: string;
  findings: string;
  recommendations: string;
  attachments?: {
    filename: string;
    fileUrl: string;
    fileType: string;
    uploadedAt: Date;
  }[];
  signature?: {
    doctorName: string;
    doctorLicense: string;
    signatureImage?: string;
    signedAt: Date;
  };
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
      required: [true, 'يرجى إدخال محتوى التقرير'],
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
    signature: {
      doctorName: String,
      doctorLicense: String,
      signatureImage: String,
      signedAt: Date
    },
    hospital: {
      type: String,
      default: null
    },
    department: {
      type: String,
      default: null
    },
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

// Index للبحث السريع
medicalReportSchema.index({ patientId: 1, reportDate: -1 });
medicalReportSchema.index({ doctorId: 1, reportDate: -1 });
medicalReportSchema.index({ reportId: 1 });
medicalReportSchema.index({ status: 1 });

export default mongoose.model<IMedicalReport>('MedicalReport', medicalReportSchema);
