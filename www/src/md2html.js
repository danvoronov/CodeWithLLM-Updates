const marked = require('marked');
const { ALLOWED_EXTENSIONS } = require('../config');

marked.use({
  breaks: true, 
  gfm: true,
  renderer: {
    link(token) {
      const url = token.href?.trim() || '';
      const ext = url.split('.').pop()?.toLowerCase();
      
      if (ALLOWED_EXTENSIONS.audio.includes(`.${ext}`)) {
        return `<audio controls>
          <source src="/audio/${url}" type="audio/${ext}">
          ${token.text} (аудио не поддерживается вашим браузером)
        </audio>`;
      }

      // Проверяем, является ли текст ссылки изображением 🖼️
      const isImage = token.text.startsWith('![') && token.text.endsWith(')');
      if (isImage) {
        // Извлекаем параметры изображения
        const match = token.text.match(/!\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)/);
        if (match) {
          const [_, imgText, imgUrl, imgTitle] = match;
          // Создаем HTML для изображения внутри ссылки 🔗
          return `<a target="_blank" href="${token.href}"${token.title ? ` title="${token.title}"` : ''}><img src="${imgUrl}" alt="${imgText}"${imgTitle ? ` title="${imgTitle}"` : ''}/></a>`;
        }
      }
      return `<a target="_blank" href="${token.href}"${token.title ? ` title="${token.title}"` : ''}>${token.text}</a>`;
    },
    
    image(href, title, text) {
      const url = (href?.href || href)?.trim() || '';
      
      if (url.includes('youtube.com')) {
        const videoId = url.match(/\/(vi?|embed)\/([^\/]+)/i)?.[2] || 
                       url.match(/(?:v=|\/v\/|^\/|embed\/)([^&\?\/]+)/i)?.[1];
        if (videoId) {
          return `
            <lite-youtube videoid="${videoId}" playlabel="Play Video"></lite-youtube>
          `;
        }
      }
      
      const isExternal = /^(https?:|\.\.?\/|\/)/.test(url);
      if (isExternal) {
        return `<img src="${url}"${text ? ` alt="${text}"` : ''}${title ? ` title="${title}"` : ''} />`;
      }
      return `<img src="/img/${url}"${text ? ` alt="${text}"` : ''}${title ? ` title="${title}"` : ''} />`;
    },
  }
});

function mdToHtml(content, isSinglePost = false) {
  // Тег может содержать буквы и цифры
  const tagRegex = /(?<=\s)#([a-zA-Zа-яА-ЯёЁіІїЇєЄ0-9]+)/g;

  // Заменяем теги на красивые спаны перед обработкой markdown
  if (isSinglePost) {
    // Для страницы отдельного поста не добавляем обработчик клика
    content = content.replace(tagRegex, '<span class="post-tag">#$1</span>');
  } else {
    // Для страниц со списком постов добавляем обработчик клика
    content = content.replace(tagRegex, '<span class="post-tag" onclick="document.getElementById(\'postsFilter\').value=\'#$1\';document.getElementById(\'postsFilter\').dispatchEvent(new Event(\'input\'))">#$1</span>');
  }
  
  return marked.parse(content.replace(/<!--[\s\S]*?-->/g, ''));
}

module.exports = mdToHtml;
