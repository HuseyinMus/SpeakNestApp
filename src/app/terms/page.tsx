'use client';

import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useLanguage } from '@/lib/context/LanguageContext';

export default function TermsPage() {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    {
      id: 'general',
      title: 'Genel Koşullar',
      content: `
        <p>SpeakNest platformunu kullanarak aşağıdaki koşulları kabul etmiş olursunuz:</p>
        <ul class="list-disc list-inside space-y-2 mt-4">
          <li>Platformu yasal amaçlar için kullanacağınızı</li>
          <li>Diğer kullanıcıların haklarına saygı göstereceğinizi</li>
          <li>Platformun güvenliğini tehlikeye atmayacağınızı</li>
          <li>Telif hakkı ve fikri mülkiyet haklarına uyacağınızı</li>
        </ul>
      `,
    },
    {
      id: 'account',
      title: 'Hesap Yönetimi',
      content: `
        <p>Hesap yönetimi ile ilgili önemli bilgiler:</p>
        <ul class="list-disc list-inside space-y-2 mt-4">
          <li>Hesap bilgilerinizin doğruluğundan siz sorumlusunuz</li>
          <li>Hesabınızın güvenliğini sağlamak sizin sorumluluğunuzdadır</li>
          <li>Şüpheli aktiviteleri derhal bildirmelisiniz</li>
          <li>Hesabınızı başkalarıyla paylaşmamalısınız</li>
        </ul>
      `,
    },
    {
      id: 'content',
      title: 'İçerik Kullanımı',
      content: `
        <p>Platform içeriğinin kullanımı ile ilgili kurallar:</p>
        <ul class="list-disc list-inside space-y-2 mt-4">
          <li>İçerikler telif hakkı ile korunmaktadır</li>
          <li>İçerikleri ticari amaçla kullanamazsınız</li>
          <li>İçerikleri değiştiremez veya dağıtamazsınız</li>
          <li>Kaynak göstererek alıntı yapabilirsiniz</li>
        </ul>
      `,
    },
    {
      id: 'privacy',
      title: 'Gizlilik ve Veri Kullanımı',
      content: `
        <p>Gizlilik ve veri kullanımı politikamız:</p>
        <ul class="list-disc list-inside space-y-2 mt-4">
          <li>Kişisel verileriniz güvenle saklanır</li>
          <li>Verileriniz yalnızca belirtilen amaçlar için kullanılır</li>
          <li>Üçüncü taraflarla paylaşılmaz</li>
          <li>Veri güvenliği için gerekli önlemler alınır</li>
        </ul>
      `,
    },
    {
      id: 'subscription',
      title: 'Abonelik ve Ödemeler',
      content: `
        <p>Abonelik ve ödeme koşulları:</p>
        <ul class="list-disc list-inside space-y-2 mt-4">
          <li>Abonelikler otomatik olarak yenilenir</li>
          <li>İptal işlemi 24 saat önce yapılmalıdır</li>
          <li>Ödemeler güvenli ödeme sistemleri üzerinden alınır</li>
          <li>İade politikası KVKK uyarınca uygulanır</li>
        </ul>
      `,
    },
    {
      id: 'termination',
      title: 'Hesap Sonlandırma',
      content: `
        <p>Hesap sonlandırma koşulları:</p>
        <ul class="list-disc list-inside space-y-2 mt-4">
          <li>Kuralların ihlali durumunda hesap kapatılabilir</li>
          <li>Uzun süre kullanılmayan hesaplar pasife alınabilir</li>
          <li>Hesap kapatma talepleri 30 gün içinde işleme alınır</li>
          <li>Verileriniz KVKK uyarınca saklanır veya silinir</li>
        </ul>
      `,
    },
  ];

  const toggleSection = (sectionId: string) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-slate-900 py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 via-purple-600/50 to-pink-600/50" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b8?w=1920&h=1080&fit=crop')] bg-cover bg-center mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Kullanım Koşulları
          </h1>
          <p className="text-xl text-slate-200 max-w-3xl mx-auto">
            SpeakNest platformunu kullanırken uymanız gereken kurallar ve koşullar.
          </p>
        </div>
      </div>

      {/* Terms Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-4">
            {sections.map((section) => (
              <div
                key={section.id}
                className="border border-slate-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-6 bg-slate-50 hover:bg-slate-100 transition-colors duration-300"
                >
                  <h2 className="text-xl font-semibold text-slate-900">
                    {section.title}
                  </h2>
                  {activeSection === section.id ? (
                    <FiChevronUp className="w-6 h-6 text-slate-600" />
                  ) : (
                    <FiChevronDown className="w-6 h-6 text-slate-600" />
                  )}
                </button>
                {activeSection === section.id && (
                  <div className="p-6 border-t border-slate-200">
                    <div
                      className="prose prose-slate max-w-none"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Last Updated */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Son güncelleme: 15 Mart 2024
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 text-center">
          <p className="text-slate-600">
            Kullanım koşulları hakkında sorularınız için{' '}
            <a
              href="/contact"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              iletişim
            </a>{' '}
            sayfamızı ziyaret edebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
} 