import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer@9.13.1';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Check, Star, ChevronLeft, ChevronRight } from '../utils/lucide-stub';
import { useState } from 'react';
import { Badge } from './ui/badge';
import { ProductFilter } from './ProductFilter';

// Импорт изображений кашпо 5л с ручкой
import kashpo5lBeigeWithHandle from 'figma:asset/aaa3f6c434f81fb8787b230c4e80ff40a3ff1805.png';
import kashpo5lGrayWithHandle from 'figma:asset/734c7fe27be9c768b54eb373aeac20283920d105.png';
import kashpo5lWhiteBirchWithHandle from 'figma:asset/5701c82eee99edfcfac44cfab9b4fa6a6b5cdb96.png';
// Импорт изображений для остальных кашпо
import kashpoBeige from 'figma:asset/0b7c7dcc56f444de68a9e6496bc108a610b7c82f.png';
import kashpo5lGray from 'figma:asset/e8de77f3d28f94c652df287a8da1004169f8162e.png';
import kashpo5lDarkGray from 'figma:asset/114bfc7a118b6cf373f80f044aa151482b15fa44.png';

interface ColorVariant {
  id: string;
  name: string;
  images: string[];
  color: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  features?: string[];
  variants?: ColorVariant[];
  category: string;
  size?: string;
  style?: string;
  dimensions?: {
    height: number; // в мм
    diameter: number; // в мм
  };
}

interface CatalogProps {
  onAddToCart: (product: Product & { selectedVariant?: ColorVariant; selectedImageIndex?: number }) => void;
}

