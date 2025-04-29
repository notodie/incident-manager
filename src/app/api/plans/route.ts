import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const departmentId = searchParams.get('departmentId');

  try {
    const plans = await prisma.businessContinuityPlan.findMany({
      where: {
        ...(departmentId && { departmentId }),
      },
      include: {
        department: true,
        steps: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, departmentId, steps } = body;

    const plan = await prisma.businessContinuityPlan.create({
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
    console.error('Error creating plan:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 