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
    const plan = await prisma.businessContinuityPlan.findUnique({
      where: {
        id: params.id,
      },
      include: {
        department: true,
        steps: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!plan) {
      return new NextResponse('Plan not found', { status: 404 });
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error('Error fetching plan:', error);
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
    const { title, description, departmentId, steps } = body;

    // Supprimer les étapes existantes
    await prisma.bCPStep.deleteMany({
      where: {
        planId: params.id,
      },
    });

    // Mettre à jour le plan et créer les nouvelles étapes
    const plan = await prisma.businessContinuityPlan.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        description,
        departmentId,
        steps: {
          create: steps.map((step: { title: string; description: string }, index: number) => ({
            title: step.title,
            description: step.description,
            order: index + 1,
          })),
        },
      },
      include: {
        department: true,
        steps: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return NextResponse.json(plan);
  } catch (error) {
    console.error('Error updating plan:', error);
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
    // Supprimer d'abord les étapes
    await prisma.bCPStep.deleteMany({
      where: {
        planId: params.id,
      },
    });

    // Puis supprimer le plan
    await prisma.businessContinuityPlan.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting plan:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 