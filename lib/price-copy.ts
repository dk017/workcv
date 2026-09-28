export function underTenCvBuilderAnswer(priceAmount: number, formattedPrice: string) {
  if (priceAmount < 10) {
    return `Yes. WorkCV costs ${formattedPrice} once, which is under £10, for one saved CV and its matching cover letter as PDF and Word. You can build and preview first. Email-code login is required, and there is no monthly subscription or automatic renewal.`;
  }
  return `No. WorkCV costs ${formattedPrice} once for one saved CV and its matching cover letter as PDF and Word. You can still build and preview first. Email-code login is required, and there is no monthly subscription or automatic renewal.`;
}
