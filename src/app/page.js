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
    _id,
    title,
    "slug": slug.current,
    summary,
    mainImage,
    techStack,
    githubUrl,
    liveUrl
}`;

const latestPostsQuery = groq`*[_type=="post" && defined(slug.current)]
  | order(publishedAt desc)[0..2]{
    _id,
    title,
    "slug": slug.current,
    publishedAt
}`;

function Pill({ children }) {
  return (
    <span className="rounded-full border border-[color:var(--border)] bg-white/60 px-3 py-1 text-xs text-[color:var(--muted)] backdrop-blur-sm">
      {children}
    </span>
  );
}

export default async function Home() {
  const [settings, featuredProjects, latestPosts] = await Promise.all([
    client.fetch(settingsQuery),
    client.fetch(featuredProjectsQuery),
    client.fetch(latestPostsQuery),
  ]);

  const cvLink = settings?.cvFile?.asset?.url || settings?.cvUrl;

  return (
    <main className="mx-auto max-w-6xl px-6 py-8 md:px-10 md:py-12">
      {/* Top nav */}
      <nav className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="font-serif text-xl tracking-tight">
            {settings?.siteTitle || "Amandeep Singh"}
          </div>
          <span className="hidden h-5 w-px bg-[color:var(--border)] md:inline-block" />
          <div className="hidden text-sm text-[color:var(--muted)] md:block">
            Statistical Science • Research • Applied ML
          </div>
        </div>

        <div className="flex gap-5 text-sm text-[color:var(--muted)]">
          <Link className="hover:text-[color:var(--foreground)] hover:underline" href="/projects">
            Projects
          </Link>
          <Link className="hover:text-[color:var(--foreground)] hover:underline" href="/blog">
            Writing
          </Link>
          <Link className="hover:text-[color:var(--foreground)] hover:underline" href="/cv">
            CV
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mt-10 grid gap-10 md:grid-cols-[200px_1fr] items-start">
        <div className="space-y-4">
          {settings?.portrait ? (
            <Image
              src={urlFor(settings.portrait).width(420).height(420).fit("crop").url()}
              alt={settings.portrait?.alt || "Portrait"}
              width={200}
              height={200}
              className="rounded-3xl border border-[color:var(--border)]"
              priority
            />
          ) : (
            <div className="flex h-[200px] w-[200px] items-center justify-center rounded-3xl border border-[color:var(--border)] bg-white/50 text-sm text-[color:var(--muted)]">
              Add portrait in Studio
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Pill>Ph.D. Student</Pill>
            <Pill>Statistics</Pill>
            <Pill>Bayesian Methods</Pill>
          </div>
        </div>

        <div>
          <h1 className="font-serif text-4xl leading-[1.08] tracking-tight md:text-5xl">
            {settings?.heroHeadline || "Statistical Science • Bayesian Methods • Scalable Modeling Systems"}
          </h1>

          {settings?.heroSubtext ? (
            <p className="mt-5 max-w-2xl text-base text-[color:var(--muted)] leading-relaxed">
              {settings.heroSubtext}
            </p>
          ) : null}

          <div className="mt-7 flex flex-wrap gap-3">
            {cvLink ? (
              <a
                className="rounded-full border border-[color:var(--border)] bg-white/70 px-5 py-2 text-sm font-medium text-[color:var(--foreground)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-[0_16px_50px_rgba(11,18,32,0.10)]"
                href={cvLink}
                target="_blank"
                rel="noreferrer"
              >
                View CV
              </a>
            ) : (
              <Link
                className="rounded-full border border-[color:var(--border)] bg-white/70 px-5 py-2 text-sm font-medium text-[color:var(--foreground)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-[0_16px_50px_rgba(11,18,32,0.10)]"
                href="/cv"
              >
                View CV
              </Link>
            )}

            {settings?.contact?.githubUrl ? (
              <a
                className="rounded-full border border-[color:var(--border)] px-5 py-2 text-sm text-[color:var(--muted)] transition hover:text-[color:var(--foreground)] hover:bg-white/40"
                href={settings.contact.githubUrl}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            ) : null}

            {settings?.contact?.linkedinUrl ? (
              <a
                className="rounded-full border border-[color:var(--border)] px-5 py-2 text-sm text-[color:var(--muted)] transition hover:text-[color:var(--foreground)] hover:bg-white/40"
                href={settings.contact.linkedinUrl}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            ) : null}

            {settings?.contact?.email ? (
              <a
                className="rounded-full border border-[color:var(--border)] px-5 py-2 text-sm text-[color:var(--muted)] transition hover:text-[color:var(--foreground)] hover:bg-white/40"
                href={`mailto:${settings.contact.email}`}
              >
                Email
              </a>
            ) : null}
          </div>

          {settings?.summary ? (
            <div className="mt-10">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-serif text-2xl tracking-tight">Summary</h2>
                <div className="h-px flex-1 bg-[color:var(--border)]" />
              </div>
              <p className="mt-3 max-w-3xl text-[color:var(--muted)] leading-relaxed">
                {settings.summary}
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="mt-14">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-serif text-2xl tracking-tight">Featured Projects</h2>
          <Link className="text-sm text-[color:var(--muted)] hover:text-[color:var(--foreground)] hover:underline" href="/projects">
            View all
          </Link>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {(featuredProjects ?? []).map((p) => {
            // ✅ Direct-to-published-site behavior
            const externalHref = p.liveUrl || p.githubUrl;
            const internalHref = `/projects/${p.slug}`;
            const href = externalHref || internalHref;
            const isExternal = Boolean(externalHref);

            const CardInner = (
              <div className="rounded-3xl border border-[color:var(--border)] bg-white/60 p-5 backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-[0_18px_60px_rgba(11,18,32,0.10)]">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-serif text-xl tracking-tight">{p.title}</h3>
                  <Pill>Featured</Pill>
                </div>

                {p.summary ? (
                  <p className="mt-2 text-sm text-[color:var(--muted)] leading-relaxed">
                    {p.summary}
                  </p>
                ) : null}

                {p.techStack?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.techStack.slice(0, 5).map((t) => (
                      <Pill key={t}>{t}</Pill>
                    ))}
                  </div>
                ) : null}
              </div>
            );

            return isExternal ? (
              <a key={p._id} href={href} target="_blank" rel="noreferrer" aria-label={`Open ${p.title}`}>
                {CardInner}
              </a>
            ) : (
              <Link key={p._id} href={href} aria-label={`Open ${p.title}`}>
                {CardInner}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Latest posts */}
      <section className="mt-14">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-serif text-2xl tracking-tight">Latest Writing</h2>
          <Link className="text-sm text-[color:var(--muted)] hover:text-[color:var(--foreground)] hover:underline" href="/blog">
            View all
          </Link>
        </div>

        <ul className="mt-5 space-y-3">
          {(latestPosts ?? []).map((p) => (
            <li key={p._id} className="rounded-2xl border border-[color:var(--border)] bg-white/50 px-4 py-3 backdrop-blur-sm transition hover:bg-white/60">
              <Link className="font-medium hover:underline" href={`/blog/${p.slug}`}>
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Resume preview */}
      <section className="mt-14 grid gap-10 md:grid-cols-2">
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-serif text-2xl tracking-tight">Experience</h2>
            <div className="h-px flex-1 bg-[color:var(--border)]" />
          </div>

          <ul className="mt-5 space-y-4">
            {(settings?.experience || []).slice(0, 3).map((e, idx) => (
              <li
                key={idx}
                className="rounded-3xl border border-[color:var(--border)] bg-white/60 p-5 backdrop-blur-sm"
              >
                <div className="font-medium">
                  {e.title} — {e.company}
                </div>

                <div className="mt-1 text-sm text-[color:var(--muted)]">
                  {e.location ? `${e.location} • ` : ""}
                  {e.start || ""}
                  {e.end ? ` → ${e.end}` : e.current ? " → Present" : ""}
                </div>

                {e.highlights?.length ? (
                  <ul className="mt-3 list-disc pl-5 text-sm text-[color:var(--muted)] leading-relaxed">
                    {e.highlights.slice(0, 3).map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-serif text-2xl tracking-tight">Skills</h2>
            <div className="h-px flex-1 bg-[color:var(--border)]" />
          </div>

          <div className="mt-5 rounded-3xl border border-[color:var(--border)] bg-white/60 p-5 text-sm text-[color:var(--muted)] backdrop-blur-sm">
            {settings?.skills?.programming?.length ? (
              <p>
                <span className="font-medium text-[color:var(--foreground)]">Programming:</span>{" "}
                {settings.skills.programming.join(", ")}
              </p>
            ) : null}

            {settings?.skills?.mlData?.length ? (
              <p className="mt-3">
                <span className="font-medium text-[color:var(--foreground)]">ML / Data:</span>{" "}
                {settings.skills.mlData.join(", ")}
              </p>
            ) : null}

            {settings?.skills?.tools?.length ? (
              <p className="mt-3">
                <span className="font-medium text-[color:var(--foreground)]">Tools:</span>{" "}
                {settings.skills.tools.join(", ")}
              </p>
            ) : null}

            {settings?.skills?.actuarial?.length ? (
              <p className="mt-3">
                <span className="font-medium text-[color:var(--foreground)]">Actuarial / Finance:</span>{" "}
                {settings.skills.actuarial.join(", ")}
              </p>
            ) : null}
          </div>

          {settings?.about ? (
            <div className="mt-10">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-serif text-2xl tracking-tight">About</h2>
                <div className="h-px flex-1 bg-[color:var(--border)]" />
              </div>

              <div className="mt-4 rounded-3xl border border-[color:var(--border)] bg-white/60 p-5 text-[color:var(--muted)] backdrop-blur-sm">
                <PortableText value={settings.about} />
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 border-t border-[color:var(--border)] pt-8 text-sm text-[color:var(--muted)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            © {new Date().getFullYear()} {settings?.siteTitle || "Amandeep Singh"}
          </div>
          <div className="flex gap-4">
            <Link className="hover:text-[color:var(--foreground)] hover:underline" href="/projects">
              Projects
            </Link>
            <Link className="hover:text-[color:var(--foreground)] hover:underline" href="/blog">
              Writing
            </Link>
            <Link className="hover:text-[color:var(--foreground)] hover:underline" href="/cv">
              CV
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
