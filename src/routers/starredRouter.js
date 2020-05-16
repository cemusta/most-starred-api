const express = require('express')
const router = express.Router()

const controller = require('../controllers/starredController')

/**
 * @swagger
 * /api/starred/:
 *   get:
 *     tags:
 *       - starred
 *     description: endpoint for listing most starred repositories
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: list all tokens
 *       500:
 *         description: internal server error
 */
router.get('/', controller.get)

module.exports = router
