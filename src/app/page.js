import Image from "next/image";
import Link from "next/link";
import groq from "groq";
import { PortableText } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 60;

const settingsQuery = groq`*[_type=="siteSettings"][0]{
  siteTitle,
  heroHeadline,
  heroSubtext,
  portrait,
  summary,
  about,
  contact,
  cvUrl,
  cvFile{asset->{url}},
  education,
  experience,
  publications,
  awards,
  memberships,
  skills
}`;

const featuredProjectsQuery = groq`*[_type=="project" && featured==true && defined(slug.current)]
  | order(publishedAt desc, _createdAt desc)[0..3]{
    _id, title, "slug": slug.current, summary, mainImage, techStack
}`;

const latestPostsQuery = groq`*[_type=="post" && defined(slug.current)]
  | order(publishedAt desc)[0..2]{
    _id, title, "slug": slug.current, publishedAt
}`;

export default async function Home() {
  const [settings, featuredProjects, latestPosts] = await Promise.all([
    client.fetch(settingsQuery),
    client.fetch(featuredProjectsQuery),
    client.fetch(latestPostsQuery),
  ]);

  const cvLink = settings?.cvFile?.asset?.url || settings?.cvUrl;

  return (
    <main className="max-w-5xl mx-auto p-6">
      {/* Top nav */}
      <nav className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-lg font-semibold">{settings?.siteTitle || "Amandeep Singh"}</div>
        <div className="flex gap-4 text-sm">
          <Link className="underline" href="/projects">Projects</Link>
          <Link className="underline" href="/blog">Blog</Link>
          <Link className="underline" href="/cv">CV</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mt-10 grid gap-8 md:grid-cols-[180px_1fr] items-start">
        <div>
          {settings?.portrait ? (
            <Image
              src={urlFor(settings.portrait).width(360).height(360).fit("crop").url()}
              alt={settings.portrait?.alt || "Portrait"}
              width={180}
              height={180}
              className="rounded-2xl"
            />
          ) : (
            <div className="h-[180px] w-[180px] rounded-2xl border flex items-center justify-center text-sm opacity-60">
              Add portrait in Studio
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-semibold leading-tight">
            {settings?.heroHeadline || "Data Scientist | Actuarial Analyst | Statistician"}
          </h1>

          {settings?.heroSubtext ? (
            <p className="mt-4 text-base opacity-80">{settings.heroSubtext}</p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            {cvLink ? (
              <a className="rounded-full border px-4 py-2 text-sm underline" href={cvLink} target="_blank" rel="noreferrer">
                View CV
              </a>
            ) : (
              <Link className="rounded-full border px-4 py-2 text-sm underline" href="/cv">
                CV
              </Link>
            )}

            {settings?.contact?.githubUrl ? (
              <a className="rounded-full border px-4 py-2 text-sm underline" href={settings.contact.githubUrl} target="_blank" rel="noreferrer">
                GitHub
              </a>
            ) : null}

            {settings?.contact?.linkedinUrl ? (
              <a className="rounded-full border px-4 py-2 text-sm underline" href={settings.contact.linkedinUrl} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            ) : null}

            {settings?.contact?.email ? (
              <a className="rounded-full border px-4 py-2 text-sm underline" href={`mailto:${settings.contact.email}`}>
                Email
              </a>
            ) : null}
          </div>

          {settings?.summary ? (
            <div className="mt-8">
              <h2 className="text-lg font-semibold">Summary</h2>
              <p className="mt-2 opacity-80">{settings.summary}</p>
            </div>
          ) : null}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="mt-12">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">Featured Projects</h2>
          <Link className="text-sm underline" href="/projects">View all</Link>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {featuredProjects?.map((p) => (
            <div key={p._id} className="rounded-2xl border p-4">
              <Link className="text-base font-semibold underline" href={`/projects/${p.slug}`}>
                {p.title}
              </Link>
              {p.summary ? <p className="mt-2 text-sm opacity-80">{p.summary}</p> : null}
              {p.techStack?.length ? (
                <p className="mt-3 text-xs opacity-70">Tech: {p.techStack.join(", ")}</p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {/* Latest posts */}
      <section className="mt-12">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">Latest Writing</h2>
          <Link className="text-sm underline" href="/blog">View all</Link>
        </div>

        <ul className="mt-4 space-y-2">
          {latestPosts?.map((p) => (
            <li key={p._id}>
              <Link className="underline" href={`/blog/${p.slug}`}>{p.title}</Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Resume preview */}
      <section className="mt-12 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold">Experience</h2>
          <ul className="mt-4 space-y-4">
            {(settings?.experience || []).slice(0, 3).map((e, idx) => (
              <li key={idx} className="rounded-2xl border p-4">
                <div className="font-semibold">{e.title} — {e.company}</div>
                <div className="text-sm opacity-70">
                  {e.location ? `${e.location} • ` : ""}{e.start || ""}{e.end ? ` → ${e.end}` : e.current ? " → Present" : ""}
                </div>
                {e.highlights?.length ? (
                  <ul className="mt-2 list-disc pl-5 text-sm opacity-80">
                    {e.highlights.slice(0, 3).map((h, i) => <li key={i}>{h}</li>)}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Skills</h2>
          <div className="mt-4 rounded-2xl border p-4 text-sm">
            {settings?.skills?.programming?.length ? (
              <p><span className="font-semibold">Programming:</span> {settings.skills.programming.join(", ")}</p>
            ) : null}
            {settings?.skills?.mlData?.length ? (
              <p className="mt-2"><span className="font-semibold">ML / Data:</span> {settings.skills.mlData.join(", ")}</p>
            ) : null}
            {settings?.skills?.tools?.length ? (
              <p className="mt-2"><span className="font-semibold">Tools:</span> {settings.skills.tools.join(", ")}</p>
            ) : null}
            {settings?.skills?.actuarial?.length ? (
              <p className="mt-2"><span className="font-semibold">Actuarial / Finance:</span> {settings.skills.actuarial.join(", ")}</p>
            ) : null}
          </div>

          {settings?.about ? (
            <div className="mt-8">
              <h2 className="text-xl font-semibold">About</h2>
              <div className="mt-3">
                <PortableText value={settings.about} />
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
