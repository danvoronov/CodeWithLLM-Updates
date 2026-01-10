const fs = require('fs');
const path = require('path');

const siteUrl = 'https://aicode.danvoronov.com/';

function discoverPostsSource(prefix) {
    const repoRoot = path.resolve(__dirname, '..');
    const entries = fs.readdirSync(repoRoot, { withFileTypes: true });
    const re = new RegExp(`^${prefix}_(\\d{4})$`);

    return entries
        .filter(d => d.isDirectory())
        .map(d => d.name)
        .map(name => {
            const m = name.match(re);
            if (!m) return null;
            const year = Number(m[1]);
            return { year, path: name };
        })
        .filter(Boolean)
        .sort((a, b) => a.year - b.year);
}

const posts_source = {
    eng: discoverPostsSource('eng'),
    ukr: discoverPostsSource('ukr')
};

const ALLOWED_EXTENSIONS = {
    markdown: ['.md'],
    images: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
    audio: ['.mp3', '.wav', '.ogg', '.m4a']
};

const menuItems = [
    { 
        id: 'index',
        text: '🆕 Updates',
        path: '/',
        showArchive: true,
        lang: 'en'
    },
    { 
        id: 'ukr',
        text: 'Українською',
        path: '/ua/',
        showArchive: true,
        lang: 'uk'
    },
    { 
        id: 'tools',
        text: '🛠️ Tools',
        path: '/tools/',
        showArchive: false
    },
    { 
        id: 'about',
        text: 'ℹ️ About',
        path: '/about/',
        showArchive: false
    }
];

const postsConfig = {
    recentPostsCount: 16,
    monthNames: {
        en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        uk: ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень']
    }
};

const siteConfig = {
    title: 'CodeWithLLM',
    analytics: '<script defer src="https://cloud.umami.is/script.js" data-website-id="83382b3e-2896-4870-8d1c-c7f51e97497f"></script>',
    descriptions: {
        index: 'Updates and tips about using Large Language Models (LLM) for programming and development',
        ukr: 'Поради та оновлення щодо використання великих мовних моделей (LLM) для програмування',
        default: 'CodeWithLLM - Learn how to better create code using AI and LLM'
    },
    siteDescriptions: {
        en: '🤖 AI tools for smarter coding: practical examples, step-by-step instructions, and real-world LLM applications. Learn to work efficiently with modern code assistants.',
        uk: '🤖 Інструменти ШІ для програмування: практичні приклади, покрокові інструкції та реальні застосування LLM. Навчіться ефективно працювати з сучасними асистентами програмування.'
    },
    ui: {
        en: {
            comments: 'Comments',
            previous: 'Previous',
            next: 'Next',
            home: 'Scroll to top',
            scrollToTop: 'Scroll to top'
        },
        uk: {
            comments: 'Коментарі',
            previous: 'Попередній',
            next: 'Наступний',
            home: 'Прокрутити нагору',
            scrollToTop: 'Прокрутити нагору'
        }
    }
};

const commentsConfig = {
    repo: "danvoronov/CodeWithLLM-Updates",
    repoId: "R_kgDONzVr9g",
    category: "Announcements",
    categoryId: "DIC_kwDONzVr9s4CmkPS",
    mapping: "specific",
    strict: "0",
    reactionsEnabled: "1",
    emitMetadata: "0",
    inputPosition: "bottom",
    theme: "noborder_light",
    lang: "en"
};

const githubConfig = {
    repoUrl: 'https://github.com/danvoronov/CodeWithLLM-Updates',
    apiUrl: 'https://api.github.com/repos/danvoronov/CodeWithLLM-Updates'
};

module.exports = {
    posts_source,
    siteUrl,
    ALLOWED_EXTENSIONS,
    menuItems,
    postsConfig,
    siteConfig,
    commentsConfig,
    githubConfig
}; 