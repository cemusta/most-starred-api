const express = require('express')
const router = express.Router()

const controller = require('../controllers/starredController')

/**
 * @swagger
 * /api/starred/:
 *   get:
 *     tags:
 *       - starred
 *     parameters:
 *       - name: date
 *         description: search repositories created after this date
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: '2020-01-01'
 *       - name: language
 *         description: search repositories written in this language (c, pyhton, etc)
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *       - name: limit
 *         description: count of results (10, 50 or 100)
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           enum: [10, 50, 100]
 *           example: 10
 *     description: endpoint for listing most starred repositories
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: list all repositories
 *       403:
 *         description: illegal query parameters
 *       500:
 *         description: internal server error
 */
router.get('/', controller.get)

module.exports = router
