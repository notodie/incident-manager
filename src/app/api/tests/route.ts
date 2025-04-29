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
  const status = searchParams.get('status');

  try {
    const tests = await prisma.test.findMany({
      where: {
        ...(departmentId && {
          plan: {
            departmentId,
          },
        }),
        ...(status && { status }),
      },
      include: {
        plan: {
          include: {
            department: true,
          },
        },
        results: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(tests);
  } catch (error) {
    console.error('Error fetching tests:', error);
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
    const { title, description, planId } = body;

    const plan = await prisma.businessContinuityPlan.findUnique({
      where: { id: planId },
      include: { steps: true },
    });

    if (!plan) {
      return new NextResponse('Plan not found', { status: 404 });
    }

    const test = await prisma.test.create({
      data: {
        title,
        description,
        planId,
        status: 'PENDING',
        results: {
          create: plan.steps.map((step) => ({
            stepId: step.id,
            status: 'PENDING',
            notes: '',
          })),
        },
      },
      include: {
        plan: {
          include: {
            department: true,
          },
        },
        results: true,
      },
    });

    return NextResponse.json(test);
  } catch (error) {
    console.error('Error creating test:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 