export function ComparisonTable({
  caption,
  headers,
  rows,
}: {
  caption: string;
  headers: [string, string, string] | [string, string];
  rows: string[][];
}) {
  return (
    <div className="mt-10 overflow-x-auto rounded-xl border border-line bg-white">
      <table className="w-full min-w-[680px] border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-navy text-white">
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col" className="px-5 py-4 font-bold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join("|")} className="border-t border-line align-top">
              {row.map((cell, index) =>
                index === 0 && headers.length === 3 ? (
                  <th key={index} scope="row" className="bg-paper p-5 font-bold text-navy">
                    {cell}
                  </th>
                ) : (
                  <td
                    key={index}
                    className={`p-5 leading-7 ${
                      index === row.length - 1
                        ? "bg-greensoft font-bold text-navy"
                        : "text-muted"
                    }`}
                  >
                    {cell}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


export function OfficialSourcesSection({
  brand,
  sources,
}: {
  brand: string;
  sources: Array<[string, string]>;
}) {
  return (
    <section className="bg-surface py-24">
      <div className="container-page">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-navy">
          Official sources
        </p>
        <h2 className="max-w-3xl font-display text-4xl font-semibold text-navy md:text-5xl">
          Check {brand}&apos;s current terms before deciding.
        </h2>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
          This is an independent comparison. {brand} is not affiliated with WorkCV.
          Product names and trademarks belong to their respective owners.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sources.map(([label, href]) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="rounded-xl border border-line bg-white p-5 font-bold text-navy transition hover:-translate-y-1 hover:border-navy"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
