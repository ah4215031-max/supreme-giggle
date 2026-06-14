import mongoose, { Schema, Document } from 'mongoose';

export interface IReportTemplate extends Document {
  hospitalName: string;
  hospitalLogo?: string; // URL للشعار
  hospitalAddress?: string;
  hospitalPhone?: string;
  hospitalEmail?: string;
  headerColor?: string; // لون الرأس
  footerText?: string; // نص التذييل
  watermark?: string; // علامة مائية (صورة)
  watermarkOpacity?: number; // شفافية العلامة المائية
  watermarkPosition?: 'center' | 'diagonal' | 'top-right';
  signatureRequired?: boolean;
  approvalRequired?: boolean;
  templateName: string;
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const reportTemplateSchema = new Schema<IReportTemplate>(
  {
    hospitalName: {
      type: String,
      required: [true, 'يرجى إدخال اسم المستشفى'],
      trim: true
    },
    hospitalLogo: {
      type: String,
      default: null
    },
    hospitalAddress: {
      type: String,
      default: null
    },
    hospitalPhone: {
      type: String,
      default: null
    },
    hospitalEmail: {
      type: String,
      default: null
    },
    headerColor: {
      type: String,
      default: '#1976D2'
    },
    footerText: {
      type: String,
      default: 'جميع الحقوق محفوظة'
    },
    watermark: {
      type: String,
      default: null // URL للعلامة المائية
    },
    watermarkOpacity: {
      type: Number,
      default: 0.1,
      min: 0,
      max: 1
    },
    watermarkPosition: {
      type: String,
      enum: ['center', 'diagonal', 'top-right'],
      default: 'center'
    },
    signatureRequired: {
      type: Boolean,
      default: true
    },
    approvalRequired: {
      type: Boolean,
      default: true
    },
    templateName: {
      type: String,
      required: true,
      unique: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IReportTemplate>('ReportTemplate', reportTemplateSchema);
