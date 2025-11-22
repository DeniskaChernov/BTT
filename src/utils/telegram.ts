// Telegram Bot API для отправки заявок через серверный API
import { projectId, publicAnonKey } from './supabase/info';

export interface OrderData {
  items: Array<{
    name: string;
    quantity: number;
    variant?: string;
    size?: string;
    style?: string;
  }>;
  customerInfo: {
    name: string;
    phone: string;
    address?: string;
    notes?: string;
  };
  total?: string;
  language: 'uz' | 'ru';
}

export interface ContactMessage {
  name: string;
  phone: string;
  message: string;
  type?: 'consultation' | 'order' | 'question';
  language?: 'uz' | 'ru';
}

/**
 * Отправка сообщения в Telegram через серверный API
 * Все токены и секреты хранятся безопасно на сервере
 */
async function sendTelegramMessage(messageData: any): Promise<boolean> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-ee878259/telegram/send`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(messageData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Telegram send error:', errorText);
      return false;
    }

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    return false;
  }
}

export async function sendOrderToTelegram(orderData: OrderData): Promise<boolean> {
  return sendTelegramMessage(orderData);
}

export async function sendContactMessage(messageData: ContactMessage): Promise<boolean> {
  // Подготавливаем данные в формате, который ожидает сервер
  const serverData = {
    items: [{
      name: `${messageData.type === 'consultation' ? '📞 Консультация' : messageData.type === 'order' ? '🛍️ Заказ' : '❓ Вопрос'}: ${messageData.message}`,
      quantity: 1
    }],
    customerInfo: {
      name: messageData.name,
      phone: messageData.phone,
      notes: messageData.message
    },
    language: messageData.language || 'ru'
  };
  
  return sendTelegramMessage(serverData);
}

export async function sendQuickConsultationRequest(data: { name: string; phone: string; message?: string }): Promise<boolean> {
  const messageData = {
    items: [{
      name: `📞 Запрос консультации`,
      quantity: 1
    }],
    customerInfo: {
      name: data.name,
      phone: data.phone,
      notes: data.message || 'Запрос быстрой консультации'
    },
    language: 'ru' as 'uz' | 'ru'
  };
  
  return sendTelegramMessage(messageData);
}