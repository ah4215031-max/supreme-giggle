import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Edit,
  Delete,
  Download,
  Print,
  MoreVert,
  CheckCircle,
  Schedule,
  Error
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ReportCardContainer = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '1px solid #e0e0e0',
  '&:hover': {
    boxShadow: '0 12px 24px rgba(102, 126, 234, 0.15)',
    transform: 'translateY(-4px)',
    borderColor: '#667eea'
  }
}));

const ReportHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '16px',
  paddingBottom: '12px',
  borderBottom: '2px solid rgba(102, 126, 234, 0.1)'
});

const ReportTitle = styled(Typography)({
  fontSize: '1.2rem',
  fontWeight: '600',
  color: '#333',
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
});

const ReportID = styled(Typography)({
  fontSize: '0.85rem',
  color: '#667eea',
  fontWeight: '500',
  marginTop: '4px'
});

const InfoGrid = styled(Grid)({
  gap: '12px'
});

const InfoItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '0.9rem',
  color: '#666'
});

const InfoLabel = styled(Typography)({
  fontWeight: '600',
  color: '#667eea',
  minWidth: '80px'
});

const StatusChip = styled(Chip)(({ theme }) => ({
  borderRadius: '6px',
  fontWeight: '500',
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
}));

const ActionButton = styled(IconButton)({
  color: '#667eea',
  '&:hover': {
    backgroundColor: 'rgba(102, 126, 234, 0.1)'
  }
});

interface ReportCardProps {
  reportId: string;
  title: string;
  patientName: string;
  doctorName: string;
  reportType: string;
  date: string;
  status: 'draft' | 'completed' | 'approved' | 'archived';
  onEdit?: () => void;
  onDelete?: () => void;
  onDownload?: () => void;
  onPrint?: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({
  reportId,
  title,
  patientName,
  doctorName,
  reportType,
  date,
  status,
  onEdit,
  onDelete,
  onDownload,
  onPrint
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getStatusColor = () => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'completed':
        return 'info';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'approved':
        return <CheckCircle sx={{ fontSize: '1rem' }} />;
      case 'completed':
        return <CheckCircle sx={{ fontSize: '1rem' }} />;
      case 'draft':
        return <Schedule sx={{ fontSize: '1rem' }} />;
      case 'archived':
        return <Error sx={{ fontSize: '1rem' }} />;
      default:
        return null;
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'approved':
        return 'موافق عليه';
      case 'completed':
        return 'مكتمل';
      case 'draft':
        return 'مسودة';
      case 'archived':
        return 'مؤرشف';
      default:
        return '';
    }
  };

  const getReportTypeLabel = () => {
    const types: { [key: string]: string } = {
      'diagnosis': 'تشخيص',
      'lab-result': 'نتيجة مختبر',
      'imaging': 'تصوير طبي',
      'surgery': 'جراحة',
      'consultation': 'استشارة',
      'general': 'عام'
    };
    return types[reportType] || reportType;
  };

  return (
    <ReportCardContainer>
      <CardContent>
        <ReportHeader>
          <Box>
            <ReportTitle>{title}</ReportTitle>
            <ReportID>#{reportId}</ReportID>
          </Box>
          <Box>
            <ActionButton size="small" onClick={handleMenuOpen}>
              <MoreVert />
            </ActionButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {onEdit && (
                <MenuItem onClick={() => { onEdit(); handleMenuClose(); }}>
                  <Edit sx={{ mr: 1, fontSize: '1.2rem' }} />
                  تعديل
                </MenuItem>
              )}
              {onDownload && (
                <MenuItem onClick={() => { onDownload(); handleMenuClose(); }}>
                  <Download sx={{ mr: 1, fontSize: '1.2rem' }} />
                  تحميل
                </MenuItem>
              )}
              {onPrint && (
                <MenuItem onClick={() => { onPrint(); handleMenuClose(); }}>
                  <Print sx={{ mr: 1, fontSize: '1.2rem' }} />
                  طباعة
                </MenuItem>
              )}
              {onDelete && (
                <MenuItem onClick={() => { onDelete(); handleMenuClose(); }} sx={{ color: 'error.main' }}>
                  <Delete sx={{ mr: 1, fontSize: '1.2rem' }} />
                  حذف
                </MenuItem>
              )}
            </Menu>
          </Box>
        </ReportHeader>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <InfoItem>
              <InfoLabel>المريض:</InfoLabel>
              <Typography sx={{ flex: 1 }}>{patientName}</Typography>
            </InfoItem>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoItem>
              <InfoLabel>الطبيب:</InfoLabel>
              <Typography sx={{ flex: 1 }}>{doctorName}</Typography>
            </InfoItem>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoItem>
              <InfoLabel>النوع:</InfoLabel>
              <Chip label={getReportTypeLabel()} size="small" variant="outlined" sx={{ borderColor: '#667eea', color: '#667eea' }} />
            </InfoItem>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoItem>
              <InfoLabel>التاريخ:</InfoLabel>
              <Typography sx={{ flex: 1 }}>{date}</Typography>
            </InfoItem>
          </Grid>
          <Grid item xs={12}>
            <InfoItem>
              <InfoLabel>الحالة:</InfoLabel>
              <StatusChip
                icon={getStatusIcon()}
                label={getStatusLabel()}
                color={getStatusColor() as any}
                size="small"
              />
            </InfoItem>
          </Grid>
        </Grid>
      </CardContent>
    </ReportCardContainer>
  );
};

export default ReportCard;
