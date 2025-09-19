import express from 'express';
import * as addressController from '../controllers/Address.js';

const router = express.Router();

router.post('/', addressController.create);
router.get('/user/:id', addressController.getByUserId);
router.patch('/:id', addressController.updateById);
router.delete('/:id', addressController.deleteById);

export default router;
