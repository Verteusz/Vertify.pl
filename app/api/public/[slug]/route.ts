
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const site = await prisma.site.findFirst({
      where: {
        slug: params.slug,
        published: true,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
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
