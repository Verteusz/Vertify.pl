import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { prisma } from "@/lib/db";
import { SiteEditor } from "@/components/editor/site-editor";

interface SiteEditorPageProps {
  params: {
    siteId: string;
  };
}

export const metadata = constructMetadata({
  title: "Site Editor – Vertify",
  description: "Edit your site with drag and drop blocks.",
});

export default async function SiteEditorPage({ params }: SiteEditorPageProps) {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  const site = await prisma.site.findFirst({
    where: {
      id: params.siteId,
      userId: user.id,
    },
  });

  if (!site) {
    notFound();
  }

  return <SiteEditor site={site} />;
}
