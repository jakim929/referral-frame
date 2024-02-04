// very simple
export const sanitizeInput = (input: string): string => {
  // Remove HTML tags and non-alphanumeric characters except basic punctuation
  return input.replace(/<\/?[^>]+(>|$)/g, '').replace(/[^a-zA-Z0-9 ,.!?]/g, '')
}
