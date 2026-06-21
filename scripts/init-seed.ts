import { connectDB } from '@/lib/db'
import Admin from '@/models/Admin'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { z } from 'zod'

const adminSeedSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  nip: z.string().min(5),
  name: z.string().min(3),
})

async function seed() {
  try {
    await connectDB()

    const envData = adminSeedSchema.parse({
      email: process.env.SEED_ADMIN_EMAIL,
      password: process.env.SEED_ADMIN_PASSWORD,
      nip: process.env.SEED_ADMIN_NIP || "ADMIN001",
      name: process.env.SEED_ADMIN_NAME || "Administrator ULT",
    })

    const existing = await Admin.findOne({ email: envData.email }).lean()
    if (existing) {
      console.log('--- Seed: Admin already exists. Skipping.')
      return;
    }

    const hashedPassword = await bcrypt.hash(envData.password, 12)
    
    await Admin.create({ 
      email: envData.email, 
      password: hashedPassword,
      nip: envData.nip,
      name: envData.name,
      loket: "ULT Pusat"
    })

    console.log('+++ Seed: Admin user created successfully.')
  } catch (err) {
    console.error('--- Seed Error:', err)
    process.exit(1)
  } finally {
    await mongoose.connection.close()
    process.exit(0)
  }
}

seed()