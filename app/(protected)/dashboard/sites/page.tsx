import { redirect } from "next/navigation";
import { Plus } from "lucide-react";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { prisma } from "@/lib/db";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { SiteCard } from "@/components/dashboard/site-card";
import { CreateSiteModal } from "@/components/modals/create-site-modal";

export const metadata = constructMetadata({
  title: "Sites – Vertify",
  description: "Manage your sites.",
});

export default async function SitesPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

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

  return (
    <>
      <DashboardHeader heading="Sites" text="Create and manage your sites.">
        <CreateSiteModal>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Site
          </Button>
        </CreateSiteModal>
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sites.map((site) => (
          <SiteCard key={site.id} site={site} />
        ))}

        {sites.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground mb-4">No sites yet. Create your first site!</p>
            <CreateSiteModal>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create New Site
              </Button>
            </CreateSiteModal>
          </div>
        )}
      </div>
    </>
  );
}
