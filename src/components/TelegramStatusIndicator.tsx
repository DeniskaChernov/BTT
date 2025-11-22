import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { MessageCircle, CheckCircle, XCircle, AlertCircle, RefreshCw, Send } from '../utils/lucide-stub';

interface TelegramStatusIndicatorProps {
  compact?: boolean;
  showTestButton?: boolean;
  onOpenSetup?: () => void;
}

export function TelegramStatusIndicator({ 
  compact = false, 
  showTestButton = true,
  onOpenSetup 
}: TelegramStatusIndicatorProps) {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error' | 'not_configured'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [chatInfo, setChatInfo] = useState<{ chatId: string; isGroup: boolean } | null>(null);

  const BOT_TOKEN = '8344041596:AAEAJtbcpn8wVE_NcVpXAAbwrkvjE5GHZrA';
  const CHAT_ID = '-1003068403630';

  const checkTelegramConnection = async () => {
    setStatus('checking');
    try {
      // Проверяем, может ли бот отправлять сообщения в чат
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getChat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID })
      });

      const data = await response.json();

      if (data.ok) {
        setStatus('connected');
        setChatInfo({
          chatId: CHAT_ID,
          isGroup: CHAT_ID.startsWith('-100')
        });
      } else {
        console.error('❌ Telegram getChat error:', data);
        setStatus('error');
      }
    } catch (error) {
      console.error('❌ Telegram connection check failed:', error);
      setStatus('error');
    } finally {
      setLastCheck(new Date());
    }
  };

  const sendTestMessage = async () => {
    setIsTesting(true);
    try {
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: `🧪 Тестовое сообщение\n\n✅ Интеграция Telegram работает корректно!\n\n⏰ ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' })}\n\nBententrade`,
          parse_mode: 'HTML'
        })
      });

      const data = await response.json();

      if (data.ok) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-6 right-6 p-4 rounded-2xl shadow-lg z-[9999] glass-effect border-green-400/20 text-green-400';
        notification.innerHTML = `
          <div class="flex items-center gap-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <div>
              <div class="font-semibold">✅ Тест успешен!</div>
              <div class="text-sm opacity-80">Сообщение отправлено в Telegram</div>
            </div>
          </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);

        setStatus('connected');
      } else {
        throw new Error(data.description || 'Failed to send test message');
      }
    } catch (error: any) {
      console.error('❌ Test message failed:', error);
      
      const notification = document.createElement('div');
      notification.className = 'fixed top-6 right-6 p-4 rounded-2xl shadow-lg z-[9999] glass-effect border-red-400/20 text-red-400';
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <div>
            <div class="font-semibold">❌ Ошибка отправки</div>
            <div class="text-sm opacity-80">${error.message}</div>
          </div>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 5000);

      setStatus('error');
    } finally {
      setIsTesting(false);
    }
  };

  useEffect(() => {
    checkTelegramConnection();
    
    // Периодическая проверка каждые 5 минут
    const interval = setInterval(checkTelegramConnection, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Badge 
          variant={status === 'connected' ? 'default' : status === 'error' ? 'destructive' : 'secondary'}
          className="flex items-center gap-1.5 px-3 py-1.5"
        >
          {status === 'checking' && <RefreshCw className="w-3 h-3 animate-spin" />}
          {status === 'connected' && <CheckCircle className="w-3 h-3" />}
          {status === 'error' && <XCircle className="w-3 h-3" />}
          {status === 'not_configured' && <AlertCircle className="w-3 h-3" />}
          <span className="text-xs">
            {status === 'checking' && 'Проверка...'}
            {status === 'connected' && 'Telegram ✓'}
            {status === 'error' && 'Telegram ✗'}
            {status === 'not_configured' && 'Настройте Telegram'}
          </span>
        </Badge>
        
        {status === 'error' && onOpenSetup && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenSetup}
            className="h-7 px-2 text-xs"
          >
            Настроить
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="glass-card border-primary/10 p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              status === 'connected' ? 'bg-green-400/10' : 
              status === 'error' ? 'bg-red-400/10' : 
              'bg-amber-400/10'
            }`}>
              <MessageCircle className={`w-5 h-5 ${
                status === 'connected' ? 'text-green-400' : 
                status === 'error' ? 'text-red-400' : 
                'text-amber-400'
              }`} />
            </div>
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                Статус Telegram
                {status === 'checking' && <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />}
              </h3>
              {lastCheck && (
                <p className="text-xs text-muted-foreground">
                  Последняя проверка: {lastCheck.toLocaleTimeString('ru-RU')}
                </p>
              )}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={checkTelegramConnection}
            disabled={status === 'checking'}
            className="rounded-xl"
          >
            <RefreshCw className={`w-4 h-4 ${status === 'checking' ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Status Display */}
        <AnimatePresence mode="wait">
          {status === 'connected' && (
            <motion.div
              key="connected"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-4 bg-green-400/5 border border-green-400/20 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-green-400 mb-1">✅ Подключено</div>
                  <div className="text-sm text-muted-foreground">
                    Заказы будут отправляться в Telegram {chatInfo?.isGroup ? 'группу' : 'чат'}
                  </div>
                  {chatInfo && (
                    <div className="text-xs text-muted-foreground mt-2 font-mono opacity-60">
                      Chat ID: {chatInfo.chatId}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-4 bg-red-400/5 border border-red-400/20 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-red-400 mb-1">❌ Ошибка подключения</div>
                  <div className="text-sm text-muted-foreground mb-3">
                    {chatInfo?.isGroup 
                      ? 'Бот не добавлен в группу или не имеет прав администратора'
                      : 'Не удается подключиться к Telegram. Проверьте настройки.'
                    }
                  </div>
                  {onOpenSetup && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onOpenSetup}
                      className="rounded-xl border-red-400/20 text-red-400 hover:bg-red-400/10"
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Открыть помощник настройки
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {status === 'not_configured' && (
            <motion.div
              key="not-configured"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-4 bg-amber-400/5 border border-amber-400/20 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-amber-400 mb-1">⚠️ Требуется настройка</div>
                  <div className="text-sm text-muted-foreground mb-3">
                    Telegram бот не настроен. Заказы не будут отправляться.
                  </div>
                  {onOpenSetup && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onOpenSetup}
                      className="rounded-xl border-amber-400/20 text-amber-400 hover:bg-amber-400/10"
                    >
                      Настроить сейчас
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Test Button */}
        {showTestButton && status === 'connected' && (
          <Button
            onClick={sendTestMessage}
            disabled={isTesting}
            className="w-full rounded-xl"
            variant="outline"
          >
            {isTesting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Отправка...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Отправить тестовое сообщение
              </>
            )}
          </Button>
        )}

        {/* Help Text */}
        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-primary/5">
          <p>💡 Горячая клавиша для помощника: <kbd className="px-1.5 py-0.5 bg-black/20 rounded text-[10px]">Ctrl+Shift+T</kbd></p>
          <p>📱 Бот: @zayavkassayta_bententrade_bot</p>
        </div>
      </div>
    </Card>
  );
}