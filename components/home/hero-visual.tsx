import Image from "next/image";
import { Mail } from "lucide-react";

// The homepage hero picture: the step editor beside a real CV render. Decorative, so hidden
// from assistive technology; the hero copy carries the message.
export function HeroVisual() {
  return (
    <div aria-hidden="true" className="relative min-w-0 rounded-2xl bg-sand p-4 sm:p-7">
      <div className="overflow-hidden rounded-xl bg-white shadow-[0_30px_80px_rgba(15,41,66,0.18)]">
        <div className="flex h-8 items-center gap-1.5 border-b border-gray-200 bg-gray-100 px-3.5">
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          <span className="ml-3 rounded-md bg-white px-3 py-0.5 text-[11px] text-gray-500">workcv.co.uk/editor</span>
        </div>
        <div className="flex">
          <div className="hidden w-[44%] shrink-0 flex-col gap-2.5 border-r border-line bg-paper p-4 sm:flex">
            <div className="flex gap-0.5 whitespace-nowrap text-[10px] font-bold">
              <span className="rounded-md px-1.5 py-1 text-muted">Contact</span>
              <span className="rounded-md bg-navy px-1.5 py-1 text-white">Experience</span>
              <span className="rounded-md px-1.5 py-1 text-muted">Skills</span>
              <span className="rounded-md px-1.5 py-1 text-muted">Finish</span>
            </div>
            <p className="text-sm font-bold text-navy">What did you do at Yorkshire Energy?</p>
            <div className="rounded-lg border border-line-strong bg-white p-2.5 text-[11px] leading-relaxed text-ink">
              • Handle 45 to 60 phone, email and chat enquiries per shift
              <br />• Resolve complaints at first contact where possible
            </div>
            <div className="flex flex-col gap-2 rounded-xl border border-green-200 bg-greensoft p-2.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-green-800">From the job advert</p>
              <p className="text-xs leading-snug text-ink">
                The advert asks for <strong>CRM reporting</strong>. Is it part of your real experience?
              </p>
              <div className="flex gap-1.5 text-[10px] font-bold">
                <span className="rounded-md bg-navy px-2 py-1 text-white">Yes, add a bullet</span>
                <span className="rounded-md border border-line-strong bg-white px-2 py-1 text-navy">Skip</span>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-2.5 py-2">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[conic-gradient(#2D7D52_0_82%,#E5E2DB_82%_100%)]">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-[9px] font-extrabold text-navy">82%</span>
              </span>
              <span className="text-[11px] leading-snug text-muted">
                <strong className="text-navy">Nearly ready.</strong> One keyword left.
              </span>
            </div>
          </div>
          <div className="flex min-w-0 flex-1 justify-center overflow-hidden bg-[#E9EBEE] px-3 pt-4">
            <div className="h-[300px] w-full max-w-[320px] overflow-hidden bg-white shadow-[0_4px_16px_rgba(15,41,66,0.12)] sm:h-[340px]">
              <Image
                src="/samples/home/customer-service-classic.png"
                alt=""
                width={635}
                height={898}
                priority
                sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 90vw"
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-4 right-3 flex items-center gap-2 rounded-lg bg-navy px-3.5 py-2.5 text-[13px] font-bold text-white shadow-[0_12px_30px_rgba(15,41,66,0.25)]">
        <Mail className="h-4 w-4 text-gold" />
        Matching cover letter included
      </div>
    </div>
  );
}
