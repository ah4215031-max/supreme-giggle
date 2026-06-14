import express from 'express';
import * as reportController from '../controllers/reportController';

const router = express.Router();

// Create a new medical report
router.post('/', reportController.createReport);

// Get all reports with filters
router.get('/', reportController.getAllReports);

// Search reports
router.get('/search', reportController.searchReports);

// Get a specific report
router.get('/:reportId', reportController.getReportById);

// Update a report
router.put('/:reportId', reportController.updateReport);

// Update report status
router.patch('/:reportId/status', reportController.updateReportStatus);

// Export report as PDF
router.get('/:reportId/export', reportController.exportReportPDF);

// Delete a report
router.delete('/:reportId', reportController.deleteReport);

export default router;
