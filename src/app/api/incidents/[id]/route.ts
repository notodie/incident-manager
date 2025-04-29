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
    const incident = await prisma.incident.findUnique({
      where: {
        id: params.id,
      },
      include: {
        department: true,
        assignedTo: true,
      },
    });

    if (!incident) {
      return new NextResponse('Incident not found', { status: 404 });
    }

    return NextResponse.json(incident);
  } catch (error) {
    console.error('Error fetching incident:', error);
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
    const { status, assignedToId, resolvedAt } = body;

    const incident = await prisma.incident.update({
      where: {
        id: params.id,
      },
      data: {
        ...(status && { status }),
        ...(assignedToId && { assignedToId }),
        ...(resolvedAt && { resolvedAt }),
      },
      include: {
        department: true,
        assignedTo: true,
      },
    });

    return NextResponse.json(incident);
  } catch (error) {
    console.error('Error updating incident:', error);
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
    await prisma.incident.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting incident:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 