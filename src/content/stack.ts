import type { StackCategory } from './types'

export const stack: StackCategory[] = [
  { id: 'lang', title: 'Языки', color: '#0a84ff', glyph: 'code', items: [
    { name: 'Go', note: 'основной язык' }, { name: 'PHP 7/8' }, { name: 'Yii' }, { name: 'Laravel' },
    { name: 'JavaScript' }, { name: 'Python' }, { name: 'SQL' },
  ] },
  { id: 'api', title: 'API и транспорт', color: '#5e5ce6', glyph: 'arrows', items: [
    { name: 'gRPC' }, { name: 'protobuf' }, { name: 'REST' }, { name: 'net/http' }, { name: 'OpenAPI' }, { name: 'WebSocket' },
  ] },
  { id: 'storage', title: 'Хранилища', color: '#30b0c7', glyph: 'db', items: [
    { name: 'PostgreSQL' }, { name: 'MySQL' }, { name: 'Redis' }, { name: 'SQLite' }, { name: 'S3 / MinIO' },
  ] },
  { id: 'queues', title: 'Очереди и надёжность', color: '#ff9f0a', glyph: 'queue', items: [
    { name: 'RabbitMQ' }, { name: 'DLX / DLQ' }, { name: 'Transactional outbox' }, { name: 'Идемпотентность' },
  ] },
  { id: 'infra', title: 'Инфраструктура', color: '#8e8e93', glyph: 'box', items: [
    { name: 'Docker' }, { name: 'Docker Compose' }, { name: 'Linux' }, { name: 'Git' }, { name: 'GitHub Actions' }, { name: 'golang-migrate' }, { name: 'Kubernetes' }, { name: 'Helm' }, { name: 'Prometheus' }, { name: 'Grafana' },
  ] },
  { id: 'ai', title: 'AI', color: '#bf5af2', glyph: 'spark', items: [
    { name: 'LLM-интеграции' }, { name: 'MCP' }, { name: 'Оркестрация агентов' },
  ] },
  { id: 'front', title: 'Фронтенд', color: '#34c759', glyph: 'window', items: [
    { name: 'Vue.js' }, { name: 'jQuery' }, { name: 'HTML' }, { name: 'CSS' },
  ] },
]
