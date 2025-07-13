
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { constructMetadata } from "@/lib/utils";
import { Metadata } from "next";

interface PublicSitePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: PublicSitePageProps): Promise<Metadata> {
  const site = await prisma.site.findFirst({
    where: {
      slug: params.slug,
      published: true,
    },
  });

  if (!site) {
    return constructMetadata({
      title: "Site Not Found",
      description: "The requested site could not be found.",
    });
  }

  return constructMetadata({
    title: site.name,
    description: site.description || `Visit ${site.name}`,
  });
}

async function getSite(slug: string) {
  const site = await prisma.site.findFirst({
    where: {
      slug,
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

  return site;
}

function renderSiteContent(content: string | null) {
  if (!content) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-muted-foreground">
          This site is empty
        </h2>
        <p className="text-muted-foreground mt-2">
          The site owner hasn't added any content yet.
        </p>
      </div>
    );
  }

  try {
    const parsedContent = JSON.parse(content);
    const blocks = parsedContent.blocks || parsedContent;
    
    if (!Array.isArray(blocks) || blocks.length === 0) {
      return (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-muted-foreground">
            This site is empty
          </h2>
          <p className="text-muted-foreground mt-2">
            The site owner hasn't added any content yet.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {blocks.map((block: any, index: number) => (
          <div key={block.id || index} className="block">
            {block.type === "header" && (
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight mb-4">
                  {block.content?.title || "Header"}
                </h1>
                {block.content?.subtitle && (
                  <p className="text-xl text-muted-foreground">
                    {block.content.subtitle}
                  </p>
                )}
              </div>
            )}
            
            {block.type === "text" && (
              <div className="prose prose-lg max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: block.content?.html || block.content?.text || "Text content",
                  }}
                />
              </div>
            )}
            
            {block.type === "image" && block.content?.src && (
              <div className="text-center">
                <img
                  src={block.content.src}
                  alt={block.content.alt || "Image"}
                  className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                />
                {block.content.caption && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {block.content.caption}
                  </p>
                )}
              </div>
            )}
            
            {block.type === "cta" && (
              <div className="text-center bg-muted p-8 rounded-lg">
                <h3 className="text-2xl font-semibold mb-4">
                  {block.content?.title || "Call to Action"}
                </h3>
                {block.content?.description && (
                  <p className="text-muted-foreground mb-6">
                    {block.content.description}
                  </p>
                )}
                {block.content?.buttonText && block.content?.buttonUrl && (
                  <a
                    href={block.content.buttonUrl}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    target={block.content.buttonUrl.startsWith("http") ? "_blank" : "_self"}
                    rel={block.content.buttonUrl.startsWith("http") ? "noopener noreferrer" : ""}
                  >
                    {block.content.buttonText}
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error parsing site content:", error);
    
    // Fallback: treat content as plain text
    return (
      <div className="prose prose-lg max-w-none">
        <div className="whitespace-pre-wrap">{content}</div>
      </div>
    );
  }
}

export default async function PublicSitePage({ params }: PublicSitePageProps) {
  const site = await getSite(params.slug);

  if (!site) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Site Header */}
        <header className="mb-12 text-center border-b pb-8">
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            {site.name}
          </h1>
          {site.description && (
            <p className="text-xl text-muted-foreground mb-6">
              {site.description}
            </p>
          )}
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            {site.user.name && (
              <span>Created by {site.user.name}</span>
            )}
            {site.template && (
              <span>• Template: {site.template.name}</span>
            )}
          </div>
        </header>

        {/* Site Content */}
        <div className="site-content">
          {renderSiteContent(site.content)}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            Powered by{" "}
            <a
              href="/"
              className="font-medium hover:text-foreground transition-colors"
            >
              Vertify
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
