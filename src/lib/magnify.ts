/** Коэффициент увеличения иконки Dock по расстоянию от курсора до её центра (косинусный спад, как в macOS). */
export function dockScale(distance: number, max = 1.7, radius = 140): number {
  if (distance >= radius) return 1
  return 1 + (max - 1) * (1 + Math.cos((Math.PI * distance) / radius)) / 2
}
