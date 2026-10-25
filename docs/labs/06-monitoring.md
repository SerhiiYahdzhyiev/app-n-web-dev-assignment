# 06. Мониторинг кластера и приложения

[Маршрут](../lab-sequence.md) · Нужно: 03–05 · Далее: [07](07-lifecycle.md)

## Цель
Различать проблему приложения, Kubernetes, физического хоста и генератора нагрузки.

## Задание
Разверни Prometheus/Grafana с небольшими retention и resource budgets. Подбери exporters/scrape targets и создай три компактных dashboard. Сохрани определения в Git.

### 1. Платформа
- Node Ready, доступные ресурсы, CPU/RAM, дисковое место и I/O, сеть.
- Requests/limits относительно allocatable; Pending/Unschedulable pods.
- Desired/available replicas, рестарты, OOMKilled, CPU throttling, PVC usage.
- API server latency/errors, состояние DNS; datastore metrics только для реально используемого datastore. У single-server K3s с SQLite не будет метрик etcd.
- Доступность scrape targets, ошибки сбора, потребление самого Prometheus и рост его диска.

### 2. Приложение
- Rate/errors/latency по операциям и зависимостям.
- Активные запросы, DB connection pools, cache hit rate, embed latency/readiness.
- Успешное оформление заказа и доля fallback-рекомендаций.
- Black-box проверка с позиции клиента: не только `/health`, но и безопасная пользовательская операция.

### 3. Эксперимент
- Offered/achieved rate и ошибки генератора рядом с метриками приложения.
- CPU/RAM/сеть генератора, отметки изменения нагрузки и rollout.
- Ресурсы Windows-хостов, на которых работают VM: зафиксировать хотя бы замеры вокруг теста, позднее добавить подходящий exporter. Guest metrics не показывают всю конкуренцию за ресурсы хоста.

## Alerts
Выбери небольшой набор actionable alerts: unavailable service, повышенные errors/latency, недоступная нода, длительно Pending pod, опасное заполнение диска, исчезнувший scrape target. Определи окно, порог, маршрут уведомления и действие оператора. Проверяй отсутствие данных отдельно от нулевого значения.

## Эксперименты
1. Останови одну app replica и проверь, чем это отличается от полной недоступности сервиса.
2. Создай Pending pod завышенным request.
3. Останови scrape target и проверь сообщение об отсутствии данных.
4. Вызови один alert, получи уведомление, восстанови систему и дождись resolved.

## Приёмка и артефакты
- По графикам понятно, где сломалась система, без просмотра каждого pod вручную.
- Есть три dashboard, alert definitions, словарь метрик и проверенное уведомление.
- Чётко отмечено, какие K3s control-plane метрики доступны, а какие ещё не собираются.
- Есть внешняя проверка хотя бы с другого хоста: мониторинг внутри умершего кластера не сообщит о собственной полной потере без внешнего наблюдателя.

## Подсказки
Prometheus Operator/kube-prometheus-stack, kube-state-metrics vs node-exporter vs kubelet/cAdvisor, ServiceMonitor, Alertmanager, blackbox exporter. Metrics Server нужен для resource metrics/HPA, но не заменяет исторический мониторинг. Не суммируй percentile разных pod: агрегируй histogram buckets корректно.

Рубежи: сбор → dashboard платформы → dashboard приложения → уведомления → self-monitoring.
