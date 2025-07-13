
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";

const updateSiteSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  settings: z.record(z.any()).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { siteId: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const site = await prisma.site.findFirst({
      where: {
        id: params.siteId,
        userId: user.id,
      },
      include: {
        template: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!site) {
      return new NextResponse("Site not found", { status: 404 });
    }

    return NextResponse.json(site);
  } catch (error) {
    console.error("Error fetching site:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { siteId: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const site = await prisma.site.findFirst({
      where: {
        id: params.siteId,
        userId: user.id,
      },
    });

    if (!site) {
      return new NextResponse("Site not found", { status: 404 });
    }

    const body = await req.json();
    const validatedData = updateSiteSchema.parse(body);

    const updatedSite = await prisma.site.update({
      where: {
        id: site.id,
      },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
      include: {
        template: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(updatedSite);
  } catch (error) {
    console.error("Error updating site:", error);
    
    if (error instanceof z.ZodError) {
      return new NextResponse(
        JSON.stringify({ error: "Validation error", details: error.errors }),
        { status: 400 }
      );
    }
    
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { siteId: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const site = await prisma.site.findFirst({
      where: {
        id: params.siteId,
        userId: user.id,
      },
    });

    if (!site) {
      return new NextResponse("Site not found", { status: 404 });
    }

    await prisma.site.delete({
      where: {
        id: site.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting site:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
