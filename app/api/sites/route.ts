import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";

const createSiteSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  templateId: z.string().optional(),
});

// Slugify helper
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove non-word chars
    .replace(/\-\-+/g, "-"); // Collapse multiple dashes
}

// Ensure slug is unique in DB
async function generateUniqueSlug(base: string): Promise<string> {
  const baseSlug = generateSlug(base);
  let slug = baseSlug;
  let count = 1;

  while (await prisma.site.findFirst({ where: { slug } })) {
    slug = `${baseSlug}-${count++}`;
  }

  return slug;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, description, templateId } = createSiteSchema.parse(body);

    // Get template content if templateId is provided
    let templateContent = null;
    if (templateId) {
      const template = await prisma.template.findFirst({
        where: { id: templateId },
      });
      templateContent = template?.blocksData ? JSON.stringify(template.blocksData) : null;
    }

    // Generate a unique slug based on the site name
    const slug = await generateUniqueSlug(name);

    const site = await prisma.site.create({
      data: {
        name,
        description,
        templateId: templateId || null,
        content: templateContent,
        userId: user.id,
        slug,
      },
    });

    return NextResponse.json(site);
  } catch (error) {
    console.error("Error creating site:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const sites = await prisma.site.findMany({
      where: {
        userId: user.id,
      },
      include: {
        template: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(sites);
  } catch (error) {
    console.error("Error fetching sites:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
