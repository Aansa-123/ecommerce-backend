import express from 'express';
import * as brandController from '../controllers/Brand.js';

const router = express.Router();

router.get('/', brandController.getAll);

export default router;
