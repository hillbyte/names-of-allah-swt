import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.DB_URI}/names-of-allah?retryWrites=true&w=majority&appName=prodeskcluster`
    )
    console.log(
      `\n DB Connected at host: ", ${connectionInstance.connection.host}`
    )
  } catch (error) {
    console.log('DB Connection ERROR', error)
    process.exit(1)
  }
}

export default connectDB
