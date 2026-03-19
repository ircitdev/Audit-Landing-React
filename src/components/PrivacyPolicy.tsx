import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onClose: () => void;
}

export default function PrivacyPolicy({ onClose }: PrivacyPolicyProps) {
  return (
    <div className="fixed inset-0 z-[3000] bg-slate-950 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-slate-400 hover:text-orange-500 transition-colors mb-8 font-bold text-sm uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" /> Назад
        </button>

        <div className="flex items-center gap-3 mb-10">
          <Shield className="w-8 h-8 text-orange-500" />
          <span className="font-heading font-black tracking-tighter uppercase text-xl text-white">
            Сайт<span className="text-orange-500">ЧИСТ!</span>
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-heading font-black uppercase tracking-tighter text-white mb-10">
          Политика конфиденциальности
        </h1>

        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-slate-300 leading-relaxed">
          <p className="text-slate-400 text-sm">Дата публикации: 16 марта 2026 г.</p>

          <h2 className="text-lg font-black text-white uppercase tracking-tight mt-8">1. Общие положения</h2>
          <p>
            Настоящая Политика конфиденциальности (далее — Политика) определяет порядок обработки и защиты
            персональных данных пользователей сайта sitechist.ru (далее — Сайт), принадлежащего
            ИП Солдатов Денис Алексеевич (далее — Оператор).
          </p>
          <p>
            Оператор обеспечивает защиту обрабатываемых персональных данных от несанкционированного доступа
            и разглашения в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».
          </p>

          <h2 className="text-lg font-black text-white uppercase tracking-tight mt-8">2. Персональные данные</h2>
          <p>Оператор может собирать следующие персональные данные:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Имя</li>
            <li>Номер телефона</li>
            <li>Адрес электронной почты</li>
            <li>Наименование компании</li>
            <li>Адрес сайта</li>
            <li>Никнейм в Telegram</li>
            <li>Сфера деятельности</li>
          </ul>

          <h2 className="text-lg font-black text-white uppercase tracking-tight mt-8">3. Цели обработки</h2>
          <p>Персональные данные обрабатываются в следующих целях:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Обработка входящих запросов и заявок</li>
            <li>Связь с пользователем для оказания услуг</li>
            <li>Подготовка коммерческих предложений</li>
            <li>Улучшение качества обслуживания</li>
          </ul>

          <h2 className="text-lg font-black text-white uppercase tracking-tight mt-8">4. Правовые основания</h2>
          <p>
            Обработка персональных данных осуществляется на основании согласия субъекта персональных данных
            (п. 1 ч. 1 ст. 6 Федерального закона № 152-ФЗ), выраженного путём проставления отметки
            в соответствующем поле формы на Сайте.
          </p>

          <h2 className="text-lg font-black text-white uppercase tracking-tight mt-8">5. Передача данных третьим лицам</h2>
          <p>
            Оператор не передаёт персональные данные третьим лицам, за исключением случаев, предусмотренных
            законодательством Российской Федерации. Данные хранятся и обрабатываются на территории
            Российской Федерации.
          </p>

          <h2 className="text-lg font-black text-white uppercase tracking-tight mt-8">6. Файлы cookie</h2>
          <p>
            Сайт использует файлы cookie для обеспечения корректной работы и анализа трафика.
            Пользователь может отключить cookie в настройках браузера, однако это может повлиять
            на функциональность Сайта.
          </p>

          <h2 className="text-lg font-black text-white uppercase tracking-tight mt-8">7. Сроки обработки</h2>
          <p>
            Персональные данные обрабатываются до момента отзыва согласия субъектом персональных данных.
            Для отзыва согласия направьте запрос на адрес электронной почты: soldatov@sitechist.ru.
          </p>

          <h2 className="text-lg font-black text-white uppercase tracking-tight mt-8">8. Права субъекта</h2>
          <p>Пользователь имеет право:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Получить информацию об обработке своих персональных данных</li>
            <li>Требовать уточнения, блокирования или уничтожения персональных данных</li>
            <li>Отозвать согласие на обработку персональных данных</li>
            <li>Обжаловать действия Оператора в Роскомнадзор</li>
          </ul>

          <h2 className="text-lg font-black text-white uppercase tracking-tight mt-8">9. Реквизиты оператора</h2>
          <p>
            ИП Солдатов Денис Алексеевич<br />
            ИНН: 770412389456<br />
            ОГРНИП: 324774600298451<br />
            Адрес: 119019, г. Москва, ул. Новый Арбат, д. 15, оф. 401<br />
            Email: soldatov@sitechist.ru
          </p>

          <p className="text-slate-500 text-xs mt-12 border-t border-slate-800 pt-6">
            Настоящая Политика может быть изменена Оператором в одностороннем порядке.
            Актуальная версия размещена на данной странице.
          </p>
        </div>
      </div>
    </div>
  );
}
