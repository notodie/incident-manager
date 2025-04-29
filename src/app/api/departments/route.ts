import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const departments = await prisma.department.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Vérifier si l'utilisateur est administrateur
  if (session.user.role !== 'ADMIN') {
    return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, description } = body;

    const department = await prisma.department.create({
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(department);
  } catch (error) {
    console.error('Error creating department:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 