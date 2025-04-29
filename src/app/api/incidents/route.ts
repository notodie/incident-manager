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
  const type = searchParams.get('type');
  const severity = searchParams.get('severity');
  const status = searchParams.get('status');
  const departmentId = searchParams.get('departmentId');

  try {
    const incidents = await prisma.incident.findMany({
      where: {
        ...(type && { type }),
        ...(severity && { severity }),
        ...(status && { status }),
        ...(departmentId && { departmentId }),
      },
      include: {
        department: true,
        assignedTo: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(incidents);
  } catch (error) {
    console.error('Error fetching incidents:', error);
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
    const { title, description, type, severity, departmentId } = body;

    const incident = await prisma.incident.create({
      data: {
        title,
        description,
        type,
        severity,
        departmentId,
        status: 'OPEN',
      },
      include: {
        department: true,
      },
    });

    return NextResponse.json(incident);
  } catch (error) {
    console.error('Error creating incident:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 