export function Catalog({ onAddToCart }: CatalogProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Состояния для фильтрации и управления
  const [selectedVariants, setSelectedVariants] = useState<{[key: string]: string}>({});
  const [selectedImages, setSelectedImages] = useState<{[key: string]: number}>({});
  const [colorFilter, setColorFilter] = useState<string>('all');
  const [sizeFilter, setSizeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  // Цветовые варианты для кашпо 5л с ручкой (без коричневого)
  const colorVariants5lWithHandle: ColorVariant[] = [
    {
      id: 'beige',
      name: 'Бежевый',
      images: [
        kashpo5lBeigeWithHandle,
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      color: '#D2B48C'
    },
    {
      id: 'gray',
      name: 'Серый',
      images: [
        kashpo5lGrayWithHandle,
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1493925410384-84f842e616fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      color: '#A9A9A9'
    },
    {
      id: 'white-birch',
      name: 'Белая берёзка',
      images: [
        kashpo5lWhiteBirchWithHandle,
        'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      color: '#F5F5F0'
    }
  ];

  // Цветовые варианты для остальных кашпо (10л, 16л и т.д.)
  const colorVariantsOther: ColorVariant[] = [
    {
      id: 'beige',
      name: 'Бежевый',
      images: [
        kashpoBeige,
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      color: '#D2B48C'
    },
    {
      id: 'gray',
      name: 'Серый',
      images: [
        kashpo5lGray,
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1493925410384-84f842e616fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      color: '#A9A9A9'
    },
    {
      id: 'white-birch',
      name: 'Белая берёзка',
      images: [
        kashpo5lDarkGray,
        'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      color: '#F5F5F0'
    },
    {
      id: 'brown',
      name: 'Коричневый',
      images: [
        'https://images.unsplash.com/photo-1565672850526-ba956f6fc6fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwYnJvd24lMjByYXR0YW4lMjBiYXNrZXR8ZW58MXx8fHwxNzU5NDI1MDI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1572796078439-ad087023b3b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMHdvdmVuJTIwYmFza2V0JTIwcGxhbnRlcnxlbnwxfHx8fDE3NTk0MjQ5NTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1493925410384-84f842e616fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&sat=-20&hue=30'
      ],
      color: '#8B4513'
    }
  ];

  const products: Product[] = [
    {
      id: '1',
      name: 'Ротанговая нить',
      description: 'Высококачественная искусственная ротанговая нить различных цветов и длины',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      features: ['Различные цвета', 'Разная длина', 'Прочные материалы'],
      category: 'materials'
    },
    {
      id: '2',
      name: 'Кашпо 5л с ручкой',
      description: 'Стильное плетёное кашпо объёмом 5 литров с удобной ручкой в различных цветах',
      image: colorVariants5lWithHandle[0].images[0],
      features: ['Объём 5 литров', 'Удобная ручка', 'Натуральный дизайн', 'Различные цвета'],
      variants: colorVariants5lWithHandle,
      category: 'kashpo',
      size: '5л',
      style: 'с ручкой',
      dimensions: {
        height: 255,
        diameter: 290
      }
    },
    {
      id: '3',
      name: 'Кашпо 10л Классика',
      description: 'Классическое большое кашпо объёмом 10 литров с традиционным плетением',
      image: colorVariantsOther[0].images[0],
      features: ['Объём 10 литров', 'Классический дизайн', 'Традиционное плетение', 'Различные цвета'],
      variants: colorVariantsOther,
      category: 'kashpo',
      size: '10л',
      style: 'Классика',
      dimensions: {
        height: 240,
        diameter: 310
      }
    },
    {
      id: '4',
      name: 'Кашпо 10л Пухляш',
      description: 'Объёмное кашпо "Пухляш" на 10 литров с округлыми формами и мягким плетением',
      image: colorVariantsOther[0].images[0],
      features: ['Объём 10 литров', 'Округлые формы', 'Мягкое плетение', 'Различные цвета'],
      variants: colorVariantsOther,
      category: 'kashpo',
      size: '10л',
      style: 'Пухляш',
      dimensions: {
        height: 240,
        diameter: 330
      }
    },
    {
      id: '5',
      name: 'Кашпо 16л Классика',
      description: 'Большое классическое кашпо объёмом 16 литров для крупных растений',
      image: colorVariantsOther[0].images[0],
      features: ['Объём 16 литров', 'Для крупных растений', 'Классический стиль', 'Различные цвета'],
      variants: colorVariantsOther,
      category: 'kashpo',
      size: '16л',
      style: 'Классика',
      dimensions: {
        height: 285,
        diameter: 350
      }
    },
    {
      id: '6',
      name: 'Кашпо 16л Пухляш',
      description: 'Очень большое кашпо "Пухляш" на 16 литров с мягкими округлыми формами',
      image: colorVariantsOther[0].images[0],
      features: ['Объём 16 литров', 'Мягкие округлые формы', 'Для больших растений', 'Различные цвета'],
      variants: colorVariantsOther,
      category: 'kashpo',
      size: '16л',
      style: 'Пухляш',
      dimensions: {
        height: 280,
        diameter: 360
      }
    }
  ];

  // Инициализация выбранных вариантов
  useState(() => {
    const initialVariants: {[key: string]: string} = {};
    const initialImages: {[key: string]: number} = {};
    products.forEach(product => {
      if (product.variants && product.variants.length > 0) {
        initialVariants[product.id] = product.variants[0].id;
        initialImages[product.id] = 0;
      }
    });
    setSelectedVariants(initialVariants);
    setSelectedImages(initialImages);
  });

  // Фильтрация товаров
  const filteredProducts = products.filter(product => {
    const matchesColor = colorFilter === 'all' || 
                        (product.variants && product.variants.some(v => v.id === colorFilter));
    
    const matchesSize = sizeFilter === 'all' || product.size === sizeFilter;
    
    return matchesColor && matchesSize;
  });

  // Сортировка товаров
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'size':
        if (!a.size || !b.size) return 0;
        const sizeA = parseInt(a.size);
        const sizeB = parseInt(b.size);
        return sizeA - sizeB;
      case 'size-desc':
        if (!a.size || !b.size) return 0;
        const sizeDescA = parseInt(a.size);
        const sizeDescB = parseInt(b.size);
        return sizeDescB - sizeDescA;
      default:
        return 0;
    }
  });

  const handleVariantChange = (productId: string, variantId: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: variantId
    }));
    setSelectedImages(prev => ({
      ...prev,
      [productId]: 0
    }));
  };

  const handleImageChange = (productId: string, imageIndex: number) => {
    setSelectedImages(prev => ({
      ...prev,
      [productId]: imageIndex
    }));
  };

  const handleAddToCart = (product: Product) => {
    const selectedVariant = product.variants?.find(v => v.id === selectedVariants[product.id]);
    const selectedImageIndex = selectedImages[product.id] || 0;
    
    onAddToCart({
      ...product,
      selectedVariant,
      selectedImageIndex,
      image: selectedVariant?.images[selectedImageIndex] || product.image
    });
  };

  const getCurrentImage = (product: Product) => {
    if (product.variants && selectedVariants[product.id]) {
      const selectedVariant = product.variants.find(v => v.id === selectedVariants[product.id]);
      const imageIndex = selectedImages[product.id] || 0;
      return selectedVariant?.images[imageIndex] || product.image;
    }
    return product.image;
  };

  const getImageGallery = (product: Product) => {
    if (product.variants && selectedVariants[product.id]) {
      const selectedVariant = product.variants.find(v => v.id === selectedVariants[product.id]);
      return selectedVariant?.images || [product.image];
    }
    return [product.image];
  };

  // Получение уникальных значений для фильтров
  const availableColors = Array.from(new Set(
    products.flatMap(p => p.variants?.map(v => v.id) || [])
  ));

  const availableSizes = Array.from(new Set(
    products.map(p => p.size).filter(Boolean)
  ));

  // Все доступные цветовые варианты (объединяем все варианты)
  const allColorVariants = [...colorVariants5lWithHandle, ...colorVariantsOther].filter(
    (variant, index, self) => 
      index === self.findIndex((v) => v.id === variant.id)
  );

  return (
    <section id="catalog" className="py-20 bg-white relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-100/30 to-orange-100/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-l from-amber-200/20 to-yellow-100/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
          >
            Каталог товаров
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={inView ? { opacity: 1, width: '100px' } : { opacity: 0, width: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 bg-gradient-to-r from-amber-600 to-amber-800 mx-auto rounded-full"
          />
        </div>

        {/* Новый компонент фильтра */}
        <ProductFilter
          colorFilter={colorFilter}
          onColorChange={setColorFilter}
          availableColors={availableColors}
          colorVariants={allColorVariants}
          sizeFilter={sizeFilter}
          onSizeChange={setSizeFilter}
          availableSizes={availableSizes}
          sortBy={sortBy}
          onSortChange={setSortBy}
          inView={inView}
        />
        
        {/* Товары */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12">
          {sortedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group"
            >
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-amber-100/50 bg-gradient-to-b from-white to-amber-50/30">
                <CardHeader className="p-0 relative overflow-hidden">
                  <div className="aspect-square overflow-hidden relative">
                    {/* Галерея изображений */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6 }}
                      className="w-full h-full relative"
                    >
                      <ImageWithFallback
                        src={getCurrentImage(product)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Навигация по изображениям */}
                      {product.variants && getImageGallery(product).length > 1 && (
                        <>
                          <button
                            onClick={() => handleImageChange(
                              product.id, 
                              selectedImages[product.id] > 0 
                                ? selectedImages[product.id] - 1 
                                : getImageGallery(product).length - 1
                            )}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ChevronLeft className="w-4 h-4 text-amber-700" />
                          </button>
                          
                          <button
                            onClick={() => handleImageChange(
                              product.id, 
                              selectedImages[product.id] < getImageGallery(product).length - 1 
                                ? selectedImages[product.id] + 1 
                                : 0
                            )}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ChevronRight className="w-4 h-4 text-amber-700" />
                          </button>

                          {/* Индикаторы изображений */}
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                            {getImageGallery(product).map((_, imgIndex) => (
                              <button
                                key={imgIndex}
                                onClick={() => handleImageChange(product.id, imgIndex)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                  selectedImages[product.id] === imgIndex 
                                    ? 'bg-amber-600' 
                                    : 'bg-white/60 hover:bg-white/80'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </motion.div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <CardTitle className="group-hover:text-amber-700 transition-colors">
                      {product.name}
                    </CardTitle>
                    <div className="flex gap-1 ml-2">
                      {product.size && (
                        <Badge variant="outline" className="border-amber-200 text-amber-700 text-xs">
                          {product.size}
                        </Badge>
                      )}
                      {product.style && (
                        <Badge variant="outline" className="border-blue-200 text-blue-700 text-xs">
                          {product.style}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Размеры кашпо */}
                  {product.dimensions && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                      transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                      className="mb-4 p-3 bg-amber-50/50 rounded-xl border border-amber-200/30"
                    >
                      <div className="flex items-center justify-around text-xs">
                        <div className="text-center">
                          <div className="text-amber-700 font-medium mb-1">
                            Высота
                          </div>
                          <div className="text-foreground font-semibold">
                            {product.dimensions.height} мм
                          </div>
                        </div>
                        <div className="w-px h-8 bg-amber-300" />
                        <div className="text-center">
                          <div className="text-amber-700 font-medium mb-1">
                            Диаметр
                          </div>
                          <div className="text-foreground font-semibold">
                            {product.dimensions.diameter} мм
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Селектор цвета для кашпо с вариантами */}
                  {product.variants && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                      className="mb-4"
                    >
                      <p className="text-sm font-medium mb-3 text-amber-700">Выберите цвет:</p>
                      <div className="flex gap-2 flex-wrap">
                        {product.variants.map((variant, variantIndex) => (
                          <motion.button
                            key={variant.id}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 + variantIndex * 0.05 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleVariantChange(product.id, variant.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs border transition-all duration-300 ${
                              selectedVariants[product.id] === variant.id
                                ? 'border-amber-700 bg-amber-50 text-amber-700 shadow-md'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-amber-300 hover:bg-amber-25'
                            }`}
                          >
                            <div
                              className="w-4 h-4 rounded-full border-2 border-white shadow-md"
                              style={{ backgroundColor: variant.color }}
                            />
                            {variant.name}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  
                  {product.features && (
                    <motion.ul className="text-sm text-muted-foreground space-y-2">
                      {product.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                          transition={{ duration: 0.4, delay: (index * 0.1) + (featureIndex * 0.05) }}
                          className="flex items-center group-hover:text-amber-700 transition-colors"
                        >
                          <motion.div
                            whileHover={{ scale: 1.2, rotate: 360 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Check className="w-4 h-4 text-amber-600 mr-2 flex-shrink-0" />
                          </motion.div>
                          {feature}
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </CardContent>
                
                <CardFooter className="p-6 pt-0">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full"
                  >
                    <Button 
                      className="w-full bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white transition-all duration-300 hover:shadow-lg"
                      onClick={() => handleAddToCart(product)}
                    >
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        Заказать
                      </motion.span>
                    </Button>
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Сообщение об отсутствии результатов */}
        {sortedProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 mt-12"
          >
            <p className="text-muted-foreground text-lg">
              По вашему запросу товары не найдены
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setColorFilter('all');
                setSizeFilter('all');
              }}
              className="mt-4 border-amber-200 hover:bg-amber-50 text-amber-700"
            >
              Сбросить фильтры
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}