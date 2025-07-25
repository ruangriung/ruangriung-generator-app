// ruangriung/ruangriung-generator-app/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Pola ini direkomendasikan oleh dokumentasi Next.js dan Prisma
// untuk menghindari instansiasi PrismaClient yang berulang
// yang dapat menyebabkan terlalu banyak koneksi database di lingkungan pengembangan.
const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  // eslint-disable-next-line no-var
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma || prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;