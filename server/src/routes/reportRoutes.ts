import express from 'express';
import * as reportController from '../controllers/reportController';
import * as templateController from '../controllers/templateController';

const router = express.Router();

// Medical Reports Routes
router.post('/', reportController.createReport);
router.get('/', reportController.getAllReports);
router.get('/search', reportController.searchReports);
router.get('/:reportId', reportController.getReportById);
router.put('/:reportId', reportController.updateReport);
router.post('/:reportId/sign', reportController.signReport);
router.post('/:reportId/approve', reportController.approveReport);
router.delete('/:reportId', reportController.deleteReport);

// Report Templates Routes
router.post('/templates/create', templateController.createTemplate);
router.get('/templates', templateController.getAllTemplates);
router.get('/templates/:templateId', templateController.getTemplateById);
router.put('/templates/:templateId', templateController.updateTemplate);
router.delete('/templates/:templateId', templateController.deleteTemplate);

export default router;
