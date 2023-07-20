import * as argon2 from 'argon2';
import * as process from 'process';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  const adminPass = await argon2.hash(process.env.ADMIN_PASSWORD);
  const bossPass1 = await argon2.hash(process.env.BOSS1_PASS);
  const bossPass2 = await argon2.hash(process.env.BOSS2_PASS);
  const admin = await prisma.user.findUnique({
    where: {
      email: process.env.ADMIN_EMAIL,
    },
  });
  const boss1 = await prisma.user.findUnique({
    where: {
      email: process.env.BOSS1_EMAIL,
    },
  });
  const boss2 = await prisma.user.findUnique({
    where: {
      email: process.env.BOSS2_EMAIL,
    },
  });
  if (!boss2) {
    await prisma.user.create({
      data: {
        surname: 'BOSS2',
        name: 'BOSS2',
        password: bossPass2,
        email: process.env.BOSS2_EMAIL,
        role: 'Boss',
      },
    });
  }
  if (!boss1) {
    await prisma.user.create({
      data: {
        surname: 'BOSS1',
        name: 'BOSS1',
        password: bossPass1,
        email: process.env.BOSS1_EMAIL,
        role: 'Boss',
      },
    });
  }
  if (!admin) {
    await prisma.user.create({
      data: {
        surname: 'ADMIN',
        name: 'ADMIN',
        password: adminPass,
        email: process.env.ADMIN_EMAIL,
        role: 'Administrator',
      },
    });
  }
}

seed();
