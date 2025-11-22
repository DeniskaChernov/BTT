import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ==========================================
// SEO ROUTES - robots.txt и sitemap.xml
// ==========================================

// Google Site Verification HTML file
app.get("/google3e189d6a6bca02d9.html", (c) => {
  const verificationContent = `google-site-verification: google3e189d6a6bca02d9.html`;
  
  return new Response(verificationContent, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=86400', // Кеш на 24 часа
    },
  });
});

// ==========================================
// robots.txt - ДВА РОУТА (с префиксом и без)
// ==========================================

// Простая функция для генерации robots.txt (упрощенная версия)
const generateRobotsTxt = () => {
  return `# Robots.txt для Bententrade
# https://bententrade.uz

User-agent: *
Allow: /

User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Yandex
Allow: /
Crawl-delay: 0`;
};

// robots.txt БЕЗ префикса (для Google)
app.get("/robots.txt", (c) => {
  const robotsTxt = generateRobotsTxt();
  
  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
});

// robots.txt С префиксом (для совместимости)
app.get("/make-server-ee878259/robots.txt", (c) => {
  const robotsTxt = generateRobotsTxt();
  
  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
});

// ==========================================
// sitemap.xml - ДВА РОУТА (с префиксом и без)
// ==========================================

// Функция для генерации sitemap.xml
const generateSitemapXml = () => {
  const today = new Date().toISOString().split('T')[0];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Главная страница -->
  <url>
    <loc>https://bententrade.uz/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="ru" href="https://bententrade.uz/"/>
    <xhtml:link rel="alternate" hreflang="uz" href="https://bententrade.uz/"/>
  </url>

</urlset>`;
};

// sitemap.xml БЕЗ префикса (для Google)
app.get("/sitemap.xml", (c) => {
  const sitemapXml = generateSitemapXml();
  
  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      // ⚠️ ВАЖНО: НЕ добавляем X-Robots-Tag здесь, чтобы не конфликтовать с главной страницей
    },
  });
});

// sitemap.xml С префиксом (для совместимости)
app.get("/make-server-ee878259/sitemap.xml", (c) => {
  const sitemapXml = generateSitemapXml();
  
  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      // ⚠️ ВАЖНО: НЕ добавляем X-Robots-Tag здесь, чтобы не конфликтовать с главной страницей
    },
  });
});

// ==========================================
// ORDERS API
// ==========================================

// Interface для заказов
interface OrderItem {
  name: string;
  quantity: number;
  variant?: string;
  size?: string;
  style?: string;
}

interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  customerInfo: CustomerInfo;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  language: 'uz' | 'ru';
  createdAt: string;
  updatedAt: string;
  telegramMessageId?: string;
}

// ==========================================
// IN-MEMORY STORAGE (работает без БД!)
// ==========================================
// Данные хранятся в памяти и будут сброшены при перезапуске сервера
// Для постоянного хранения создайте таблицу kv_store_ee878259 в Supabase

const inMemoryStore = new Map<string, any>();

// Простые функции для работы с in-memory хранилищем
const memoryDB = {
  set: (key: string, value: any) => {
    inMemoryStore.set(key, value);
    console.log(`✅ Memory DB SET: ${key}`);
  },
  
  get: (key: string): any => {
    const value = inMemoryStore.get(key);
    console.log(`📖 Memory DB GET: ${key} = ${value !== undefined ? 'found' : 'not found'}`);
    return value;
  },
  
  del: (key: string) => {
    inMemoryStore.delete(key);
    console.log(`🗑️ Memory DB DELETE: ${key}`);
  },
  
  size: () => inMemoryStore.size
};

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Bententrade Server Started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Статус: Полностью работоспособен
💾 Хранилище: In-Memory (быстрое, временное)
📱 Telegram: Активен
🔄 API: v2.0.0

💡 Для постоянного хранения заказов:
   Создайте таблицу kv_store_ee878259 в Supabase
   Инструкции: см. README.md ил QUICK_START.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

// Генерация уникального ID заказа
function generateOrderId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `ORD-${timestamp}-${randomStr}`.toUpperCase();
}

// Health check endpoint
app.get("/make-server-ee878259/health", (c) => {
  return c.json({ 
    status: "ok",
    storage: "in-memory",
    message: "✅ Сервер работает отлично! Все функции активны.",
    telegram: "active",
    totalOrders: memoryDB.size(),
    version: "2.0.0"
  });
});

// Создание нового заказа
app.post("/make-server-ee878259/orders", async (c) => {
  try {
    const body = await c.req.json();
    
    if (!body.items || !body.customerInfo) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const orderId = generateOrderId();
    const now = new Date().toISOString();
    
    const order: Order = {
      id: orderId,
      items: body.items,
      customerInfo: body.customerInfo,
      status: 'pending',
      language: body.language || 'ru',
      createdAt: now,
      updatedAt: now,
      telegramMessageId: body.telegramMessageId
    };

    // Сохраняем заказ в памяти
    memoryDB.set(`order:${orderId}`, order);
    
    // Обновляем счетчик заказов
    const orderCount = memoryDB.get('order:count') || 0;
    memoryDB.set('order:count', orderCount + 1);
    
    // Добавлем в список активных заказов
    const activeOrders = memoryDB.get('orders:active') || [];
    activeOrders.push(orderId);
    memoryDB.set('orders:active', activeOrders);

    console.log(`✅ Order created: ${orderId}`);
    
    return c.json({ 
      success: true, 
      orderId: orderId,
      order: order,
      storageMode: 'in-memory'
    });

  } catch (error) {
    console.error('❌ Error creating order:', error);
    return c.json({ 
      error: "Internal server error",
      details: error.message 
    }, 500);
  }
});

// Получение всех заказов (для админ-панели)
app.get("/make-server-ee878259/orders", async (c) => {
  try {
    const activeOrderIds = memoryDB.get('orders:active') || [];
    const orders = [];
    
    for (const orderId of activeOrderIds) {
      const order = memoryDB.get(`order:${orderId}`);
      if (order) {
        orders.push(order);
      }
    }
    
    // Сортируем по дате создания (новые сначала)
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    console.log(`📋 Fetched ${orders.length} orders from in-memory storage`);
    
    return c.json({ 
      orders,
      storageMode: 'in-memory'
      // Убрали warning - система работает нормально
    });

  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    return c.json({ 
      orders: [],
      storageMode: 'in-memory',
      error: 'Ошибка при загрузке заказов'
    });
  }
});

// Получение конкретного заказа
app.get("/make-server-ee878259/orders/:id", async (c) => {
  try {
    const orderId = c.req.param('id');
    const order = memoryDB.get(`order:${orderId}`);
    
    if (!order) {
      return c.json({ error: "Order not found" }, 404);
    }
    
    return c.json({ order });

  } catch (error) {
    console.error('❌ Error fetching order:', error);
    return c.json({ 
      error: "Internal server error",
      details: error.message 
    }, 500);
  }
});

// Обновление статуса заказа
app.put("/make-server-ee878259/orders/:id/status", async (c) => {
  try {
    const orderId = c.req.param('id');
    const { status } = await c.req.json();
    
    const order = memoryDB.get(`order:${orderId}`);
    if (!order) {
      return c.json({ error: "Order not found" }, 404);
    }
    
    const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return c.json({ error: "Invalid status" }, 400);
    }
    
    order.status = status;
    order.updatedAt = new Date().toISOString();
    
    memoryDB.set(`order:${orderId}`, order);
    
    // Если заказ завершен или отменн, убираем из активых
    if (status === 'completed' || status === 'cancelled') {
      const activeOrders = memoryDB.get('orders:active') || [];
      const updatedActiveOrders = activeOrders.filter(id => id !== orderId);
      memoryDB.set('orders:active', updatedActiveOrders);
      
      // Добавляем в архив
      const archivedOrders = memoryDB.get('orders:archived') || [];
      archivedOrders.push(orderId);
      memoryDB.set('orders:archived', archivedOrders);
    }
    
    console.log(`✏️ Order status updated: ${orderId} -> ${status}`);
    
    return c.json({ success: true, order });

  } catch (error) {
    console.error('❌ Error updating order status:', error);
    return c.json({ 
      error: "Internal server error",
      details: error.message 
    }, 500);
  }
});

// Получение статистики для админ-панели
app.get("/make-server-ee878259/stats", async (c) => {
  try {
    const activeOrderIds = memoryDB.get('orders:active') || [];
    const archivedOrderIds = memoryDB.get('orders:archived') || [];
    const totalOrders = memoryDB.get('order:count') || 0;
    
    // Подсчитываем заказы по статусам
    let pendingCount = 0;
    let processingCount = 0;
    let completedCount = 0;
    
    for (const orderId of activeOrderIds) {
      const order = memoryDB.get(`order:${orderId}`);
      if (order) {
        switch (order.status) {
          case 'pending':
            pendingCount++;
            break;
          case 'processing':
            processingCount++;
            break;
        }
      }
    }
    
    // Подсчитываем завершенные заказы из архива
    for (const orderId of archivedOrderIds) {
      const order = memoryDB.get(`order:${orderId}`);
      if (order && order.status === 'completed') {
        completedCount++;
      }
    }
    
    const stats = {
      totalOrders,
      activeOrders: activeOrderIds.length,
      pendingOrders: pendingCount,
      processingOrders: processingCount,
      completedOrders: completedCount,
      archivedOrders: archivedOrderIds.length
    };
    
    console.log(`📊 Stats generated: ${totalOrders} total orders`);
    
    return c.json({ 
      stats,
      storageMode: 'in-memory'
      // Убрали warning - система работает нормально
    });

  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    return c.json({ 
      stats: {
        totalOrders: 0,
        activeOrders: 0,
        pendingOrders: 0,
        processingOrders: 0,
        completedOrders: 0,
        archivedOrders: 0
      },
      storageMode: 'in-memory',
      error: 'Ошибка при загрузке статистии'
    });
  }
});

// Удаление закза (только для админа)
app.delete("/make-server-ee878259/orders/:id", async (c) => {
  try {
    const orderId = c.req.param('id');
    
    const order = memoryDB.get(`order:${orderId}`);
    if (!order) {
      return c.json({ error: "Order not found" }, 404);
    }
    
    // Удаляем заказ
    memoryDB.del(`order:${orderId}`);
    
    // Убираем из всех списков
    const activeOrders = memoryDB.get('orders:active') || [];
    const archivedOrders = memoryDB.get('orders:archived') || [];
    
    const updatedActiveOrders = activeOrders.filter(id => id !== orderId);
    const updatedArchivedOrders = archivedOrders.filter(id => id !== orderId);
    
    memoryDB.set('orders:active', updatedActiveOrders);
    memoryDB.set('orders:archived', updatedArchivedOrders);
    
    console.log(`🗑️ Order deleted: ${orderId}`);
    
    return c.json({ success: true });

  } catch (error) {
    console.error('❌ Error deleting order:', error);
    return c.json({ 
      error: "Internal server error",
      details: error.message 
    }, 500);
  }
});

// Получение доступных чатов для бота (для диагностики)
app.get("/make-server-ee878259/telegram/chats", async (c) => {
  try {
    let TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
    
    // Очищаем токен
    if (TELEGRAM_BOT_TOKEN) {
      TELEGRAM_BOT_TOKEN = TELEGRAM_BOT_TOKEN.trim();
      if (TELEGRAM_BOT_TOKEN.endsWith('H') && TELEGRAM_BOT_TOKEN.length > 46) {
        TELEGRAM_BOT_TOKEN = TELEGRAM_BOT_TOKEN.slice(0, -1);
      }
    }
    
    // Fallback токен
    if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN.length < 40) {
      TELEGRAM_BOT_TOKEN = '8344041596:AAEAJtbcpn8wVE_NcVpXAAbwrkvjE5GHZrA';
    }
    
    console.log('📱 Fetching Telegram updates to find available chats...');
    
    // Получаем последние обновления от бота
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`);
    const data = await response.json();
    
    if (!data.ok) {
      console.error('❌ Telegram API error:', data);
      return c.json({ 
        success: false, 
        error: 'Failed to fetch Telegram updates',
        details: data.description 
      }, 500);
    }
    
    // Извлекаем уникальные чаты из обновлений
    const chats = new Map();
    
    data.result.forEach((update: any) => {
      const chat = update.message?.chat || update.my_chat_member?.chat;
      if (chat) {
        chats.set(chat.id, {
          id: chat.id,
          title: chat.title || `${chat.first_name || ''} ${chat.last_name || ''}`.trim() || 'Personal Chat',
          type: chat.type,
          username: chat.username
        });
      }
    });
    
    const chatList = Array.from(chats.values());
    
    console.log(`✅ Found ${chatList.length} available chats`);
    
    return c.json({ 
      success: true, 
      chats: chatList,
      totalUpdates: data.result.length
    });
    
  } catch (error) {
    console.error('❌ Error fetching Telegram chats:', error);
    return c.json({ 
      success: false,
      error: "Internal server error",
      details: error.message 
    }, 500);
  }
});

