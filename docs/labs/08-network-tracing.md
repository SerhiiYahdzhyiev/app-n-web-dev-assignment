# 08. Сеть, ограничения доступа и traces

[Маршрут](../lab-sequence.md) · Нужно: 06–07 · Далее: [09](09-data-recovery.md)

## Цель
Прослеживать запрос от клиента до зависимости и проверять границы доступа.

## Задание
1. Опиши матрицу разрешённых связей, включая DNS, monitoring и административные обращения.
2. Настрой TLS на входе, NetworkPolicy default deny с необходимыми разрешениями и минимальные ServiceAccount/RBAC.
3. Добавь OpenTelemetry tracing HTTP-цепочки backend → recommend → embed и вызовов БД там, где доступна инструментация.
4. Выбери один backend трассировки с небольшим retention. Свяжи trace ID с логами; определи sampling и избегай пользовательских секретов в attributes.
5. Зафиксируй, какие ресурсы обслуживают каждый сетевой переход.

## Эксперименты
- Запретить DNS, затем отдельно доступ к Redis: сравнить симптомы и traces.
- Добавить контролируемую задержку зависимости и найти её в общей latency.
- Проверить разрешённую и запрещённую связь, а не только наличие NetworkPolicy в API.
- Проверить небольшой и крупный запрос между нодами; объяснить возможную роль MTU.

## Приёмка и артефакты
Матрица доступа подтверждена проверками. Есть trace нормального, медленного и неудачного запроса; по trace и логам находится причина. TLS renewal/expiry видны оператору. Dashboard definitions и tracing configuration сохранены.

## Подсказки
W3C Trace Context, OpenTelemetry auto/manual instrumentation, CNI policy enforcement, DNS egress, RBAC least privilege. Не устанавливай service mesh только ради первого tracing-эксперимента. Логи, metrics и traces имеют разный объём и retention.

Рубежи: схема → TLS/policies → трассировка → поломки.
