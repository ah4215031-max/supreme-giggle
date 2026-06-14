import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  InputAdornment,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
  Chip
} from '@mui/material';
import {
  CloudUpload,
  Save,
  Print,
  Download,
  Edit,
  Delete
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled Components
const ReportContainer = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '15px',
  padding: '40px',
  color: '#fff',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\" %3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.5,
    pointerEvents: 'none'
  }
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: '30px',
  position: 'relative',
  zIndex: 1
}));

const HospitalLogo = styled('img')(({ theme }) => ({
  maxWidth: '80px',
  height: 'auto',
  marginBottom: '15px',
  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
}));

const HospitalName = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 'bold',
  marginBottom: '5px',
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
}));

const SubTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.95rem',
  opacity: 0.9,
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
}));

const FormSection = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  marginBottom: '20px',
  border: '1px solid #e0e0e0',
  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.2)',
    transform: 'translateY(-2px)'
  }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem',
  fontWeight: '600',
  color: '#667eea',
  marginBottom: '15px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  '&::before': {
    content: '""',
    width: '4px',
    height: '24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '2px'
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    '&:hover fieldset': {
      borderColor: '#667eea'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
    }
  },
  '& .MuiInputBase-input': {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    fontSize: '0.95rem'
  },
  '& .MuiInputLabel-root': {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    color: '#666'
  }
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  padding: '10px 24px',
  fontSize: '0.95rem',
  fontWeight: '600',
  textTransform: 'none',
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)'
  }
}));

const PrimaryButton = styled(ActionButton)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
  '&:hover': {
    background: 'linear-gradient(135deg, #5568d3 0%, #663a92 100%)'
  }
}));

const SecondaryButton = styled(ActionButton)(({ theme }) => ({
  border: '2px solid #667eea',
  color: '#667eea',
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: 'rgba(102, 126, 234, 0.05)'
  }
}));

const InfoCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea05 0%, #764ba205 100%)',
  border: '1px solid rgba(102, 126, 234, 0.2)',
  borderRadius: '8px',
  marginTop: '15px'
}));

const ReportPreview = styled(Paper)(({ theme }) => ({
  padding: '40px',
  borderRadius: '8px',
  background: '#fff',
  position: 'relative',
  minHeight: '600px',
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  border: '1px solid #e0e0e0',
  '&::before': {
    content: '"محسوب - سري"',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    fontSize: '80px',
    opacity: 0.08,
    color: '#667eea',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    zIndex: 0
  }
}));

const PreviewContent = styled(Box)({
  position: 'relative',
  zIndex: 1
});

const PreviewHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  paddingBottom: '20px',
  borderBottom: '3px solid',
  borderImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%) 1',
  marginBottom: '30px'
}));

const PreviewTitle = styled(Typography)({
  fontSize: '1.8rem',
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '10px',
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
});

const PreviewSubtitle = styled(Typography)({
  fontSize: '0.95rem',
  color: '#666',
  marginBottom: '5px'
});

const SectionBox = styled(Box)({
  marginBottom: '25px',
  '&:last-child': {
    marginBottom: 0
  }
});

const SectionLabel = styled(Typography)({
  fontSize: '0.85rem',
  fontWeight: 'bold',
  color: '#667eea',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '8px',
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
});

const SectionContent = styled(Typography)({
  fontSize: '0.95rem',
  color: '#333',
  lineHeight: '1.6',
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
});

const UploadArea = styled(Box)(({ theme }) => ({
  border: '2px dashed #667eea',
  borderRadius: '8px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: 'rgba(102, 126, 234, 0.02)',
  '&:hover': {
    backgroundColor: 'rgba(102, 126, 234, 0.05)',
    borderColor: '#764ba2'
  }
}));

const MedicalReportForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    reportType: 'diagnosis',
    patientName: '',
    patientId: '',
    doctorName: '',
    content: '',
    findings: '',
    recommendations: '',
    watermarkText: 'محسوب - سري',
    hospitalName: 'مستشفى صحتي',
    hospitalAddress: 'الرياض - المملكة العربية السعودية',
    hospitalPhone: '+966-11-XXXX-XXXX',
    hospitalEmail: 'info@healthplatform.sa'
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [watermarkFile, setWatermarkFile] = useState<File | null>(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleWatermarkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setWatermarkFile(e.target.files[0]);
    }
  };

  const handleSaveReport = () => {
    setSuccessMessage('✅ تم حفظ التقرير بنجاح!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleDownloadReport = () => {
    // Implementation for PDF download
    alert('سيتم تحميل التقرير بصيغة PDF');
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', py: 4 }}>
      <Container maxWidth="lg">
        {/* Success Alert */}
        {successMessage && (
          <Alert 
            severity="success" 
            sx={{ 
              marginBottom: 3,
              borderRadius: '8px',
              fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
            }}
          >
            {successMessage}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Form Section */}
          <Grid item xs={12} lg={6}>
            <ReportContainer>
              <HeaderSection>
                <HospitalName>إنشاء تقرير طبي رسمي</HospitalName>
                <SubTitle>قالب احترافي مع العلامة المائية وشعار المستشفى</SubTitle>
              </HeaderSection>

              {/* Hospital Info Section */}
              <FormSection>
                <CardContent>
                  <SectionTitle>معلومات المستشفى</SectionTitle>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        label="اسم المستشفى"
                        name="hospitalName"
                        value={formData.hospitalName}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        label="عنوان المستشفى"
                        name="hospitalAddress"
                        value={formData.hospitalAddress}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="رقم الهاتف"
                        name="hospitalPhone"
                        value={formData.hospitalPhone}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="البريد الإلكتروني"
                        name="hospitalEmail"
                        value={formData.hospitalEmail}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    </Grid>
                    
                    {/* Logo Upload */}
                    <Grid item xs={12}>
                      <Typography sx={{ mb: 1, fontWeight: 500, color: '#333' }}>شعار المستشفى</Typography>
                      <UploadArea component="label">
                        <input
                          hidden
                          accept="image/*"
                          type="file"
                          onChange={handleLogoUpload}
                        />
                        <CloudUpload sx={{ fontSize: 40, color: '#667eea', mb: 1 }} />
                        <Typography sx={{ color: '#667eea', fontWeight: 500 }}>
                          {logoFile ? logoFile.name : 'اضغط لتحميل الشعار'}
                        </Typography>
                      </UploadArea>
                    </Grid>
                  </Grid>
                </CardContent>
              </FormSection>

              {/* Watermark Section */}
              <FormSection>
                <CardContent>
                  <SectionTitle>العلامة المائية</SectionTitle>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        label="نص العلامة المائية"
                        name="watermarkText"
                        value={formData.watermarkText}
                        onChange={handleInputChange}
                        variant="outlined"
                        helperText="سيظهر هذا النص بشفافية على الخلفية"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography sx={{ mb: 1, fontWeight: 500, color: '#333' }}>صور�� العلامة المائية</Typography>
                      <UploadArea component="label">
                        <input
                          hidden
                          accept="image/*"
                          type="file"
                          onChange={handleWatermarkUpload}
                        />
                        <CloudUpload sx={{ fontSize: 40, color: '#667eea', mb: 1 }} />
                        <Typography sx={{ color: '#667eea', fontWeight: 500 }}>
                          {watermarkFile ? watermarkFile.name : 'اضغط لتحميل العلامة المائية'}
                        </Typography>
                      </UploadArea>
                    </Grid>
                  </Grid>
                </CardContent>
              </FormSection>

              {/* Report Content Section */}
              <FormSection>
                <CardContent>
                  <SectionTitle>محتوى التقرير</SectionTitle>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        label="عنوان التقرير"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        select
                        label="نوع التقرير"
                        name="reportType"
                        value={formData.reportType}
                        onChange={handleInputChange}
                        variant="outlined"
                      >
                        <MenuItem value="diagnosis">التشخيص</MenuItem>
                        <MenuItem value="lab-result">نتيجة المختبر</MenuItem>
                        <MenuItem value="imaging">التصوير الطبي</MenuItem>
                        <MenuItem value="surgery">التقرير الجراحي</MenuItem>
                        <MenuItem value="consultation">الاستشارة</MenuItem>
                        <MenuItem value="general">تقرير عام</MenuItem>
                      </StyledTextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="اسم الطبيب"
                        name="doctorName"
                        value={formData.doctorName}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        multiline
                        rows={4}
                        label="محتوى التقرير"
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        multiline
                        rows={3}
                        label="النتائج والملاحظات"
                        name="findings"
                        value={formData.findings}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        multiline
                        rows={3}
                        label="التوصيات والعلاجات"
                        name="recommendations"
                        value={formData.recommendations}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </FormSection>

              {/* Action Buttons */}
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6}>
                  <PrimaryButton
                    fullWidth
                    startIcon={<Save />}
                    onClick={handleSaveReport}
                  >
                    حفظ التقرير
                  </PrimaryButton>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <SecondaryButton
                    fullWidth
                    onClick={() => setOpenPreview(true)}
                  >
                    معاينة
                  </SecondaryButton>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <SecondaryButton
                    fullWidth
                    startIcon={<Print />}
                    onClick={handlePrintReport}
                  >
                    طباعة
                  </SecondaryButton>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <SecondaryButton
                    fullWidth
                    startIcon={<Download />}
                    onClick={handleDownloadReport}
                  >
                    تحميل PDF
                  </SecondaryButton>
                </Grid>
              </Grid>
            </ReportContainer>
          </Grid>

          {/* Preview Section */}
          <Grid item xs={12} lg={6}>
            <Box sx={{ mb: 3 }}>
              <ReportPreview>
                <PreviewContent>
                  {/* Hospital Header */}
                  <PreviewHeader>
                    {logoFile && (
                      <HospitalLogo
                        src={URL.createObjectURL(logoFile)}
                        alt="Hospital Logo"
                      />
                    )}
                    <PreviewTitle>{formData.hospitalName}</PreviewTitle>
                    <PreviewSubtitle>{formData.hospitalAddress}</PreviewSubtitle>
                    <PreviewSubtitle>{formData.hospitalPhone} | {formData.hospitalEmail}</PreviewSubtitle>
                  </PreviewHeader>

                  {/* Report Header */}
                  <SectionBox>
                    <SectionLabel>رقم التقرير</SectionLabel>
                    <SectionContent>RPT-2026-ABC12345</SectionContent>
                  </SectionBox>

                  <SectionBox>
                    <SectionLabel>عنوان التقرير</SectionLabel>
                    <SectionContent sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#667eea' }}>
                      {formData.title || 'عنوان التقرير'}
                    </SectionContent>
                  </SectionBox>

                  <Divider sx={{ my: 2 }} />

                  {/* Report Details */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <SectionBox>
                        <SectionLabel>نوع التقرير</SectionLabel>
                        <SectionContent>{formData.reportType}</SectionContent>
                      </SectionBox>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <SectionBox>
                        <SectionLabel>الطبيب المسؤول</SectionLabel>
                        <SectionContent>{formData.doctorName || 'اسم الطبيب'}</SectionContent>
                      </SectionBox>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  {/* Content */}
                  {formData.content && (
                    <SectionBox>
                      <SectionLabel>محتوى التقرير</SectionLabel>
                      <SectionContent>{formData.content}</SectionContent>
                    </SectionBox>
                  )}

                  {formData.findings && (
                    <SectionBox>
                      <SectionLabel>النتائج</SectionLabel>
                      <SectionContent>{formData.findings}</SectionContent>
                    </SectionBox>
                  )}

                  {formData.recommendations && (
                    <SectionBox>
                      <SectionLabel>التوصيات</SectionLabel>
                      <SectionContent>{formData.recommendations}</SectionContent>
                    </SectionBox>
                  )}

                  {/* Footer */}
                  <Divider sx={{ my: 3 }} />
                  <Box sx={{ textAlign: 'center', pt: 2, borderTop: '1px solid #e0e0e0' }}>
                    <Typography sx={{ fontSize: '0.8rem', color: '#999', mb: 1 }}>
                      التاريخ: {new Date().toLocaleDateString('ar-SA')}
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#999' }}>
                      جميع الحقوق محفوظة © {formData.hospitalName}
                    </Typography>
                  </Box>
                </PreviewContent>
              </ReportPreview>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MedicalReportForm;
