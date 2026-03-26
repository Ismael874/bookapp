const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.index);
router.get('/create', categoryController.createForm);
router.post('/create', categoryController.create);
router.get('/edit/:id', categoryController.editForm);
router.post('/edit/:id', categoryController.update);
router.get('/delete/:id', categoryController.deleteConfirm);
router.post('/delete/:id', categoryController.delete);

module.exports = router;