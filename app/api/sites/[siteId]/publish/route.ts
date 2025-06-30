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

    // Create a new version before publishing
    await prisma.version.create({
      data: {
        siteId: site.id,
        data: JSON.parse(site.content), // site.content must be JSON string
        version: (await prisma.version.count({ where: { siteId: site.id } })) + 1,
        isActive: true,
      },
    });

    // Update site to published
    const updatedSite = await prisma.site.update({
      where: {
        id: site.id,
      },
      data: {
        published: true,
      },
    });

    return NextResponse.json(updatedSite);
  } catch (error) {
    console.error("Error publishing site:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
