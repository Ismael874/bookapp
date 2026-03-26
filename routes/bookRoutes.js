const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const upload = require('../middlewares/upload');

router.get('/', bookController.index);
router.get('/create', bookController.createForm);
router.post('/create', upload.single('coverImage'), bookController.create);
router.get('/edit/:id', bookController.editForm);
router.post('/edit/:id', upload.single('coverImage'), bookController.update);
router.get('/delete/:id', bookController.deleteConfirm);
router.post('/delete/:id', bookController.delete);

module.exports = router;