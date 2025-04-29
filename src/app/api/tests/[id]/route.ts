import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const test = await prisma.test.findUnique({
      where: {
        id: params.id,
      },
      include: {
        plan: {
          include: {
            department: true,
            steps: {
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
        results: true,
      },
    });

    if (!test) {
      return new NextResponse('Test not found', { status: 404 });
    }

    return NextResponse.json(test);
  } catch (error) {
    console.error('Error fetching test:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    const { status, completedAt } = body;

    const test = await prisma.test.update({
      where: {
        id: params.id,
      },
      data: {
        status,
        ...(completedAt && { completedAt }),
      },
      include: {
        plan: {
          include: {
            department: true,
            steps: {
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
        results: true,
      },
    });

    return NextResponse.json(test);
  } catch (error) {
    console.error('Error updating test:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Vérifier si l'utilisateur est administrateur
  if (session.user.role !== 'ADMIN') {
    return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    // Supprimer d'abord les résultats
    await prisma.testResult.deleteMany({
      where: {
        testId: params.id,
      },
    });

    // Puis supprimer le test
    await prisma.test.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting test:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 