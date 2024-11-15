import express from 'express';
import { getHeatInfo, getNavigationLink } from './heatController.js';

const router = express.Router();

router.get('/weather', getHeatInfo);

router.get('/navigation', getNavigationLink);

export default router;