import mongoose from 'mongoose'

const namesSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
    },
    arabicName: {
      type: String,
      required: true,
    },
    transliteration: {
      type: String,
      required: true,
      index: true,
    },
    translation: {
      type: String,
      required: true,
      index: true,
    },
    briefMeaning: {
      type: String,
      //   required: true,
    },
  },
  { timestamps: true }
)

export const namesOfAllah = mongoose.model('namesofallah', namesSchema)
