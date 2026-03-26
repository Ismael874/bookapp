const express = require('express');
const router = express.Router();
const publisherController = require('../controllers/publisherController');

router.get('/', publisherController.index);
router.get('/create', publisherController.createForm);
router.post('/create', publisherController.create);
router.get('/edit/:id', publisherController.editForm);
router.post('/edit/:id', publisherController.update);
router.get('/delete/:id', publisherController.deleteConfirm);
router.post('/delete/:id', publisherController.delete);

module.exports = router;