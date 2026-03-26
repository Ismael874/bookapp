const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');

router.get('/', authorController.index);
router.get('/create', authorController.createForm);
router.post('/create', authorController.create);
router.get('/edit/:id', authorController.editForm);
router.post('/edit/:id', authorController.update);
router.get('/delete/:id', authorController.deleteConfirm);
router.post('/delete/:id', authorController.delete);

module.exports = router;