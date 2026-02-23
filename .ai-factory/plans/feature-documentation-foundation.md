# SanCRM Documentation Foundation

**Branch:** `feature/documentation-foundation`
**Created:** 2026-02-23

## Settings

- **Testing:** No
- **Logging:** N/A (documentation project)
- **Docs:** N/A (this IS the documentation)
- **Language:** Russian only
- **Landing:** Simple index.yaml
- **Framework:** Diplodoc (YFM)

## Documentation Structure

```
sancrm-docs/
├── .yfm                              # Diplodoc config
├── toc.yaml                          # Root table of contents
├── index.yaml                        # Landing page (simple format)
├── _images/                          # Images directory
├── _includes/                        # Reusable content snippets
│
├── quickstart/                       # Быстрый старт
│   ├── index.yaml                    # Section landing
│   ├── registration.md               # Регистрация и вход
│   ├── first-setup.md                # Первоначальная настройка
│   └── first-repair.md               # Создание первого ремонта
│
├── repairs/                          # Ремонты (основной модуль)
│   ├── index.yaml
│   ├── overview.md                   # Обзор модуля
│   ├── create-repair.md              # Создание ремонта
│   ├── statuses.md                   # Статусы и переходы
│   ├── kanban.md                     # Канбан-доска
│   ├── workflow-actions.md           # Действия Workflow
│   ├── spare-parts.md               # Запчасти и товары
│   ├── services.md                   # Услуги
│   ├── documents.md                  # Квитанции и документы
│   ├── notifications.md              # Уведомления клиентов
│   └── lenses.md                     # Фильтры и представления
│
├── customers/                        # Клиенты
│   ├── index.yaml
│   ├── overview.md
│   ├── create-customer.md
│   ├── blacklist.md
│   └── customer-history.md
│
├── warehouse/                        # Склад
│   ├── index.yaml
│   ├── overview.md                   # Обзор складского учёта
│   ├── products.md                   # Управление товарами
│   ├── stock-documents.md            # Складские документы (общее)
│   ├── posting.md                    # Приход
│   ├── writeoff.md                   # Списание
│   ├── transfer.md                   # Перемещение
│   ├── inventory.md                  # Инвентаризация
│   ├── return.md                     # Возврат поставщику
│   ├── price-types.md                # Типы цен
│   └── import.md                     # Импорт товаров
│
├── rental/                           # Прокат
│   ├── index.yaml
│   ├── overview.md
│   ├── tools.md                      # Управление инструментом
│   ├── create-rental.md              # Оформление проката
│   └── rental-contract.md            # Договор проката
│
├── analytics/                        # Аналитика
│   ├── index.yaml
│   ├── dashboard.md                  # Дашборд
│   └── profitability.md              # Рентабельность
│
├── settings/                         # Настройки
│   ├── index.yaml
│   ├── organization.md               # Организация
│   ├── branches.md                   # Филиалы
│   ├── users-roles.md                # Пользователи и роли
│   ├── statuses.md                   # Статусы ремонта
│   ├── workflow.md                   # Workflow
│   ├── templates.md                  # Шаблоны документов
│   ├── categories-brands.md          # Категории и бренды
│   ├── warehouses.md                 # Склады
│   ├── suppliers.md                  # Поставщики
│   └── suggestions.md               # Справочники подсказок
│
├── integrations/                     # Интеграции
│   ├── index.yaml
│   ├── telegram.md                   # Telegram-бот
│   └── public-status.md              # Публичная проверка статуса
│
└── faq/                              # Частые вопросы
    ├── index.yaml
    └── common-questions.md
```

**Total files:** ~50 (config + toc + landing pages + content stubs)

## Tasks

### Phase 1: Project Foundation
- [x] **Task 1:** Create Diplodoc project configuration (`.yfm`, root `toc.yaml`, root `index.yaml`, `_images/`, `_includes/`)

### Phase 2: Content Sections (all depend on Task 1)
- [x] **Task 2:** Быстрый старт (quickstart/) — 3 статьи
- [x] **Task 3:** Ремонты (repairs/) — 10 статей (основной модуль)
- [x] **Task 4:** Клиенты (customers/) — 4 статьи
- [x] **Task 5:** Склад (warehouse/) — 10 статей
- [x] **Task 6:** Прокат (rental/) — 4 статьи
- [x] **Task 7:** Аналитика (analytics/) — 2 статьи
- [x] **Task 8:** Настройки (settings/) — 10 статей
- [x] **Task 9:** Интеграции (integrations/) — 2 статьи
- [x] **Task 10:** FAQ (faq/) — 1 статья

## Commit Plan

1. **After Task 1:** `feat: add Diplodoc project configuration and root navigation`
2. **After Tasks 2-4:** `feat: add quickstart, repairs, and customers sections`
3. **After Tasks 5-7:** `feat: add warehouse, rental, and analytics sections`
4. **After Tasks 8-10:** `feat: add settings, integrations, and FAQ sections`

## Notes

- All content files are stubs with outlines (заглушки) — actual content fill happens separately
- Diplodoc syntax used: `{% note %}`, `{% cut %}`, front-matter metadata
- No multilang — files at root level, no `ru/` subdirectory
- Each section has its own `index.yaml` as a landing/routing page
- toc.yaml uses include pattern for modular navigation
