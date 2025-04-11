'use client';

import { useLanguage } from '@/lib/context/LanguageContext';

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-8">
            {t('privacyTitle', 'Gizlilik Politikası')}
          </h1>

          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 mb-6">
              {t('privacyIntro', 'Bu gizlilik politikası, SpeakNest platformunun kullanıcı verilerini nasıl topladığını, kullandığını ve koruduğunu açıklar.')}
            </p>

            <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">
              {t('dataCollection', 'Veri Toplama')}
            </h2>
            <p className="text-slate-600 mb-6">
              {t('dataCollectionDesc', 'Kullanıcı hesabı oluşturma, dil öğrenme aktiviteleri ve platform kullanımı sırasında bazı kişisel veriler toplanır. Bu veriler, hizmetlerimizi iyileştirmek ve kişiselleştirilmiş deneyim sunmak için kullanılır.')}
            </p>

            <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">
              {t('dataUsage', 'Veri Kullanımı')}
            </h2>
            <p className="text-slate-600 mb-6">
              {t('dataUsageDesc', 'Toplanan veriler, kullanıcı deneyimini iyileştirmek, güvenliği sağlamak ve yasal yükümlülükleri yerine getirmek için kullanılır. Verileriniz asla üçüncü taraflarla paylaşılmaz.')}
            </p>

            <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">
              {t('dataSecurity', 'Veri Güvenliği')}
            </h2>
            <p className="text-slate-600 mb-6">
              {t('dataSecurityDesc', 'Kullanıcı verilerinin güvenliği bizim için önemlidir. Verilerinizi korumak için endüstri standardı güvenlik önlemleri kullanıyoruz.')}
            </p>

            <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">
              {t('userRights', 'Kullanıcı Hakları')}
            </h2>
            <p className="text-slate-600 mb-6">
              {t('userRightsDesc', 'Kullanıcılar, kişisel verilerine erişme, düzeltme ve silme hakkına sahiptir. Bu haklarınızı kullanmak için bizimle iletişime geçebilirsiniz.')}
            </p>

            <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">
              {t('cookies', 'Çerezler')}
            </h2>
            <p className="text-slate-600 mb-6">
              {t('cookiesDesc', 'Platform, kullanıcı deneyimini iyileştirmek için çerezler kullanır. Çerez tercihlerinizi tarayıcı ayarlarından yönetebilirsiniz.')}
            </p>

            <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">
              {t('policyUpdates', 'Politika Güncellemeleri')}
            </h2>
            <p className="text-slate-600 mb-6">
              {t('policyUpdatesDesc', 'Gizlilik politikamız zaman zaman güncellenebilir. Önemli değişiklikler için kullanıcıları bilgilendireceğiz.')}
            </p>

            <div className="mt-8">
              <p className="text-slate-600">
                {t('lastUpdated', 'Son güncelleme:')} {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 