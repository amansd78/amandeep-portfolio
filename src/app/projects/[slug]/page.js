import Link from "next/link";
import Image from "next/image";
import groq from "groq";
import { notFound, redirect } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 60;

const projectQuery = groq`*[_type=="project" && slug.current==$slug][0]{
  title,
  summary,
  mainImage,
  content,
  techStack,
  tags,
  githubUrl,
  liveUrl,
  publishedAt
}`;

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params; // Next 15/16: params can be async
  if (!slug || Array.isArray(slug)) notFound();

  const project = await client.fetch(projectQuery, { slug });
  if (!project) notFound();

  // ✅ DIRECT BEHAVIOR:
  // If a published site URL exists, go there immediately.
  // Otherwise, fall back to GitHub.
  if (project.liveUrl) redirect(project.liveUrl);
  if (project.githubUrl) redirect(project.githubUrl);

  // If neither URL exists, render the detail page as a fallback.
  return (
    <main className="max-w-3xl mx-auto p-6">
      <Link className="text-sm underline" href="/projects">
        ← Back to Projects
      </Link>

      <h1 className="mt-6 text-3xl font-semibold">{project.title}</h1>
      {project.summary ? <p className="mt-3 opacity-80">{project.summary}</p> : null}

      {project.mainImage ? (
        <Image
          className="mt-6 rounded-2xl"
          src={urlFor(project.mainImage).width(1400).height(800).fit("crop").url()}
          alt={project.mainImage?.alt || project.title}
          width={1400}
          height={800}
        />
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        {project.githubUrl ? (
          <a
            className="rounded-full border px-4 py-2 text-sm underline"
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        ) : null}

        {project.liveUrl ? (
          <a
            className="rounded-full border px-4 py-2 text-sm underline"
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
          >
            Published Site
          </a>
        ) : null}
      </div>

      {project.techStack?.length ? (
        <p className="mt-6 text-sm opacity-80">
          <span className="font-semibold">Tech Stack:</span> {project.techStack.join(", ")}
        </p>
      ) : null}

      {project.content ? (
        <div className="mt-8">
          <PortableText value={project.content} />
        </div>
      ) : null}
    </main>
  );
}
