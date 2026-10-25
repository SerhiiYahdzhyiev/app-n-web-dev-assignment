# 05. Кластер и первый деплой

[Маршрут](../lab-sequence.md) · Нужно: 02–04 · Далее: [06](06-monitoring.md)

## Цель
Перенести baseline в двухнодовый K3s без большой переработки бизнес-логики.

## Задание
1. Установи фиксированную версию K3s, проверь node IP, VPN-интерфейс, API certificate и Pod/Service CIDR.
2. Проверь DNS и pod-to-pod трафик между нодами до деплоя магазина.
3. Публикуй versioned images в registry. Создай Namespace, Deployment/StatefulSet, Service, ConfigMap, Secret и PVC по ответственности компонентов.
4. Начни с одного embed и одной MongoDB. Явно зафиксируй ограничения local storage и отсутствие HA.
5. Настрой HTTP-вход через Traefik. Сохрани поведение `/api/` из текущего nginx. VPN NodePort допустим для начальной точки входа.
6. Прогони smoke и baseline из 04. Сохрани manifests, затем выдели Kustomize base/overlay.

## Эксперименты
По очереди внеси неправильный image tag, selector и порт. Для каждого объясни симптом через events, logs, endpoints и сетевые проверки, затем верни рабочее состояние.

## Приёмка и артефакты
- Оба узла Ready, межнодовые запросы работают.
- Магазин разворачивается из Git и подготовленных секретов без ручного редактирования контейнеров.
- Smoke проверяет тот же сценарий, что в Compose.
- Сохранены конфигурация K3s, схема входа и runbook диагностики трёх поломок.

## Подсказки
K3s node-ip/flannel-iface, EndpointSlice, ingress path rewrite, image pull secrets. Kubernetes не гарантирует порядок старта сервисов. StatefulSet не реплицирует содержимое БД. Не хранить plaintext secrets в Git.

Рубежи: кластер → сеть → данные → приложение → внешний smoke.
