import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; resultId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    const { status, notes } = body;

    // Mettre à jour le résultat
    await prisma.testResult.update({
      where: {
        id: params.resultId,
      },
      data: {
        status,
        notes,
      },
    });

    // Récupérer le test mis à jour
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

    // Vérifier si tous les résultats sont terminés
    const allResultsCompleted = test.results.every(
      (result) => result.status === 'SUCCESS' || result.status === 'FAILURE'
    );

    // Vérifier si tous les résultats sont réussis
    const allResultsSuccessful = test.results.every(
      (result) => result.status === 'SUCCESS'
    );

    // Mettre à jour le statut du test si nécessaire
    if (allResultsCompleted) {
      await prisma.test.update({
        where: {
          id: params.id,
        },
        data: {
          status: allResultsSuccessful ? 'COMPLETED' : 'FAILED',
          completedAt: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json(test);
  } catch (error) {
    console.error('Error updating test result:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 