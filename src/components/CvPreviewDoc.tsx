import { CvData } from "@/lib/types";

export default function CvPreviewDoc({ data }: { data: CvData }) {
  const { personal, summary, education, experience, projects, skills } = data;
  const contactParts = [personal.email, personal.phone, personal.location, personal.linkedin].filter(
    Boolean
  );
  const isEmpty =
    !personal.name &&
    !summary &&
    !education.some((e) => e.degree) &&
    !experience.some((e) => e.title) &&
    !projects.some((p) => p.title) &&
    !skills.length;

  return (
    <div className="doc">
      <div className="doc-name">{personal.name || "Your Name"}</div>
      <div className="doc-contact">{contactParts.join("  •  ")}</div>

      {summary && (
        <>
          <div className="doc-section-title">Career Objective</div>
          <div>{summary}</div>
        </>
      )}

      {education.some((e) => e.degree || e.institution) && (
        <>
          <div className="doc-section-title">Education</div>
          {education
            .filter((e) => e.degree || e.institution)
            .map((e, i) => (
              <div className="entry" key={i}>
                <div className="entry-head">
                  <span>{e.degree}</span>
                  <span>
                    {e.start}
                    {e.start || e.end ? " – " : ""}
                    {e.end}
                  </span>
                </div>
                <div className="entry-sub">
                  {e.institution}
                  {e.location ? `, ${e.location}` : ""}
                </div>
                {e.details && <div>{e.details}</div>}
              </div>
            ))}
        </>
      )}

      {experience.some((e) => e.title || e.company) && (
        <>
          <div className="doc-section-title">Experience</div>
          {experience
            .filter((e) => e.title || e.company)
            .map((e, i) => (
              <div className="entry" key={i}>
                <div className="entry-head">
                  <span>{e.title}</span>
                  <span>
                    {e.start}
                    {e.start || e.end ? " – " : ""}
                    {e.end}
                  </span>
                </div>
                <div className="entry-sub">
                  {e.company}
                  {e.location ? `, ${e.location}` : ""}
                </div>
                <ul>
                  {e.bullets.filter((b) => b.trim()).map((b, bi) => (
                    <li key={bi}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
        </>
      )}

      {projects.some((p) => p.title) && (
        <>
          <div className="doc-section-title">Projects</div>
          {projects
            .filter((p) => p.title)
            .map((p, i) => (
              <div className="entry" key={i}>
                <div className="entry-head">
                  <span>
                    {p.title}
                    {p.link ? ` — ${p.link}` : ""}
                  </span>
                </div>
                {p.tech && <div className="entry-sub">{p.tech}</div>}
                <ul>
                  {p.bullets.filter((b) => b.trim()).map((b, bi) => (
                    <li key={bi}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
        </>
      )}

      {skills.length > 0 && (
        <>
          <div className="doc-section-title">Skills</div>
          <div>{skills.join("  •  ")}</div>
        </>
      )}

      {isEmpty && <div className="doc-empty">Add your details to see a live preview here.</div>}
    </div>
  );
}
