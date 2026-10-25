# 13. Надёжная асинхронная индексация

[Маршрут](../lab-sequence.md) · Нужно: 11–12 · Далее: [14](14-recommendations.md)

## Цель
Сохранять товары независимо от доступности ML и гарантированно догонять производное состояние.

## Задание
1. Замени ненадёжный fire-and-forget HTTP цепочкой product transaction + outbox → relay → RabbitMQ → worker → index.
2. Определи event ID, entity ID/version, schema version; обеспечь атомарность бизнес-записи и outbox. Если используешь MongoDB transactions, подготовь replica set и явно отметь его HA-ограничения.
3. Настрой durable delivery, publisher confirmation, consumer acknowledgement после надёжного результата.
4. Реализуй идемпотентность, защиту от устаревших изменений, bounded retries, DLQ и ручной replay.
5. Расширь мониторинг: publish/consume rate, ready/unacked messages, processing latency, retries, DLQ, outbox backlog, возраст самого старого необработанного события и freshness индекса. Источник каждой метрики должен быть определён; queue depth не равна возрасту сообщения.

## Нагрузка и отказы
Добавь отдельный admin/event поток с настраиваемой интенсивностью create/update/delete. Смешай его с чтением каталога и рекомендаций из 04.

Обязательные тесты: broker недоступен; worker остановлен; worker убит после записи результата до ack; дубликат события; события не по порядку; невалидное событие. Накопи ограниченный backlog и измерь drain time после восстановления при продолжающемся входящем потоке. Сравни одного и нескольких consumers.

## Приёмка и артефакты
Товар и outbox сохраняются атомарно. После восстановления индекс догоняет изменения. Дубликаты не портят состояние, старые версии не перетирают новые, poison message не блокирует очередь навсегда. Проверены alert по lag/DLQ и replay runbook.

## Подсказки
Transactional outbox, at-least-once delivery, publisher confirms, idempotent consumer, backpressure, competing consumers. Не обещать exactly-once transport; доказать корректность бизнес-эффекта при повторной доставке. При общем outage retries должны быть ограничены.

Рубежи: контракт → outbox → broker/worker → повторы → backlog/alerts.
