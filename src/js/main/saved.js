displayNavigationTemplate({isSaved: true});

const excerptsEl = document.getElementById('excerpts');

Database.retrieve('Bookmarks', 'pubDate')
    .then((bookmarkedArticles) => {
        document.querySelector('.articles-count').innerHTML = bookmarkedArticles.length;
        return Promise.resolve(bookmarkedArticles);
    })
    .then((articles) => {
        const Articles = sortedArticles(articles);
        const html = MyApp.templates.excerpt({ items: Articles });
        excerptsEl.innerHTML = html;
    });


