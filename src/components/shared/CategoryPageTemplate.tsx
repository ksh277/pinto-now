import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: string | number;
  name: string;
  image: string;
  tags: string[];
  price: number;
}

interface CategoryPageProps {
  title?: string;
  subtitle?: string;
  description?: string;
  products: Product[];
  showFaq?: boolean;
  showInfo?: boolean;
  showCta?: boolean;
  mapping?: any;
  processSteps?: Array<{
    step: number;
    title: string;
    description: string;
  }>;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
}

export default function CategoryPageTemplate(props: CategoryPageProps) {
  const {
    title,
    subtitle,
    description,
    products,
    showFaq = true,
    showInfo = true,
    showCta = true,
    mapping,
    processSteps,
    faq
  } = props;

  const displayTitle = title || mapping?.categoryKo || '';
  const displaySubtitle = subtitle || mapping?.description || '';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <section className="py-12 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {displayTitle}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {displaySubtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="pt-6 pb-10 md:pt-8 md:pb-14">
        <div className="px-8 md:px-16">
          {products.length > 0 ? (
            <div className="md:grid md:grid-cols-4 md:gap-4 flex md:block overflow-x-auto md:overflow-visible gap-4 md:gap-0 pb-4 md:pb-0 scrollbar-hide px-4 md:px-0">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="block group"
                >
                  <div className="bg-white rounded-xl border-2 border-gray-100 p-3 md:p-4 hover:shadow-xl hover:border-blue-200 transition-all duration-300 relative w-[calc(100vw-3rem)] max-w-[350px] md:max-w-none md:w-auto flex-shrink-0 md:flex-shrink flex md:block gap-4 md:gap-0">
                    <div className="relative w-24 h-24 md:w-full md:h-80 flex-shrink-0 md:mb-3 overflow-hidden rounded-xl bg-gray-100 shadow-md">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-xl"></div>
                    </div>

                    <div className="space-y-1 md:space-y-2">
                      <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1 md:mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                        {product.name}
                      </h3>

                      <div className="space-y-1">
                        <div className="flex flex-wrap gap-1 mb-1 md:mb-2">
                          {product.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="pt-1 md:pt-2 border-t border-gray-100">
                        <span className="font-bold text-blue-600 text-base md:text-lg">
                          ~{product.price.toLocaleString()}원
                        </span>
                        <span className="text-xs text-gray-500 ml-1">부터</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-6">🚧</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  상품 준비중
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  현재 이 카테고리의 상품을 준비하고 있습니다.<br />
                  곧 다양한 상품으로 찾아뵙겠습니다.
                </p>
                <Button variant="outline">
                  <Link href="/all">다른 상품 보기</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}