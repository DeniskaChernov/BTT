import { useState, useMemo, useCallback, lazy, Suspense, useEffect, startTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from './components/ui/sonner';
import { LoadingSpinner } from './components/ui/loading-spinner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ScrollToTop } from './components/ScrollToTop';
import { LanguageProvider } from './utils/language-context';
import { SEOHead } from './components/SEOHead';
import { StructuredData } from './components/StructuredData';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { MiniCatalog } from './components/MiniCatalog';
import { WhyUs } from './components/WhyUs';
import { Reviews } from './components/Reviews';
import { Cart } from './components/Cart';
import { Contacts } from './components/Contacts';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';
import { LegalDocuments, LegalDocumentType } from './components/LegalDocuments';
import { TelegramQuickFixWizard } from './components/TelegramQuickFixWizard';
import { Button } from './components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './components/ui/dialog';
import { Input } from './components/ui/input';
import { Lock, Shield, AlertCircle, Sparkles } from './utils/lucide-stub';

// Optimized lazy loading with shorter timeout and retry mechanism
const Gallery = lazy(() => 
  import('./components/Gallery')
    .then(module => ({ default: module.Gallery }))
    .catch(() => ({ default: () => <div className="text-center p-8 text-muted-foreground">Галерея временно недоступна</div> }))
);
const Trend2025 = lazy(() => 
  import('./components/Trend2025')
    .then(module => ({ default: module.Trend2025 }))
    .catch(() => ({ default: () => <div className="text-center p-8 text-muted-foreground">Раздел временно недоступен</div> }))
);
const CatalogPage = lazy(() => 
  import('./components/CatalogPage')
    .then(module => ({ default: module.CatalogPage }))
    .catch(() => ({ default: () => <div className="text-center p-8 text-muted-foreground">Каталог временно недоступен</div> }))
);
const AdminPanel = lazy(() => 
  import('./components/admin/AdminPanel')
    .then(module => ({ default: module.default }))
    .catch(() => ({ default: () => <div className="text-center p-8 text-muted-foreground">Админ-панель временно недоступна</div> }))
);

interface ColorVariant {
  id: string;
  name: string;
  image: string;
  color: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  selectedVariant?: ColorVariant;
  selectedImageIndex?: number;
  size?: string;
  style?: string;
  category?: string; // 'materials' для ротанга, иначе кашпо
}

interface CartItem extends Product {
  quantity: number;
}

// Современный компонент для админ-логина
function ModernAdminLogin({ isOpen, onClose, onLogin }: { isOpen: boolean; onClose: () => void; onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const ADMIN_PASSWORD = 'admin2024';
  const MAX_ATTEMPTS = 3;
  const LOCKOUT_TIME = 30000;

  const showNotification = (message: string, type: 'success' | 'error' = 'error') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-6 right-6 p-4 rounded-2xl shadow-lg z-[9999] transition-all duration-500 max-w-sm glass-effect ${
      type === 'success' 
        ? 'border-green-400/20 text-green-400' 
        : 'border-red-400/20 text-red-400'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
      }
    }, 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      showNotification('Вход заблокирован. Попробуйте позже.');
      return;
    }
    
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (password === ADMIN_PASSWORD) {
      showNotification('Добро пожаловать в админ-панель! ✨', 'success');
      setPassword('');
      setAttempts(0);
      setIsLoading(false);
      onLogin();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setIsLoading(false);
      
      if (newAttempts >= MAX_ATTEMPTS) {
        setIsLocked(true);
        showNotification(`Превышено количество попыток. Доступ заблокирован на ${LOCKOUT_TIME / 1000} секунд.`);
        
        setTimeout(() => {
          setIsLocked(false);
          setAttempts(0);
        }, LOCKOUT_TIME);
      } else {
        showNotification(`Неверный пароль. Осталось попыток: ${MAX_ATTEMPTS - newAttempts}`);
      }
      
      setPassword('');
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setPassword('');
      setAttempts(0);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent className="sm:max-w-md glass-effect border-primary/20">
            <DialogHeader className="space-y-4">
              <DialogTitle className="flex items-center justify-center gap-3 text-2xl">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="p-2 rounded-full bg-primary/10"
                >
                  <Shield className="w-6 h-6 text-primary" />
                </motion.div>
                <span className="text-gradient">Админ-панель</span>
              </DialogTitle>
              <DialogDescription className="text-center text-base opacity-80">
                Введите пароль для доступа к панели управления
              </DialogDescription>
            </DialogHeader>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >

              <div className="space-y-6">
                <motion.div 
                  className="flex items-center gap-3 p-4 glass-card rounded-xl border-amber-400/20"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <span className="text-sm text-amber-400/90">Доступ только для авторизованного персонала</span>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div 
                    className="space-y-3"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label htmlFor="admin-password" className="text-sm font-medium text-foreground/90">
                      Пароль администратора
                    </label>
                    <Input
                      id="admin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Введите пароль..."
                      disabled={isLoading || isLocked}
                      autoComplete="current-password"
                      className="glass-card border-primary/20 text-base h-12 rounded-xl"
                    />
                  </motion.div>

                  {attempts > 0 && !isLocked && (
                    <motion.div 
                      className="flex items-center gap-3 text-sm text-orange-400"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>Неверных попыток: {attempts} из {MAX_ATTEMPTS}</span>
                    </motion.div>
                  )}

                  {isLocked && (
                    <motion.div 
                      className="flex items-center gap-3 p-3 glass-card border-red-400/20 rounded-xl text-sm text-red-400"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      <Lock className="w-4 h-4" />
                      <span>Вход временно заблокирован</span>
                    </motion.div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      disabled={isLoading}
                      className="flex-1 h-12 rounded-xl glass-card border-primary/20 hover:border-primary/40 micro-interaction"
                    >
                      Отмена
                    </Button>
                    <Button
                      type="submit"
                      disabled={!password || isLoading || isLocked}
                      className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 micro-interaction neon-glow"
                    >
                      {isLoading ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Войти
                        </>
                      )}
                    </Button>
                  </div>
                </form>

                <motion.div 
                  className="text-xs text-center opacity-60 border-t border-primary/10 pt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 0.4 }}
                >
                  <Sparkles className="inline w-3 h-3 mr-1" />
                  Для демонстрации: пароль "admin2024"
                </motion.div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'catalog' | 'admin' | 'legal'>('home');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [currentLegalDocument, setCurrentLegalDocument] = useState<LegalDocumentType | null>(null);
  const [showTelegramHelper, setShowTelegramHelper] = useState(false);
  const [telegramError, setTelegramError] = useState<any>(null);

  // ✅ Обработка начальной навигации по URL (для SEO и прямых ссылок)
  useEffect(() => {
    const path = window.location.pathname;
    
    if (path === '/catalog') {
      startTransition(() => setCurrentPage('catalog'));
    } else {
      // Проверка юридических страниц: /privacy, /cookies, /terms, /company
      const legalPages: Record<string, LegalDocumentType> = {
        '/privacy': 'privacy',
        '/cookies': 'cookies',
        '/terms': 'terms',
        '/company': 'company'
      };

      if (legalPages[path]) {
        startTransition(() => {
          setCurrentLegalDocument(legalPages[path]);
          setCurrentPage('legal');
        });
      }
    }
  }, []);

  // ✅ SEO теги управляются компонентом <SEOHead /> - НЕ дублируем здесь!
  // Удалён дублирующий useEffect для мета-тегов

  const handleExitAdmin = useCallback(() => {
    setIsAdminMode(false);
    setIsAuthenticated(false);
    setCurrentPage('home');
  }, []);

  // Скрытые способы доступа к админ-панели
  useEffect(() => {
    const handleKeyboardAccess = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setShowAdminLogin(true);
      }
      
      // Горячая клавиша для Telegram Helper: Ctrl+Shift+T
      if (e.ctrlKey && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        setShowTelegramHelper(true);
      }
      
      if (e.key === 'Escape' && isAdminMode) {
        handleExitAdmin();
      }
    };

    window.addEventListener('keydown', handleKeyboardAccess);
    return () => window.removeEventListener('keydown', handleKeyboardAccess);
  }, [isAdminMode, handleExitAdmin]);

  // Обработчик событий Telegram ошибок
  useEffect(() => {
    const handleTelegramSetup = (event: any) => {
      console.log('📥 Opening Telegram Setup Helper', event.detail);
      setTelegramError(event.detail?.error);
      setShowTelegramHelper(true);
    };

    window.addEventListener('openTelegramSetup' as any, handleTelegramSetup);
    return () => window.removeEventListener('openTelegramSetup' as any, handleTelegramSetup);
  }, []);

  const cartItemsCount = useMemo(() => 
    cartItems.reduce((sum, item) => sum + item.quantity, 0), 
    [cartItems]
  );

  const addToCart = useCallback((product: Product) => {
    setCartItems(prev => {
      const itemId = product.selectedVariant 
        ? `${product.id}-${product.selectedVariant.id}-${product.selectedImageIndex || 0}` 
        : product.id;
      
      const existingItem = prev.find(item => {
        const existingItemId = item.selectedVariant 
          ? `${item.id}-${item.selectedVariant.id}-${item.selectedImageIndex || 0}` 
          : item.id;
        return existingItemId === itemId;
      });

      // Для ротанга (materials) шаг увеличения 5кг, для кашпо - 1шт
      const isRattan = product.category === 'materials';
      const incrementStep = isRattan ? 5 : 1;
      const initialQuantity = isRattan ? 5 : 1;

      if (existingItem) {
        return prev.map(item => {
          const existingItemId = item.selectedVariant 
            ? `${item.id}-${item.selectedVariant.id}-${item.selectedImageIndex || 0}` 
            : item.id;
          return existingItemId === itemId
            ? { ...item, quantity: item.quantity + incrementStep }
            : item;
        });
      }
      return [...prev, { ...product, quantity: initialQuantity }];
    });
    setIsCartOpen(true);
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(item => {
        const itemId = item.selectedVariant 
          ? `${item.id}-${item.selectedVariant.id}-${item.selectedImageIndex || 0}` 
          : item.id;
        return itemId === id ? { ...item, quantity } : item;
      })
    );
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCartItems(prev => prev.filter(item => {
      const itemId = item.selectedVariant 
        ? `${item.id}-${item.selectedVariant.id}-${item.selectedImageIndex || 0}` 
        : item.id;
      return itemId !== id;
    }));
  }, []);

  const handleNavigate = useCallback((page: 'home' | 'catalog' | 'admin') => {
    startTransition(() => {
      setCurrentPage(page);
      setCurrentLegalDocument(null);
    });
    // Use smooth scrolling to reduce render blocking
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleLogoSecretAccess = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if ('shiftKey' in e && e.shiftKey) {
      e.preventDefault();
      setShowAdminLogin(true);
      return;
    }
  }, []);

  const handleLogoLongPress = useCallback(() => {
    setShowAdminLogin(true);
  }, []);

  const handleAdminLogin = useCallback(() => {
    setIsAuthenticated(true);
    setIsAdminMode(true);
    setShowAdminLogin(false);
    setCurrentPage('admin');
  }, []);

  const handleCartClick = useCallback(() => setIsCartOpen(true), []);
  const handleCartClose = useCallback(() => setIsCartOpen(false), []);

  const handleLegalDocumentClick = useCallback((type: LegalDocumentType) => {
    startTransition(() => {
      setCurrentLegalDocument(type);
      setCurrentPage('legal');
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBackFromLegal = useCallback(() => {
    startTransition(() => {
      setCurrentPage('home');
      setCurrentLegalDocument(null);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleViewPrivacyPolicy = useCallback(() => {
    handleLegalDocumentClick('privacy');
  }, [handleLegalDocumentClick]);

  // Оптимизированный фон с упрощенными эффектами
  const ModernBackground = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Основной градиент */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Упрощенные статичные эффекты */}
      <div 
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #D4A574 0%, transparent 70%)' }}
      />
      
      <div 
        className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-8"
        style={{ background: 'radial-gradient(circle, #F5F3F0 0%, transparent 60%)' }}
      />
      
      <div 
        className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full opacity-6"
        style={{ background: 'radial-gradient(circle, #D4A574 0%, transparent 50%)' }}
      />
    </div>
  );

  const LazyLoadError = ({ error }: { error?: Error }) => (
    <div className="flex items-center justify-center min-h-96 p-8">
      <div className="text-center glass-card p-8 rounded-2xl max-w-md">
        <p className="text-muted-foreground mb-2">Компонент временно недоступен</p>
        <p className="text-xs text-muted-foreground/60 mb-4">
          {error?.message || 'Попробуйте обновить страницу'}
        </p>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline"
          className="micro-interaction"
          size="sm"
        >
          Обновить страницу
        </Button>
      </div>
    </div>
  );

  // Админ-панель
  if (currentPage === 'admin' && isAuthenticated) {
    return (
      <LanguageProvider>
        <ErrorBoundary>
          <Header 
            cartItems={cartItemsCount} 
            onCartClick={handleCartClick}
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onLogoSecretAccess={handleLogoSecretAccess}
            onLogoLongPress={handleLogoLongPress}
            isAdminMode={isAdminMode}
          />
          
          <div className="min-h-screen">
            <ModernBackground />
            
            <motion.div 
              className="fixed top-0 left-0 right-0 glass-effect border-b border-red-400/20 text-red-400 text-center py-2 text-sm z-50"
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" />
                Режим администратора | Нажмите ESC для выхода
              </div>
            </motion.div>
            
            <div className="pt-16 relative z-10">
              <Suspense fallback={
                <div className="container mx-auto px-4 py-16">
                  <LoadingSpinner size="lg" text="Загрузка админ-панели..." />
                </div>
              }>
                <ErrorBoundary fallback={<LazyLoadError />}>
                  <AdminPanel onExit={handleExitAdmin} />
                </ErrorBoundary>
              </Suspense>
            </div>
            
            <Toaster />
          </div>
        </ErrorBoundary>
      </LanguageProvider>
    );
  }

  // Страница каталога
  if (currentPage === 'catalog') {
    return (
      <LanguageProvider>
        <ErrorBoundary>
          <SEOHead page="catalog" />
          <StructuredData type="catalog" />
          
          <Header 
            cartItems={cartItemsCount} 
            onCartClick={handleCartClick}
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onLogoSecretAccess={handleLogoSecretAccess}
            onLogoLongPress={handleLogoLongPress}
            isAdminMode={isAdminMode}
          />
          
          <div className="min-h-screen">
            <ModernBackground />
            
            <main className="pt-20 relative z-10">
              <Suspense fallback={
                <div className="container mx-auto px-4 py-8">
                  <LoadingSpinner size="lg" text="Загрузка каталога..." />
                </div>
              }>
                <ErrorBoundary fallback={<LazyLoadError />}>
                  <CatalogPage 
                    onAddToCart={addToCart}
                    onBackToHome={() => handleNavigate('home')}
                  />
                </ErrorBoundary>
              </Suspense>
            </main>

            <Cart
              isOpen={isCartOpen}
              onClose={handleCartClose}
              items={cartItems}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
            />

            <ScrollToTop />
            <Toaster />
          </div>
        </ErrorBoundary>
      </LanguageProvider>
    );
  }

  // Страница юридических документов
  if (currentPage === 'legal' && currentLegalDocument) {
    return (
      <LanguageProvider>
        <ErrorBoundary>
          <SEOHead page="legal" />
          <StructuredData type="home" />
          
          <Header 
            cartItems={cartItemsCount} 
            onCartClick={handleCartClick}
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onLogoSecretAccess={handleLogoSecretAccess}
            onLogoLongPress={handleLogoLongPress}
            isAdminMode={isAdminMode}
          />
          
          <div className="min-h-screen">
            <ModernBackground />
            
            <main className="relative z-10">
              <LegalDocuments 
                type={currentLegalDocument}
                onBack={handleBackFromLegal}
              />
            </main>

            <Cart
              isOpen={isCartOpen}
              onClose={handleCartClose}
              items={cartItems}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
            />

            <ScrollToTop />
            <Toaster />
          </div>
        </ErrorBoundary>
      </LanguageProvider>
    );
  }

  // Главная страница
  return (
    <LanguageProvider>
      <ErrorBoundary>
        <SEOHead page="home" />
        <StructuredData type="home" />
        
        <Header 
          cartItems={cartItemsCount} 
          onCartClick={handleCartClick}
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onLogoSecretAccess={handleLogoSecretAccess}
          onLogoLongPress={handleLogoLongPress}
          isAdminMode={isAdminMode}
        />
        
        <div className="min-h-screen">
          <ModernBackground />
          
          <main className="relative z-10">
            <Hero onViewCatalog={() => handleNavigate('catalog')} />
            <About />
            
            <Suspense fallback={
              <section className="py-24">
                <div className="container mx-auto px-4">
                  <LoadingSpinner text="Загрузка тренда 2025..." />
                </div>
              </section>
            }>
              <ErrorBoundary fallback={<LazyLoadError />}>
                <Trend2025 />
              </ErrorBoundary>
            </Suspense>

            <MiniCatalog 
              onAddToCart={addToCart} 
              onViewFullCatalog={() => handleNavigate('catalog')}
            />
            <WhyUs />
            
            <Suspense fallback={
              <section className="py-24">
                <div className="container mx-auto px-4">
                  <LoadingSpinner text="Загрузка галереи..." />
                </div>
              </section>
            }>
              <ErrorBoundary fallback={<LazyLoadError />}>
                <Gallery />
              </ErrorBoundary>
            </Suspense>

            <FAQ />
            <Reviews />
            <Contacts />
          </main>

          <Footer onLegalDocumentClick={handleLegalDocumentClick} />

          <Cart
            isOpen={isCartOpen}
            onClose={handleCartClose}
            items={cartItems}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
          />

          <CookieBanner onViewPrivacyPolicy={handleViewPrivacyPolicy} />

          <ModernAdminLogin
            isOpen={showAdminLogin}
            onClose={() => setShowAdminLogin(false)}
            onLogin={handleAdminLogin}
          />

          <TelegramQuickFixWizard
            isOpen={showTelegramHelper}
            onClose={() => setShowTelegramHelper(false)}
            error={telegramError}
          />

          <ScrollToTop />
          <Toaster />
          
          {isAdminMode && (
            <motion.div 
              className="fixed bottom-4 right-4 w-3 h-3 bg-red-400 rounded-full opacity-50 pointer-events-none neon-glow"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>
      </ErrorBoundary>
    </LanguageProvider>
  );
}