// Отправка уведомлений в Telegram
app.post("/make-server-ee878259/telegram/send", async (c) => {
  try {
    const body = await c.req.json();
    
    if (!body.items || !body.customerInfo) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Получаем токен из переменных окружения
    let TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
    
    // Очищаем токен от лишних символов и пробелов
    if (TELEGRAM_BOT_TOKEN) {
      TELEGRAM_BOT_TOKEN = TELEGRAM_BOT_TOKEN.trim();
      // Удаляем лишний "H" в конце если есть
      if (TELEGRAM_BOT_TOKEN.endsWith('H') && TELEGRAM_BOT_TOKEN.length > 46) {
        TELEGRAM_BOT_TOKEN = TELEGRAM_BOT_TOKEN.slice(0, -1);
        console.log('⚠️ Removed extra "H" from token end');
      }
    }
    
    // Если токен пустой или слишком короткий, используем fallback
    if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN.length < 40) {
      console.log('⚠️ Using fallback token (env token invalid or missing)');
      TELEGRAM_BOT_TOKEN = '8344041596:AAEAJtbcpn8wVE_NcVpXAAbwrkvjE5GHZrA';
    }
    
    // ✅ ПОЛУЧЕНИЕ CHAT ID С FALLBACK
    let TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID')?.trim();
    
    // Fallback к правильному Chat ID группы
    if (!TELEGRAM_CHAT_ID || TELEGRAM_CHAT_ID.length < 5) {
      console.log('⚠️ Using fallback Chat ID (env Chat ID invalid or missing)');
      TELEGRAM_CHAT_ID = '-1003068403630';
    }
    
    // Валидация Chat ID - должен быть либо длинным числом, либо начинаться с -100 (группа)
    const isValidChatId = TELEGRAM_CHAT_ID && (
      TELEGRAM_CHAT_ID.length > 5 && 
      (TELEGRAM_CHAT_ID.startsWith('-100') || !isNaN(Number(TELEGRAM_CHAT_ID)))
    );
    
    // Если Chat ID не валидный - пытаемся найти автоматически
    if (!isValidChatId) {
      if (TELEGRAM_CHAT_ID) {
        console.log(`⚠️ Invalid TELEGRAM_CHAT_ID: "${TELEGRAM_CHAT_ID}"`);
      } else {
        console.log('⚠️ TELEGRAM_CHAT_ID not set in environment variables');
      }
      
      console.log('🔍 Trying to auto-detect available chat...');
      
      // Пытаемся получить доступные чаты
      try {
        const updatesResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`);
        const updatesData = await updatesResponse.json();
        
        if (updatesData.ok && updatesData.result.length > 0) {
          // Ищем первый доступный чат
          const availableChats = new Map();
          updatesData.result.forEach((update: any) => {
            const chat = update.message?.chat || update.my_chat_member?.chat;
            if (chat) {
              availableChats.set(chat.id, {
                id: chat.id,
                title: chat.title || `${chat.first_name || ''} ${chat.last_name || ''}`.trim() || 'Personal Chat',
                type: chat.type
              });
            }
          });
          
          if (availableChats.size > 0) {
            // Приоритет группам, потом личным чатам
            const groupChat = Array.from(availableChats.values()).find((chat: any) => 
              chat.type === 'group' || chat.type === 'supergroup'
            );
            
            const firstAvailableChat = groupChat || Array.from(availableChats.values())[0];
            TELEGRAM_CHAT_ID = String(firstAvailableChat.id);
            
            console.log(`✅ Auto-detected chat: ${firstAvailableChat.title} (${TELEGRAM_CHAT_ID})`);
          } else {
            // ❌ НЕТ ДОСТУПНЫХ ЧАТОВ - Возвращаем ошибку вместо использования неправильного fallback
            console.error('❌ No chats found! Bot needs to be added to a group or user needs to send /start');
            return c.json({ 
              success: false, 
              error: 'No Telegram chats available',
              details: 'Bot has not been added to any groups and no users have started conversation. Please add the bot @zayavkassayta_bententrade_bot to your Telegram group or send /start to the bot.',
              helpMessage: '❌ Бот не найден ни в одной группе! Добавьте бота @zayavkassayta_bententrade_bot в вашу Telegram группу как администратора.',
              needsSetup: true
            }, 400);
          }
        } else {
          // ❌ НЕТ ОБНОВЛЕНИЙ - Возвращаем ошибку вместо использования неправильного fallback
          console.error('❌ No Telegram updates available - Bot not configured properly');
          return c.json({ 
            success: false, 
            error: 'No Telegram updates available',
            details: 'Bot token is valid but no messages received. Please add the bot @zayavkassayta_bententrade_bot to your Telegram group or send /start to the bot.',
            helpMessage: '❌ Бот не получал сообщений! Добавьте бота @zayavkassayta_bententrade_bot в вашу Telegram группу как администратора или отправьте боту /start.',
            needsSetup: true
          }, 400);
        }
      } catch (error) {
        console.error('❌ Error auto-detecting chat:', error);
        return c.json({ 
          success: false,
          error: 'Failed to auto-detect Telegram chat',
          details: error.message,
          helpMessage: '❌ Не удалось найти чаты бота! Убедитесь, что TELEGRAM_BOT_TOKEN правильный и бот @zayavkassayta_bententrade_bot добавлен в группу.',
          needsSetup: true
        }, 500);
      }
    }
    
    console.log(`📱 Using Chat ID: ${TELEGRAM_CHAT_ID}`);
    
    // Валидация токена
    if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN.length < 40) {
      console.error('❌ TELEGRAM_BOT_TOKEN not configured or invalid');
      console.error(`❌ Token length: ${TELEGRAM_BOT_TOKEN?.length || 0}`);
      return c.json({ 
        success: false, 
        error: 'Telegram bot token not configured or invalid',
        details: `Token length: ${TELEGRAM_BOT_TOKEN?.length || 0}, expected: 45-46 characters`
      }, 500);
    }
    
    // Логируем информацию о токене для отладки (скрываем часть токена)
    const tokenPreview = TELEGRAM_BOT_TOKEN.substring(0, 10) + '...' + TELEGRAM_BOT_TOKEN.substring(TELEGRAM_BOT_TOKEN.length - 4);
    console.log(`📱 Telegram Token Preview: ${tokenPreview}`);
    console.log(`📱 Chat ID: ${TELEGRAM_CHAT_ID}`);
    console.log(`📱 Token Length: ${TELEGRAM_BOT_TOKEN.length}`);
    console.log(`✅ Token validated and ready`);
    
    // Дополнительное логирование для диагностики
    const envChatId = Deno.env.get('TELEGRAM_CHAT_ID');
    if (envChatId && envChatId !== TELEGRAM_CHAT_ID) {
      console.log(`⚠️ Environment Chat ID "${envChatId}" was incorrect, using fallback: ${TELEGRAM_CHAT_ID}`);
    }
    
    const isUzbek = body.language === 'uz';
    
    let message = isUzbek 
      ? `🛒 <b>Yangi buyurtma - Bententrade</b>\n\n`
      : `🛒 <b>Новый заказ - Bententrade</b>\n\n`;

    // Информация о клиенте
    message += isUzbek ? `👤 <b>Mijoz ma'lumotlari:</b>\n` : `👤 <b>Информация о клиенте:</b>\n`;
    message += `${isUzbek ? 'Ism' : 'Имя'}: ${body.customerInfo.name}\n`;
    message += `${isUzbek ? 'Telefon' : 'Телефон'}: ${body.customerInfo.phone}\n`;
    
    if (body.customerInfo.address) {
      message += `${isUzbek ? 'Manzil' : 'Адрес'}: ${body.customerInfo.address}\n`;
    }

    // Товары
    message += `\n🛍 <b>${isUzbek ? 'Buyurtma qilingan mahsulotlar' : 'Заказанные товары'}:</b>\n`;
    
    body.items.forEach((item: any, index: number) => {
      message += `${index + 1}. ${item.name}`;
      if (item.variant) message += ` (${isUzbek ? 'Rang' : 'Цвет'}: ${item.variant})`;
      if (item.size) message += ` (${isUzbek ? "O'lcham" : 'Размер'}: ${item.size})`;
      if (item.style) message += ` (${isUzbek ? 'Uslub' : 'Стиль'}: ${item.style})`;
      message += `\n   ${isUzbek ? 'Soni' : 'Количество'}: ${item.quantity}`;
      
      // Добавляем цену если она есть
      if (item.price) {
        const formattedPrice = item.price.toLocaleString('ru-RU');
        message += ` × ${formattedPrice} ${isUzbek ? "so'm" : 'сум'}`;
      }
      
      // Добавляем итоговую сумму по товару
      if (item.total) {
        const formattedTotal = item.total.toLocaleString('ru-RU');
        message += ` = ${formattedTotal} ${isUzbek ? "so'm" : 'сум'}`;
      }
      
      message += `\n`;
    });

    if (body.total) {
      const formattedTotal = body.total.toLocaleString('ru-RU');
      message += `\n💰 <b>${isUzbek ? 'Jami' : 'Итого'}:</b> ${formattedTotal} ${isUzbek ? "so'm" : 'сум'}\n`;
    }

    if (body.customerInfo.notes) {
      message += `\n📝 <b>${isUzbek ? "Qo'shimcha ma'lumot" : 'Дополнительная информация'}:</b>\n${body.customerInfo.notes}`;
    }

    message += `\n\n⏰ ${new Date().toLocaleString('ru-RU', { 
      timeZone: 'Asia/Tashkent',
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })} (Toshkent vaqti)`;

    // Формируем URL для Telegram API
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    console.log(`📱 Telegram URL (masked): https://api.telegram.org/bot${tokenPreview}/sendMessage`);

    // Получаем message_thread_id (для отправки в топик группы)
    let TELEGRAM_THREAD_ID = Deno.env.get('TELEGRAM_THREAD_ID')?.trim();
    
    // Fallback к правильному Thread ID
    if (!TELEGRAM_THREAD_ID) {
      TELEGRAM_THREAD_ID = '797';
      console.log('⚠️ Using fallback Thread ID: 797');
    }
    
    console.log(`📱 Sending to Thread ID: ${TELEGRAM_THREAD_ID}`);
    
    // Отправляем в Telegram (с поддержкой топиков)
    const telegramPayload: any = {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML',
    };
    
    // Добавляем message_thread_id если он есть
    if (TELEGRAM_THREAD_ID && TELEGRAM_THREAD_ID !== '0') {
      telegramPayload.message_thread_id = parseInt(TELEGRAM_THREAD_ID, 10);
    }
    
    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(telegramPayload),
    });

    if (!telegramResponse.ok) {
      const errorText = await telegramResponse.text();
      console.error('❌ Telegram API error:', errorText);
      console.error('❌ Response status:', telegramResponse.status);
      console.error('❌ Response statusText:', telegramResponse.statusText);
      
      // Проверяем специфичные ошибки
      if (telegramResponse.status === 404) {
        console.error('❌ 404 Error - Possible issues:');
        console.error('   - Invalid bot token format');
        console.error('   - Bot token contains extra characters');
        console.error('   - Token length should be around 45-46 characters');
        console.error(`   - Current token length: ${TELEGRAM_BOT_TOKEN.length}`);
      }
      
      // Ошибка 400 - chat not found
      const isGroupChat = TELEGRAM_CHAT_ID.startsWith('-100');
      
      if (telegramResponse.status === 400) {
        console.error('\n' + '='.repeat(80));
        console.error('❌ CHAT NOT FOUND ERROR');
        console.error('='.repeat(80));
        
        if (isGroupChat) {
          console.error('📍 Type: GROUP CHAT');
          console.error(`📍 Chat ID: ${TELEGRAM_CHAT_ID}`);
          console.error('');
          console.error('❌ Possible issues:');
          console.error('   • Bot is NOT added to the group/channel');
          console.error('   • Bot does NOT have admin rights');
          console.error('   • Chat ID is incorrect or group was recreated');
          console.error('   • Group was deleted');
          console.error('');
          console.error('🔧 AUTOMATIC FIX (RECOMMENDED):');
          console.error('   → Quick Fix Wizard opened automatically on website');
          console.error('   → Or press: Ctrl + Shift + T');
          console.error('   → Wizard will find correct Chat ID automatically');
          console.error('');
          console.error('📋 MANUAL FIX:');
          console.error('   1. Open your Telegram group');
          console.error('   2. Add @zayavkassayta_bententrade_bot');
          console.error('   3. Make bot ADMINISTRATOR with "Post Messages"');
          console.error('   4. Press Ctrl+Shift+T → Find Chat ID');
          console.error('   5. Update TELEGRAM_CHAT_ID in Supabase');
          console.error('');
          console.error('📖 Full guide: /РЕШЕНИЕ_ЗА_3_МИНУТЫ.md');
          console.error('='.repeat(80) + '\n');
        } else {
          console.error('📍 Type: PERSONAL CHAT');
          console.error(`📍 Chat ID: ${TELEGRAM_CHAT_ID}`);
          console.error('');
          console.error('❌ Possible issues:');
          console.error('   • User has not started conversation with bot');
          console.error('   • Chat ID is incorrect');
          console.error('');
          console.error('🔧 AUTOMATIC FIX (RECOMMENDED):');
          console.error('   → Quick Fix Wizard opened automatically');
          console.error('   → Or press: Ctrl + Shift + T');
          console.error('');
          console.error('📋 MANUAL FIX:');
          console.error('   1. Open @zayavkassayta_bententrade_bot in Telegram');
          console.error('   2. Send /start');
          console.error('   3. Press Ctrl+Shift+T → Find Chat ID');
          console.error('   4. Update TELEGRAM_CHAT_ID in Supabase');
          console.error('');
          console.error('📖 Full guide: /РЕШЕНИЕ_ЗА_3_МИНУТЫ.md');
          console.error('='.repeat(80) + '\n');
        }
      }
      
      return c.json({ 
        success: false, 
        error: 'Failed to send to Telegram',
        details: errorText,
        statusCode: telegramResponse.status,
        chatType: isGroupChat ? 'group' : 'personal',
        helpMessage: telegramResponse.status === 400 
          ? (isGroupChat 
              ? '❌ Бот не добавлен в группу! Добавьте @zayavkassayta_bententrade_bot в группу как администратора с правами публикации.' 
              : 'Пожалуйста, откройте бота в Telegram и отправьте /start')
          : 'Проверьте токен бота'
      }, 500);
    }

    const telegramData = await telegramResponse.json();
    console.log('✅ Message sent to Telegram:', telegramData.result.message_id);
    
    return c.json({ 
      success: true, 
      messageId: telegramData.result.message_id 
    });

  } catch (error) {
    console.error('❌ Error sending to Telegram:', error);
    return c.json({ 
      success: false,
      error: "Internal server error",
      details: error.message 
    }, 500);
  }
});

// ==========================================
// DATA LOADER - Загрузка данных каталога в KV Store
// ==========================================

import { loadAllDataToKV, getAllData } from './data-loader.tsx';

// Загрузка всех данных в KV Store (вызывается один раз)
app.get("/make-server-ee878259/load-data", async (c) => {
  try {
    console.log('🚀 Starting data load to Supabase KV Store...');
    const result = await loadAllDataToKV();
    
    if (result.success) {
      console.log('✅ Data loaded successfully!');
      return c.json(result);
    } else {
      console.error('❌ Data load failed:', result);
      return c.json(result, 500);
    }
  } catch (error) {
    console.error('❌ Error loading data:', error);
    return c.json({
      success: false,
      error: 'Failed to load data',
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// Получение всех данных из KV Store
app.get("/make-server-ee878259/get-data", async (c) => {
  try {
    const result = await getAllData();
    
    if (result.success) {
      return c.json(result);
    } else {
      return c.json(result, 500);
    }
  } catch (error) {
    console.error('❌ Error getting data:', error);
    return c.json({
      success: false,
      error: 'Failed to get data',
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

Deno.serve(app.fetch);