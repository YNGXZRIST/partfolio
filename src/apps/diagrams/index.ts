export interface DNode { id: string; x: number; y: number; w: number; h: number; label: string; sub?: string; accent?: boolean }
export interface DEdge { from: string; to: string; label?: string; both?: boolean }
export interface Diagram { w: number; h: number; nodes: DNode[]; edges: DEdge[] }

const H = 52
const diagrams: Record<string, Diagram> = {
  gophprofile: {
    w: 760, h: 250,
    nodes: [
      { id: 'client', x: 16, y: 30, w: 130, h: H, label: 'Клиент', sub: 'POST /avatars' },
      { id: 'server', x: 200, y: 30, w: 130, h: H, label: 'server', sub: 'net/http', accent: true },
      { id: 'pg', x: 400, y: 30, w: 150, h: H, label: 'PostgreSQL', sub: 'avatars + outbox' },
      { id: 'consumer', x: 610, y: 30, w: 134, h: H, label: 'consumer', sub: 'миниатюры → S3', accent: true },
      { id: 's3', x: 200, y: 170, w: 130, h: H, label: 'S3 / MinIO', sub: 'оригиналы' },
      { id: 'publisher', x: 400, y: 170, w: 150, h: H, label: 'publisher', sub: 'читает outbox', accent: true },
      { id: 'mq', x: 610, y: 170, w: 134, h: H, label: 'RabbitMQ', sub: 'DLX / DLQ' },
    ],
    edges: [
      { from: 'client', to: 'server' },
      { from: 'server', to: 'pg', label: 'tx' },
      { from: 'server', to: 's3', label: 'upload' },
      { from: 'pg', to: 'publisher' },
      { from: 'publisher', to: 'mq' },
      { from: 'mq', to: 'consumer' },
    ],
  },
  gophkeeper: {
    w: 760, h: 170,
    nodes: [
      { id: 'client', x: 30, y: 56, w: 190, h: 60, label: 'Клиент (TUI)', sub: 'bubbletea · SQLite-кэш', accent: true },
      { id: 'server', x: 330, y: 56, w: 170, h: 60, label: 'Сервер', sub: 'JWT access + refresh', accent: true },
      { id: 'pg', x: 580, y: 56, w: 150, h: 60, label: 'PostgreSQL', sub: 'секреты' },
    ],
    edges: [
      { from: 'client', to: 'server', label: 'gRPC + TLS', both: true },
      { from: 'server', to: 'pg' },
    ],
  },
  'sys-metrics': {
    w: 760, h: 170,
    nodes: [
      { id: 'agent', x: 30, y: 56, w: 170, h: 60, label: 'agent', sub: 'опрос runtime.Metrics', accent: true },
      { id: 'server', x: 300, y: 56, w: 180, h: 60, label: 'server', sub: 'REST + gRPC', accent: true },
      { id: 'store', x: 570, y: 56, w: 160, h: 60, label: 'Хранилище', sub: 'память / файл / PG' },
    ],
    edges: [
      { from: 'agent', to: 'server', label: 'HTTP / gRPC' },
      { from: 'server', to: 'store' },
    ],
  },
  'gophermart-loyalty': {
    w: 760, h: 250,
    nodes: [
      { id: 'client', x: 30, y: 30, w: 140, h: H, label: 'Клиент' },
      { id: 'api', x: 270, y: 30, w: 160, h: H, label: 'REST API', sub: 'OpenAPI', accent: true },
      { id: 'pg', x: 540, y: 30, w: 170, h: H, label: 'PostgreSQL', sub: 'заказы · баланс' },
      { id: 'worker', x: 270, y: 170, w: 160, h: H, label: 'Фоновый опрос', sub: 'статусы начислений', accent: true },
      { id: 'accrual', x: 540, y: 170, w: 170, h: H, label: 'accrual-сервис', sub: 'внешний' },
    ],
    edges: [
      { from: 'client', to: 'api' },
      { from: 'api', to: 'pg' },
      { from: 'api', to: 'worker' },
      { from: 'worker', to: 'accrual', both: true },
    ],
  },
}

export function diagramFor(slug: string): Diagram {
  return diagrams[slug]
}
