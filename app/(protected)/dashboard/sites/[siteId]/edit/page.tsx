import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { constructMetadata } from "@/lib/utils";
import { SiteEditor } from "@/components/editor/site-editor";

interface SiteEditPageProps {
  params: {
    siteId: string;
  };
}

export const metadata = constructMetadata({
  title: "Edit Site – Vertify",
  description: "Edit your site content.",
});

async function getSite(siteId: string, userId: string) {
  const site = await prisma.site.findFirst({
    where: {
      id: siteId,
      userId: userId,
    },
    include: {
      template: {
        select: {
          name: true,
        },
      },
    },
  });

  return site;
}

export default async function SiteEditPage({ params }: SiteEditPageProps) {
  const user = await getCurrentUser();

  if (!user?.id) {
    redirect("/login");
  }

  const site = await getSite(params.siteId, user.id);

  if (!site) {
    notFound();
  }

  return <SiteEditor site={site} />;
}