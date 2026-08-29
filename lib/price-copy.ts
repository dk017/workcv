export function underTenCvBuilderAnswer(priceAmount: number, formattedPrice: string) {
  if (priceAmount < 10) {
    return `Yes. The current one-time WorkCV PDF download price is ${formattedPrice}, which is under £10. You can build and preview first. Email-code login is required, and there is no monthly subscription or automatic renewal.`;
  }
  return `No. The current one-time WorkCV PDF download price is ${formattedPrice}. You can still build and preview first. Email-code login is required, and there is no monthly subscription or automatic renewal.`;
}
