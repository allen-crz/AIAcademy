// scripts/make-admin.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@gmail.com' // Replace with your email

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      throw new Error('User not found')
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        // @ts-ignore
        role: "ADMIN"
      }
    })

    console.log(`Updated ${updated.email} to admin role`)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()