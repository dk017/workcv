// Directory listings that link back to WorkCV. Shown on /about rather than in the site footer;
// some listings ask for their badge to stay visible on the site.
export function DirectoryBadges() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <a
        href="https://dang.ai"
        target="_blank"
        rel="dofollow noopener"
        className="inline-block no-underline"
        aria-label="Verified on DANG"
      >
        <img
          src="https://assets.dang.ai/badges/dang-verified-dark.png"
          alt="Verified on DANG!"
          width={260}
          height={94}
          className="block h-auto max-w-full border-0"
        />
      </a>
      <a
        href="https://www.scrolllaunch.com/products/workcv?ref=badge"
        target="_blank"
        rel="noopener"
        className="inline-block"
        aria-label="WorkCV featured on ScrollLaunch"
      >
        <img
          src="https://www.scrolllaunch.com/api/badge/workcv?variant=launched&theme=light"
          alt="WorkCV - Featured on ScrollLaunch"
          className="block h-auto max-w-full border-0"
        />
      </a>
      <a
        href="https://mediapronet.com/?utm_source=workcv.co.uk&utm_medium=badge"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block"
        aria-label="WorkCV promoted on MEDIAPRONET"
      >
        <img
          src="https://mediapronet.com/api/badge?style=classic"
          alt="Promoted on MEDIAPRONET"
          height={54}
          className="block h-[54px] w-auto max-w-full border-0"
        />
      </a>
      <a
        href="https://sitepatent.com/?utm_source=workcv.co.uk&utm_medium=badge"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block"
        aria-label="WorkCV promoted on SitePatent"
      >
        <img
          src="https://sitepatent.com/api/badge?style=classic"
          alt="Promoted on SitePatent"
          height={54}
          className="block h-[54px] w-auto max-w-full border-0"
        />
      </a>
      <a
        href="https://codetrendy.com/?utm_source=workcv.co.uk&utm_medium=badge"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block"
        aria-label="WorkCV promoted on CodeTrendy"
      >
        <img
          src="https://codetrendy.com/api/badge?style=classic"
          alt="Promoted on CodeTrendy"
          height={54}
          className="block h-[54px] w-auto max-w-full border-0"
        />
      </a>
      <a
        href="https://marketingdb.live"
        target="_blank"
        rel="noopener noreferrer nofollow sponsored"
        className="inline-block"
        aria-label="WorkCV listed on MarketingDB"
      >
        <img
          src="https://marketingdb.live/badge.svg"
          alt="Listed on MarketingDB"
          width={190}
          height={44}
          className="block h-11 w-auto max-w-full border-0"
        />
      </a>
      <a
        href="https://www.aidirectori.es"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block"
        aria-label="WorkCV listed on AI Directories"
      >
        <img
          src="https://cdn.aidirectori.es/ai-tools/badges/dark-mode.png"
          alt="AI Directories Badge"
          width={208}
          height={44}
          className="block h-11 w-auto max-w-[208px] border-0"
        />
      </a>
      <a
        href="https://findly.tools/workcv?utm_source=workcv"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block"
        aria-label="WorkCV featured on Findly.tools"
      >
        <img
          src="https://findly.tools/badges/findly-tools-badge-dark.svg"
          alt="Featured on Findly.tools"
          width={175}
          height={55}
          className="block h-[55px] w-auto max-w-full border-0"
        />
      </a>
      <a
        href="https://listmysaas.xyz"
        target="_blank"
        rel="noopener"
        className="inline-block"
        aria-label="WorkCV featured on ListMySaaS"
      >
        <img
          src="https://listmysaas.xyz/listmysaasbadgenormal.svg"
          alt="Featured on ListMySaaS"
          width={125}
          height={44}
          loading="lazy"
          decoding="async"
          className="block h-11 w-auto max-w-full border-0"
        />
      </a>
      <a
        href="https://codehype.ai/product/workcv?utm_source=codehype_badge"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block"
        aria-label="WorkCV featured on CodeHype"
      >
        <img
          src="https://codehype.ai/badges/workcv.svg?variant=find-us&v=20"
          alt="Featured on CodeHype"
          width={180}
          height={65}
          loading="lazy"
          decoding="async"
          className="block h-auto max-h-[65px] w-[180px] max-w-full border-0"
        />
      </a>
    </div>
  );
}
