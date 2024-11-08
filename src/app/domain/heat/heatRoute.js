import express from 'express';
import { getHeatInfo } from './heatController.js';

const router = express.Router();
// const controller = new HeatController();

router.get('/weather', getHeatInfo);

export default router;