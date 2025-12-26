import Link from "next/link";
import Image from "next/image";
import groq from "groq";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 60;

const projectsQuery = groq`*[_type=="project" && defined(slug.current)]
| order(publishedAt desc, _createdAt desc) {
  _id,
  title,
  summary,
  "slug": slug.current,
  mainImage,
  techStack,
  featured
}`;

export default async function ProjectsPage() {
  const projects = await client.fetch(projectsQuery);

  return (
    <main className="max-w-5xl mx-auto p-6">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Link className="text-sm underline" href="/">Home</Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {projects?.map((p) => (
          <article key={p._id} className="rounded-2xl border p-4">
            <Link className="text-lg font-semibold underline" href={`/projects/${p.slug}`}>
              {p.title}
            </Link>

            {p.mainImage ? (
              <Image
                className="mt-3 rounded-xl"
                src={urlFor(p.mainImage).width(1200).height(700).fit("crop").url()}
                alt={p.mainImage?.alt || p.title}
                width={1200}
                height={700}
              />
            ) : null}

            {p.summary ? <p className="mt-3 text-sm opacity-80">{p.summary}</p> : null}

            {p.techStack?.length ? (
              <p className="mt-3 text-xs opacity-70">Tech: {p.techStack.join(", ")}</p>
            ) : null}
          </article>
        ))}
      </div>
    </main>
  );
}
