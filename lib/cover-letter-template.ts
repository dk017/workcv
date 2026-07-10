export function coverLetterTemplateText(managerKnown: boolean) {
  const greeting = managerKnown ? "Dear [Hiring manager name]," : "Dear Sir or Madam,";
  const signOff = managerKnown ? "Yours sincerely," : "Yours faithfully,";
  return `[Your name]
[Town or city] · [Phone] · [Email]

[Date]

[Hiring manager name, if known]
[Employer name]
[Employer address, if required]

Re: [Exact job title and reference number, if provided]

${greeting}

I am applying for the [exact job title] position at [employer name], advertised on [source]. [Give one genuine, specific reason this role and organisation interest you.]

[Choose your strongest relevant example. Explain the situation or task, the action you personally took and the result. Connect this evidence to an important requirement in the vacancy.]

[Add a second, different example covering another priority skill or requirement. Use facts from your CV and include a measured result only when you can verify it.]

[Close by summarising the relevant value you would bring, confirming your interest and inviting further discussion.]

${signOff}

[Your name]`;
}
