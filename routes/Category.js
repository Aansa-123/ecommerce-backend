import express from 'express';
import * as categoryController from '../controllers/Category.js';

const router = express.Router();

router.get('/', categoryController.getAll);

export default router;
