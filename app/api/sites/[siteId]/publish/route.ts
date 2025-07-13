
import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function POST(
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

    if (!site.content) {
      return new NextResponse("No content to publish", { status: 400 });
    }

    // Create version history before publishing
    await prisma.siteVersion.create({
      data: {
        siteId: site.id,
        content: site.content,
        version:
          (await prisma.siteVersion.count({
            where: { siteId: site.id },
          })) + 1,
      },
    });

    // Clean up old versions (keep only last 5)
    const versions = await prisma.siteVersion.findMany({
      where: { siteId: site.id },
      orderBy: { version: "desc" },
      skip: 5,
    });

    if (versions.length > 0) {
      await prisma.siteVersion.deleteMany({
        where: {
          id: {
            in: versions.map((v) => v.id),
          },
        },
      });
    }

    // Publish the site
    const publishedSite = await prisma.site.update({
      where: {
        id: site.id,
      },
      data: {
        published: true,
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

    return NextResponse.json(publishedSite);
  } catch (error) {
    console.error("Error publishing site:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
