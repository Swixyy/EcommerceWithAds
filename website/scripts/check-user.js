#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client')

async function checkUser() {
  const prisma = new PrismaClient()
  
  try {
    const users = await prisma.user.findMany()
    console.log('Users in database:')
    console.log(JSON.stringify(users, null, 2))
    
    if (users.length === 0) {
      console.log('No users found in database')
    } else {
      console.log(`Found ${users.length} user(s)`)
    }
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkUser()
