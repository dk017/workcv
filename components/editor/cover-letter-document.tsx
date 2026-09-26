import type { CSSProperties, ReactNode } from "react";

import {
  coverLetterFor,
  coverLetterGreeting,
  coverLetterParagraphGuides,
  coverLetterSignOff,
  coverLetterStyle,
  coverLetterSubject,
  formatUkLetterDate,
  recipientBlock,
} from "@/lib/cover-letter-document";
import { getCvNameTypography } from "@/lib/cv-typography";
import type { CvData, TemplateId } from "@/lib/editor-data";

export function CoverLetterDocument({ cv, date }: { cv: CvData; date?: Date }) {
  const letter = coverLetterFor(cv);
  const style = coverLetterStyle(cv);
  const contact = [cv.email, cv.phone, cv.location, cv.linkedin].filter((item) => item.trim());
  const subject = coverLetterSubject(letter);
  const recipient = recipientBlock(letter);
  const paragraphs = letter.paragraphs.length ? letter.paragraphs : ["", "", "", ""];

  return (
    <article
      className={`letter-document mx-auto min-h-[1123px] w-full max-w-[794px] bg-white text-[15px] leading-7 text-ink shadow-soft ring-1 ring-line ${frameClass[style]}`}
      data-letter-template={style}
    >
      <LetterHeader cv={cv} style={style} contact={contact} />
      <div className="letter-body px-16 pb-14 pt-10">
        {letter.includeDate && <p className="letter-date">{formatUkLetterDate(date)}</p>}
        {recipient.length > 0 && (
          <p className="letter-recipient mt-6">
            {recipient.map((item, index) => <span key={`${index}-${item}`} className="block">{item}</span>)}
          </p>
        )}
        {subject && <p className="letter-subject mt-6 font-bold text-navy">{subject}</p>}
        <p className="mt-6">{coverLetterGreeting(letter)}</p>
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="letter-paragraph mt-4 whitespace-pre-line">
            {paragraph.trim() || (
              <Placeholder>{coverLetterParagraphGuides[index]?.example || "Add another paragraph."}</Placeholder>
            )}
          </p>
        ))}
        <p className="mt-6">{coverLetterSignOff(letter)}</p>
        <p className="letter-signature mt-10 font-bold text-navy">
          {cv.fullName.trim() || <Placeholder>Your name</Placeholder>}
        </p>
      </div>
    </article>
  );
}

const frameClass: Record<TemplateId, string> = {
  classic: "border-t-[10px] border-navy",
  modern: "",
  compact: "border-t-[6px] border-line-strong",
};

function LetterHeader({ cv, style, contact }: { cv: CvData; style: TemplateId; contact: string[] }) {
  const typography = getCvNameTypography(cv.fullName || "Your name", style);
  const nameStyle = {
    "--cv-name-preview-size": `${Math.round(typography.previewPx * 0.85)}px`,
    "--cv-name-print-size": `${Math.round(typography.printPt * 0.85)}pt`,
  } as CSSProperties;
  const name = cv.fullName.trim() || <Placeholder>Your name</Placeholder>;
  const contactItems = contact.length
    ? contact.map((item) => <span key={item} className="min-w-0 overflow-wrap-anywhere">{item}</span>)
    : <Placeholder>Add email, phone and location in Profile</Placeholder>;

  if (style === "modern") {
    return (
      <header className="letter-header border-l-[10px] border-gold bg-navy px-16 py-9 text-white">
        <h2 className="letter-name cv-name font-display font-semibold leading-tight" style={nameStyle}>{name}</h2>
        <div className="letter-contact mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gold-tint">{contactItems}</div>
      </header>
    );
  }
  if (style === "compact") {
    return (
      <header className="letter-header mx-16 grid grid-cols-[1fr_auto] gap-6 border-b-2 border-navy pb-5 pt-12">
        <h2 className="letter-name cv-name font-display font-semibold leading-tight text-navy" style={nameStyle}>{name}</h2>
        <div className="letter-contact flex max-w-[280px] flex-col items-end text-right text-xs leading-5 text-muted">{contactItems}</div>
      </header>
    );
  }
  return (
    <header className="letter-header mx-16 border-b-2 border-navy pb-6 pt-12 text-center">
      <h2 className="letter-name cv-name font-display font-semibold leading-tight text-navy" style={nameStyle}>{name}</h2>
      <div className="letter-contact mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-muted">{contactItems}</div>
    </header>
  );
}

function Placeholder({ children }: { children: ReactNode }) {
  return <span className="cv-placeholder italic opacity-50">{children}</span>;
}
