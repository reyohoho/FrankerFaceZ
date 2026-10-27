'use strict';

// ============================================================================
// Local Russian translations for ReYohoho/RTE addons.
//
// FFZ ships its translations from the FrankerFaceZ CDN. We don't push our
// addon strings there, so this module bundles a fallback Russian dictionary
// directly into the build. It is merged on top of the CDN payload by
// `client/src/i18n.js`, so any value here always wins for `ru` / `ru-ru`.
//
// Most keys are auto-derived by the settings-tree machinery in
// `client/src/modules/main_menu/index.js`:
//
//   path 'Add-Ons > ReYohoho Anon Chat'
//     => setting.add_ons.reyohoho_anon_chat                         (segment title)
//   addon.reyohoho-anon-chat.enabled
//     => setting.entry.addon.reyohoho-anon-chat.enabled             (title)
//     => setting.entry.addon.reyohoho-anon-chat.enabled.description (description)
//
// Translating these auto-derived keys is enough for both the rendered title
// in the menu *and* the localized search-term index built per-setting.
// ============================================================================

export default {
	// ─── Path tokens (settings tree categories) ────────────────────────────
	'setting.add_ons.reyohoho_anon_chat': 'ReYohoho Анонимный чат',
	'setting.add_ons.reyohoho_ascii_art_font': 'ReYohoho Шрифт ASCII-арта',
	'setting.add_ons.reyohoho_bypass_unique_chat': 'ReYohoho Обход уникального чата',
	'setting.add_ons.reyohoho_chat_commands': 'ReYohoho Команды чата',
	'setting.add_ons.reyohoho_emote_actions': 'ReYohoho Действия со смайлами',
	'setting.add_ons.reyohoho_emote_actions.providers': 'Провайдеры',
	'setting.add_ons.reyohoho_emotes_proxy': 'ReYohoho Прокси для смайлов',
	'setting.add_ons.reyohoho_emotes_proxy.services': 'Сервисы',
	'setting.add_ons.reyohoho_emotes_proxy.badges': 'Значки',
	'setting.add_ons.reyohoho_emotes_proxy.paints': 'Расцветки ника',
	'setting.add_ons.reyohoho_friends': 'ReYohoho Друзья',
	'setting.add_ons.reyohoho_mod_slider': 'ReYohoho Слайдер модерации',

	// ─── reyohoho-anon-chat ────────────────────────────────────────────────
	'setting.entry.addon.reyohoho-anon-chat.enabled':
		'Включить команды чата /part и /join',
	'setting.entry.addon.reyohoho-anon-chat.enabled.description':
		'Если включено, ввод `/part` в чат переключит ваше IRC-соединение на анонимного пользователя `justinfan` — вы перестанете отображаться в списке зрителей, но сможете читать чат. Команда `/join` повторно авторизует ваш реальный аккаунт.',
	'setting.entry.addon.reyohoho-anon-chat.block-send':
		'Блокировать исходящие сообщения в анон-чате',
	'setting.entry.addon.reyohoho-anon-chat.block-send.description':
		'Пока активен анонимный чат (после `/part`), блокировать отправку сообщений и показывать напоминание. Иначе Twitch молча отбрасывает их.',

	'addon.reyohoho-anon-chat.command.part.description':
		'Временно покинуть чат (анонимный режим).',
	'addon.reyohoho-anon-chat.command.join.description':
		'Снова войти в чат под своим аккаунтом после /part.',
	'addon.reyohoho-anon-chat.notice.part':
		'ReYohoho: [Анонимный чат] Выход из чата...',
	'addon.reyohoho-anon-chat.notice.join':
		'ReYohoho: [Анонимный чат] Вход в чат...',
	'addon.reyohoho-anon-chat.notice.blocked':
		'Вы не можете отправлять сообщения, когда включён анонимный чат. Введите /join, чтобы вернуться в чат.',
	'addon.reyohoho-anon-chat.notice.notLoggedIn':
		'ReYohoho: [Анонимный чат] Не удалось выполнить /join: вы не вошли в Twitch.',

	// ─── reyohoho-ascii-art-font ───────────────────────────────────────────
	'setting.entry.addon.reyohoho-ascii-art-font.enabled':
		'Использовать стандартный шрифт для ASCII-арт сообщений',
	'setting.entry.addon.reyohoho-ascii-art-font.enabled.description':
		'Если сообщение чата определено как ASCII-арт, переопределить шрифт на стандартный шрифт Twitch, чтобы кастомный размер/семейство шрифта чата не ломали арт. Работает только локально.',

	// ─── reyohoho-bypass-unique-chat ───────────────────────────────────────
	'setting.entry.addon.reyohoho-bypass-unique-chat.enabled':
		'Включить обход уникального чата Twitch',
	'setting.entry.addon.reyohoho-bypass-unique-chat.enabled.description':
		'При включении нажатие Enter с тем же сообщением, что и предыдущее, добавит невидимый Unicode-символ для обхода уникального чата / R9K-защиты Twitch. Работает только локально.',

	// ─── reyohoho-chat-commands ────────────────────────────────────────────
	'setting.entry.addon.reyohoho-chat-commands.enabled':
		'Включить команды чата ReYohoho',
	'setting.entry.addon.reyohoho-chat-commands.enabled.description':
		'Добавляет /pasta, /chatters, /uptime, /viewers, /follows, /followed и другие удобные команды.',
	'setting.entry.addon.reyohoho-chat-commands.pasta': 'Включить /pasta',
	'setting.entry.addon.reyohoho-chat-commands.pasta.description':
		'Поиск копипаст из дампа ReYohoho и вставка выбранного результата в поле ввода чата.',

	'addon.reyohoho-chat-commands.commands.pasta.description':
		'Использование: «/pasta запрос» — поиск копипаст',
	'addon.reyohoho-chat-commands.commands.chatters.description':
		'Использование: «/chatters» — показать количество пользователей в чате',
	'addon.reyohoho-chat-commands.commands.uptime.description':
		'Использование: «/uptime» — показать, сколько канал в эфире',
	'addon.reyohoho-chat-commands.commands.viewers.description':
		'Использование: «/viewers» — показать количество зрителей трансляции',
	'addon.reyohoho-chat-commands.commands.follows.description':
		'Использование: «/follows» — показать количество фолловеров канала',
	'addon.reyohoho-chat-commands.commands.followed.description':
		'Использование: «/followed» — показать, как давно вы отслеживаете канал',
	'addon.reyohoho-chat-commands.commands.shrug.description':
		'Использование: «/shrug [сообщение]» — добавить ¯\\_(ツ)_/¯',
	'addon.reyohoho-chat-commands.commands.squishy.description':
		'Использование: «/squishy» — вставить копипасту о Squishy5',
	'addon.reyohoho-chat-commands.commands.lurk.description':
		'Использование: «/lurk» — сообщить чату, что вы кродётесь',
	'addon.reyohoho-chat-commands.commands.barrelroll.description':
		'Использование: «/barrelroll» — повернуть страницу на 360°',
	'addon.reyohoho-chat-commands.commands.party.description':
		'Использование: «/party [on|off]» — включить party-фильтр на странице',
	'addon.reyohoho-chat-commands.commands.rte.description':
		'Использование: «/rte» — ReYohoho Twitch Extension!',
	'addon.reyohoho-chat-commands.commands.b.description':
		'Использование: «/b <логин> [причина]» — сокращение от /ban',
	'addon.reyohoho-chat-commands.commands.u.description':
		'Использование: «/u <логин>» — сокращение от /unban',
	'addon.reyohoho-chat-commands.commands.purge.description':
		'Использование: «/purge <логин> [причина]» — очистить сообщения пользователя',
	'addon.reyohoho-chat-commands.commands.p.description':
		'Использование: «/p <логин> [причина]» — сокращение от /purge',
	'addon.reyohoho-chat-commands.commands.sub.description':
		'Использование: «/sub» — сокращение от /subscribers',
	'addon.reyohoho-chat-commands.commands.suboff.description':
		'Использование: «/suboff» — сокращение от /subscribersoff',

	'addon.reyohoho-chat-commands.notice.cannot-resolve-channel':
		'Не удалось определить канал.',
	'addon.reyohoho-chat-commands.notice.command-failed':
		'ReYohoho: команда /{name} не выполнена.',
	'addon.reyohoho-chat-commands.notice.chatters':
		'Сейчас в чате: {count}',
	'addon.reyohoho-chat-commands.notice.chatters-error':
		'Не удалось получить количество пользователей в чате.',
	'addon.reyohoho-chat-commands.notice.uptime':
		'Трансляция идёт: {duration}',
	'addon.reyohoho-chat-commands.notice.uptime-not-live':
		'Трансляция не в эфире.',
	'addon.reyohoho-chat-commands.notice.viewers':
		'Сейчас зрителей: {count}',
	'addon.reyohoho-chat-commands.notice.viewers-error':
		'Не удалось получить трансляцию.',
	'addon.reyohoho-chat-commands.notice.follows':
		'Сейчас фолловеров: {count}',
	'addon.reyohoho-chat-commands.notice.follows-error':
		'Не удалось получить количество фолловеров.',
	'addon.reyohoho-chat-commands.notice.followed-not-logged':
		'Вы не вошли в Twitch.',
	'addon.reyohoho-chat-commands.notice.followed-not':
		'Вы не отслеживаете {channel}.',
	'addon.reyohoho-chat-commands.notice.followed':
		'Вы отслеживаете {channel} {duration} (с {date}).',
	'addon.reyohoho-chat-commands.notice.party-usage':
		'Использование: /party [on|off]',
	'addon.reyohoho-chat-commands.notice.party-state':
		'Party-фильтр {state, select, on {включён} other {выключен}}.',
	'addon.reyohoho-chat-commands.notice.pasta-usage':
		'Использование: /pasta <запрос>',
	'addon.reyohoho-chat-commands.notice.shortcut-usage':
		'Использование: {command} <логин>',
	'addon.reyohoho-chat-commands.message.lurk': '/me кродётся',
	'addon.reyohoho-chat-commands.message.rte':
		'ReYohoho Twitch Extension! reyohohoNice',

	// ─── reyohoho-emote-actions ────────────────────────────────────────────
	'setting.entry.addon.reyohoho-emote-actions.mmb_open_page':
		'Средний клик открывает страницу смайла',
	'setting.entry.addon.reyohoho-emote-actions.mmb_open_page.description':
		'Открывает страницу-источник (7TV / BTTV / FFZ) смайла в новой вкладке при клике средней кнопкой мыши по смайлу в чате.',
	'setting.entry.addon.reyohoho-emote-actions.rmb_insert_code':
		'Правый клик вставляет код смайла в поле ввода',
	'setting.entry.addon.reyohoho-emote-actions.rmb_insert_code.description':
		'Заменяет стандартное контекстное меню браузера на смайлах в чате. Добавляет код смайла в поле ввода чата через пробел.',
	'setting.entry.addon.reyohoho-emote-actions.include_twitch':
		'Применять к нативным смайлам Twitch',
	'setting.entry.addon.reyohoho-emote-actions.include_twitch.description':
		'Использовать twitchemotes.com как страницу назначения для среднего клика по нативным смайлам Twitch.',

	// ─── reyohoho-emotes-proxy ─────────────────────────────────────────────
	'setting.entry.addon.reyohoho-emotes-proxy.enabled': 'Включить прокси',
	'setting.entry.addon.reyohoho-emotes-proxy.enabled.description':
		'Проксировать API и CDN запросы через ближайшее доступное RTE-зеркало. Эндпоинт выбирается автоматически при запуске.',
	'setting.entry.addon.reyohoho-emotes-proxy.7tv-enabled': '7TV',
	'setting.entry.addon.reyohoho-emotes-proxy.7tv-enabled.description':
		'Проксировать запросы к 7TV API и CDN (7tv.io, 7tv.app, cdn.7tv.app)',
	'setting.entry.addon.reyohoho-emotes-proxy.bttv-enabled': 'BTTV',
	'setting.entry.addon.reyohoho-emotes-proxy.bttv-enabled.description':
		'Проксировать запросы к BetterTTV API и CDN (api.betterttv.net, cdn.betterttv.net)',
	'setting.entry.addon.reyohoho-emotes-proxy.ffz-enabled': 'FFZ',
	'setting.entry.addon.reyohoho-emotes-proxy.ffz-enabled.description':
		'Проксировать запросы к FrankerFaceZ API и CDN (cdn.frankerfacez.com, cdn2.frankerfacez.com, api.frankerfacez.com, api2.frankerfacez.com)',
	'setting.entry.addon.reyohoho-emotes-proxy.badges': 'Значки ReYohoho',
	'setting.entry.addon.reyohoho-emotes-proxy.badges.description':
		'Показывать кастомные значки ReYohoho в чате.\n\n(Видимость каждого значка можно настроить в [Чат >> Значки > Видимость > Дополнения](~chat.badges.tabs.visibility))',
	'setting.entry.addon.reyohoho-emotes-proxy.paints': 'Расцветки ника RTE',
	'setting.entry.addon.reyohoho-emotes-proxy.paints.description':
		'Показывать кастомные расцветки никнеймов RTE (градиенты и изображения) в чате.',

	// ─── reyohoho-friends ──────────────────────────────────────────────────
	'setting.entry.addon.reyohoho-friends.enabled': 'Включить «Друзей»',
	'setting.entry.addon.reyohoho-friends.enabled.description':
		'Показывать список друзей в боковой панели, отчитываться об активности на каналах и опрашивать сервер на предмет уведомлений о заявках в друзья.',

	'addon.reyohoho-friends.emoteMenu.banner':
		'У вас {count, plural, one {# входящая заявка} few {# входящие заявки} many {# входящих заявок} other {# заявок}}',
	'addon.reyohoho-friends.emoteMenu.disable': 'Отключить «Друзей»',
	'addon.reyohoho-friends.emoteMenu.disableTitle':
		'Отключить функцию «Друзья» (боковая панель, уведомления и кнопки в карточках чата)',
	'addon.reyohoho-friends.list.empty':
		'Пока нет друзей. Добавляйте их через карточки пользователей в чате!',
	'addon.reyohoho-friends.sidebar.title': 'Друзья',
	'addon.reyohoho-friends.sidebar.manage': 'Управление',
	'addon.reyohoho-friends.sidebar.hide': 'Скрыть',
	'addon.reyohoho-friends.sidebar.hideTitle':
		'Скрыть и отключить функцию «Друзья»',
	'addon.reyohoho-friends.sidebar.showMore': 'Показать ещё',
	'addon.reyohoho-friends.sidebar.showLess': 'Скрыть',
	'addon.reyohoho-friends.offline': 'Не в сети',

	// ─── reyohoho-mod-slider ───────────────────────────────────────────────
	'setting.entry.addon.reyohoho-mod-slider.enabled':
		'Включить слайдер модерации',
	'setting.entry.addon.reyohoho-mod-slider.enabled.description':
		'Показывать свайп-ручку слева от сообщений чата для модераторов. Свайп вправо — бан/таймаут/удаление, свайп влево — разбан.',

	// ─── reyohoho-live-rewind ──────────────────────────────────────────────
	'setting.add_ons.re_yohoho_live_rewind': 'ReYohoho Перемотка live-стрима',
	'setting.entry.addon.reyohoho-live-rewind.enabled':
		'Перемотка live-стрима (RTE Sub)',
	'setting.entry.addon.reyohoho-live-rewind.enabled.description':
		'Добавляет полоску перемотки на live-стримах через запись VOD. У стримера должно быть включено сохранение трансляций.\n\n' +
		'**Доступно только подписчикам RTE.** [Оформить подписку](https://ext.rte.net.ru)',
	'addon.reyohoho-live-rewind.setting.title': 'Перемотка live-стрима (RTE Sub)',
	'addon.reyohoho-live-rewind.setting.description':
		'Добавляет полоску перемотки на live-стримах через запись VOD. У стримера должно быть включено сохранение трансляций.\n\n' +
		'**Доступно только подписчикам RTE.** [Оформить подписку](https://ext.rte.net.ru)',
	'addon.reyohoho-live-rewind.subscribersOnly': 'Доступно только подписчикам RTE.',
	'addon.reyohoho-live-rewind.subscribeLink': 'Оформить подписку',
	'home.rte.sub.benefits.rewind': 'Перемотка live-стрима через запись VOD.',

	// ─── reyohoho-tweaks ───────────────────────────────────────────────────
	'setting.add_ons.re_yohoho_tweaks': 'ReYohoho Твики',
	'setting.add_ons.re_yohoho_tweaks.ambilight': 'Ambilight',
	'setting.add_ons.re_yohoho_tweaks.live_catch_up': 'Догон эфира',
	'setting.add_ons.re_yohoho_tweaks.vods': 'Записи',
	'setting.add_ons.re_yohoho_tweaks.chat': 'Чат',
	'setting.add_ons.re_yohoho_tweaks.channel': 'Канал',
	'setting.add_ons.re_yohoho_tweaks.sidebar': 'Боковая панель',
	'setting.entry.addon.reyohoho-tweaks.ambilight.enabled': 'Ambilight',
	'setting.entry.addon.reyohoho-tweaks.ambilight.enabled.description':
		'Подсвечивать область вокруг плеера цветами стрима. Нужны тёмная тема Twitch и аппаратное ускорение (WebGL 2).',
	'setting.entry.addon.reyohoho-tweaks.ambilight.button': 'Показывать кнопку Ambilight в плеере',
	'setting.entry.addon.reyohoho-tweaks.ambilight.button.description':
		'Клик включает и выключает подсветку, ПКМ открывает эти настройки.',
	'setting.entry.addon.reyohoho-tweaks.ambilight.brightness': 'Яркость, %',
	'setting.entry.addon.reyohoho-tweaks.ambilight.size': 'Размер свечения, %',
	'setting.entry.addon.reyohoho-tweaks.ambilight.blur': 'Размытие, px',
	'setting.entry.addon.reyohoho-tweaks.ambilight.saturation': 'Насыщенность, %',
	'setting.entry.addon.reyohoho-tweaks.ambilight.smoothness': 'Плавность смены цветов, %',
	'setting.entry.addon.reyohoho-tweaks.ambilight.fill-bars':
		'Подсвечивать чёрные полосы вокруг видео в театральном режиме',
	'addon.reyohoho-tweaks.ambilight.button': 'Подсветка вокруг плеера (Ambilight)',
	'addon.reyohoho-tweaks.ambilight.tooltip': 'Ambilight (ПКМ — настройки)',
	'addon.reyohoho-tweaks.ambilight.light-theme': 'Подсветка работает только в тёмной теме Twitch',
	'addon.reyohoho-tweaks.ambilight.too-slow':
		'Подсветка выключена до перезагрузки страницы: с ней стрим терял кадры. Проверьте, что в настройках браузера включено аппаратное ускорение',
	'addon.reyohoho-tweaks.ambilight.unsupported':
		'Подсветке нужно аппаратное ускорение (WebGL 2), а в этом браузере оно выключено или недоступно',
	'setting.entry.addon.reyohoho-tweaks.live-catchup.enabled': 'Догон эфира',
	'setting.entry.addon.reyohoho-tweaks.live-catchup.enabled.description':
		'Слегка ускорять трансляцию, пока задержка не снизится до цели. После подвисаний делает паузу, чтобы плеер успел набрать запас.',
	'setting.entry.addon.reyohoho-tweaks.live-catchup.target': 'Желаемая задержка, секунд',
	'setting.entry.addon.reyohoho-tweaks.live-catchup.rate': 'Скорость догона',
	'setting.entry.addon.reyohoho-tweaks.live-catchup.rate.description':
		'Выше 1.25 может быть заметно или нестабильно.',
	'setting.entry.addon.reyohoho-tweaks.vod-real-time': 'Показывать реальное время эфира на записях',
	'setting.entry.addon.reyohoho-tweaks.vod-real-time.description':
		'Показывать настоящие дату и время эфира рядом с таймкодом при просмотре записи.',
	'addon.reyohoho-tweaks.vod-real-time.tooltip': 'Реальное время эфира в этот момент (по вашим часам)',
	'setting.entry.addon.reyohoho-tweaks.chat-resize': 'Менять ширину чата перетаскиванием края',
	'setting.entry.addon.reyohoho-tweaks.chat-resize.description':
		'Потяните край колонки чата у плеера. Двойной щелчок по краю — сброс. Меняет настройку Чат > Оформление > Ширина.',
	'addon.reyohoho-tweaks.chat-resize.handle': 'Потяните, чтобы изменить ширину чата; двойной щелчок — сброс',
	'setting.entry.addon.reyohoho-tweaks.hide.ai-summary': 'Скрывать ИИ-сводки стрима',
	'setting.entry.addon.reyohoho-tweaks.hide.ai-summary.description':
		'Скрывать сгенерированные ИИ сводки по ходу стрима, которые Twitch показывает в чате.',
	'setting.entry.addon.reyohoho-tweaks.hide.sub-upgrade': 'Скрывать кнопку «Повысить уровень подписки»',
	'setting.entry.addon.reyohoho-tweaks.hide.notifications': 'Скрывать колокольчик уведомлений канала',
	'setting.entry.addon.reyohoho-tweaks.hide.bits-balance': 'Скрывать баланс Bits под полем ввода чата',
	'setting.entry.addon.reyohoho-tweaks.hide.bits-offer': 'Скрывать кнопку «Bits» со скидкой',
	'setting.entry.addon.reyohoho-tweaks.sidebar.sort-by-viewers': 'Сортировать отслеживаемые каналы по зрителям',
	'setting.entry.addon.reyohoho-tweaks.sidebar.sort-by-viewers.description':
		'Переключать список отслеживаемых каналов на сортировку «Зрители (по убыванию)».',

	// ─── reyohoho-chat-commands: /screenshot ───────────────────────────────
	'addon.reyohoho-chat-commands.commands.screenshot.description':
		'Использование: «/screenshot» - сохранить кадр стрима в PNG',
	'addon.reyohoho-chat-commands.notice.screenshot-not-playing':
		'Ошибка: не удалось сделать скриншот, стрим воспроизводится?',
	'addon.reyohoho-chat-commands.notice.screenshot-failed': 'Ошибка: не удалось сделать скриншот.',

	// ─── chat.filtering.block-digit-only-messages ──────────────────────────
	'setting.entry.chat.filtering.block-digit-only-messages':
		'Скрывать сообщения, состоящие только из цифр',
	'setting.entry.chat.filtering.block-digit-only-messages.description':
		'Скрывает сообщения, в которых только цифры и пробелы (обычные «777», «+1» и т. п.). Эквивалентно добавлению regex `^\\s*\\d+\\s*$` в список блокируемых терминов с флагом **Remove**, но управляется одним переключателем.',

	// ─── chat.rich.media-previews-* ─────────────────────────────────────────
	'setting.entry.chat.rich.media-previews.description':
		'Показывает предпросмотр изображений и видео для прямых медиассылок, ссылок на эмоты 7TV, Imgur и kappa.lol. Если в настройках всплывающих подсказок включено отображение картинок, эта же опция управляет превью в карточках ссылок и при наведении на ссылку; для части хостов изображения идут через прокси RTE CDN.',
	'setting.entry.chat.rich.media-previews-style':
		'Стиль предпросмотра медиа',
	'setting.entry.chat.rich.media-previews-style.description':
		'Стиль медиапревью, когда они включены. **Карточка** — стандартная карточка FrankerFaceZ. **Встроенно** — изображение или видео под сообщением; при наведении на ссылку — компактная миниатюра (размер задаётся лимитами ниже).',
	'setting.entry.chat.rich.media-previews-max-width':
		'Максимальная ширина встроенного предпросмотра',
	'setting.entry.chat.rich.media-previews-max-width.description':
		'Максимальная ширина (пикс.) для встроенного превью и для миниатюры во всплывающей подсказке в режиме «встроенно».',
	'setting.entry.chat.rich.media-previews-max-height':
		'Максимальная высота встроенного предпросмотра',
	'setting.entry.chat.rich.media-previews-max-height.description':
		'Максимальная высота (пикс.) для встроенного превью и для миниатюры во всплывающей подсказке в режиме «встроенно».'
};
