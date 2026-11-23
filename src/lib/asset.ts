/** Путь к файлу из public/assets с учётом base (GitHub Pages: /partfolio/). */
export function asset(path: string): string {
  return import.meta.env.BASE_URL + 'assets/' + path
}
