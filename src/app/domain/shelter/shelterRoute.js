import express from 'express';
import { getShelters } from './shelterController.js';
import './shelter.swagger.js';

const router = express.Router();

router.get('/', getShelters);

export default router;
