import dotenv from 'dotenv'
dotenv.config({ path: '.env' }) //experimental
import express from 'express'
import mongoose from 'mongoose'
import connectDB from './db.js'
import cors from 'cors'
import { namesOfAllah } from './names.model.js'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const app = express()
app.use(cors())
app.use(
  express.json({
    limit: '2mb',
  })
)

const PORT = process.env.PORT || 8000

//db connection
connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`⚙️ Server running on port: ${process.env.PORT}`)
    })
  })
  .catch((error) => {
    console.log('DB Connection ERROR', error)
  })

app.get('/', (req, res) => {
  res.send('Beautiful Names of Allah(SWT) API Endpoint')
})

//add names
/**
 * @swagger
 * /add-name:
 *   post:
 *     summary: Add a new name of Allah
 *     description: Add a new name of Allah to the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number:
 *                 type: integer
 *               arabicName:
 *                 type: string
 *               transliteration:
 *                 type: string
 *               translation:
 *                 type: string
 *               briefMeaning:
 *                 type: string
 *     responses:
 *       200:
 *         description: Name added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       400:
 *         description: Name already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Error while adding name
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
app.post('/add-name', async (req, res) => {
  const { number, arabicName, transliteration, translation, briefMeaning } =
    req.body

  // Check if the name already exists
  await namesOfAllah
    .findOne({ $or: [{ number }, { arabicName }, { transliteration }] })
    .then((existingName) => {
      if (existingName) {
        return res.status(400).json({ error: 'Name already exists' })
      }
    })

  const newName = new namesOfAllah({
    number,
    arabicName,
    transliteration,
    translation,
    briefMeaning,
  })
  newName
    .save()
    .then(() => {
      res.status(200).json({
        message: `Allah's ${transliteration} name added`,
      })
    })
    .catch((error) => {
      res.status(500).json({
        error: `Error while adding ${transliteration} name`,
      })
    })
})

//fetch all name of allah swt

/**
 * @swagger
 * /names-of-allah:
 *   get:
 *     summary: Retrieve a list of all 99 names of Allah SWT
 *     description: Fetches all the names of Allah (SWT)
 *     responses:
 *       200:
 *         description: A list of names of Allah
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
app.get('/names-of-allah', async (req, res) => {
  await namesOfAllah
    .find()
    .then((names) => {
      res.status(200).json(names)
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error fetching Allah(SWT) names' })
    })
})

//get single name detail
/**
 * @swagger
 * /name/{number}:
 *   get:
 *     summary: Retrieve a single name of Allah SWT
 *     description: Fetches single name of Allah (SWT)
 *     parameters:
 *      - in: path
 *        name: number
 *        required: true
 *        description: The number of name
 *        schema:
 *          type: integer
 *     responses:
 *       200:
 *         description: Single name of Allah
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
app.get('/name/:number', (req, res) => {
  const { number } = req.params

  namesOfAllah
    .findOne({ number })
    .then((name) => {
      if (!name) {
        return res.status(404).json({ error: 'Name not found' })
      }
      res.status(200).json(name)
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error fetching Allah(SWT) name' })
    })
})

//search names
/**
 * @swagger
 * /search/{keyword}:
 *   get:
 *     summary: Search names of Allah
 *     description: Search names of Allah by keyword
 *     parameters:
 *       - in: path
 *         name: keyword
 *         required: true
 *         description: The keyword to search for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Names found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *       404:
 *         description: No names found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Error searching names
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
app.get('/search/:keyword', (req, res) => {
  const { keyword } = req.params

  namesOfAllah
    .find({
      $or: [
        { arabicName: { $regex: keyword, $options: 'i' } },
        { transliteration: { $regex: keyword, $options: 'i' } },
      ],
    })
    .then((names) => {
      if (names == '') {
        return res.status(404).json({
          error: 'Not found any names',
        })
      }
      res.status(200).json(names)
    })
    .catch((error) => {
      res.status(500).json({ error: `Error searching Allah's names` })
    })
})

//update name details
/**
 * @swagger
 * /update-name/{number}:
 *   put:
 *     summary: Update a name of Allah
 *     description: Update a name of Allah in the database
 *     parameters:
 *       - in: path
 *         name: number
 *         required: true
 *         description: The number of the name
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               briefMeaning:
 *                 type: string
 *     responses:
 *       200:
 *         description: Allah's name updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updatedName:
 *
 *       404:
 *         description: Allah's name not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Error updating Allah's name
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
app.put('/update-name/:number', (req, res) => {
  const { number } = req.params
  const { briefMeaning } = req.body

  namesOfAllah
    .findOneAndUpdate({ number }, { briefMeaning }, { new: true })
    .then((updatedName) => {
      if (!updatedName) {
        return res.status(404).json({ error: `Allah's name not found` })
      }
      res.status(200).json(updatedName)
    })
    .catch((error) => {
      res.status(500).json({ error: `Error updating Allah's name` })
    })
})

//delete name
/**
 * @swagger
 * /delete-name/{number}:
 *   delete:
 *     summary: Delete a name of Allah
 *     description: Delete a name of Allah from the database
 *     parameters:
 *       - in: path
 *         name: number
 *         required: true
 *         description: The number of the name
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Allah's name deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       404:
 *         description: Allah name not found
 *         content:
 *           application/json:
 *             schema:
 *                type: string
 *       500:
 *         description: Error deleting Allah's name
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 */
app.delete('/delete-name/:number', (req, res) => {
  const { number } = req.params

  namesOfAllah
    .findOneAndDelete({ number })
    .then((deletedName) => {
      if (!deletedName) {
        return res.status(404).json({ error: 'Allah name not found' })
      }
      res.status(200).json({ message: `Allah's name deleted successfully` })
    })
    .catch((error) => {
      res.status(500).json({ error: `Error deleting Allah's name` })
    })
})

app.get('/health-check', (req, res) => {
  res.status(200).send('Healthy')
})

// swagger configuration
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Allah(SWT) 99 Names API',
      version: '1.0.0',
      description: 'API documentation for Allah(SWT) Beautiful Names',
    },
    servers: [
      {
        url: 'http://localhost:8000',
      },
    ],
  },
  apis: ['./server.js'],
}

const specs = swaggerJsdoc(options)

// serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

export default app
