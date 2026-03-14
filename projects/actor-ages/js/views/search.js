Views.search = function(container) {
    const categories = [
        { key: 'movie', label: 'Movies' },
        { key: 'tv', label: 'TV Shows' },
        { key: 'person', label: 'Actors' },
    ];
    // read initial state from URL params
    const urlParams = new URLSearchParams(window.location.search);
    let activeCategory = categories.some(c => c.key === urlParams.get('type'))
        ? urlParams.get('type') : 'movie';
    let debounceTimer = null;

    Utils.setTitle(null);
    const wrapper = Utils.el('div');

    // search tabs
    const tabs = Utils.el('div', 'search-tabs');
    categories.forEach(cat => {
        const tab = Utils.el('button', 'search-tab', cat.label);
        if (cat.key === activeCategory) tab.classList.add('active');
        tab.addEventListener('click', () => {
            activeCategory = cat.key;
            tabs.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            if (input.value.trim()) {
                updateURL(input.value.trim());
                doSearch(input.value.trim());
            }
        });
        tabs.appendChild(tab);
    });

    // search input
    const input = Utils.el('input', 'search-input');
    input.type = 'text';
    input.placeholder = 'Search for a movie, TV show, or actor...';
    input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        const query = input.value.trim();
        if (!query) {
            resultsList.innerHTML = '';
            return;
        }
        debounceTimer = setTimeout(() => {
            updateURL(query);
            doSearch(query);
        }, 300);
    });

    const searchContainer = Utils.el('div', 'search-container');
    searchContainer.appendChild(tabs);
    searchContainer.appendChild(input);

    const resultsList = Utils.el('ul', 'search-results');

    wrapper.appendChild(searchContainer);
    wrapper.appendChild(resultsList);
    Utils.render(container, wrapper);

    // auto-focus the input
    input.focus();

    // restore search from URL params
    const initialQuery = urlParams.get('q');
    if (initialQuery) {
        input.value = initialQuery;
        doSearch(initialQuery);
    }

    function updateURL(query) {
        const params = new URLSearchParams({ q: query, type: activeCategory });
        history.replaceState(null, '', CONFIG.BASE_PATH + '/?' + params.toString());
    }

    async function doSearch(query) {
        resultsList.innerHTML = '<li class="loading">Searching...</li>';

        try {
            let data;
            if (activeCategory === 'movie') {
                data = await API.searchMovies(query);
            } else if (activeCategory === 'tv') {
                data = await API.searchTV(query);
            } else {
                data = await API.searchPeople(query);
            }

            const results = data.results || [];
            resultsList.innerHTML = '';

            if (results.length === 0) {
                resultsList.innerHTML = '<li>No results found.</li>';
                return;
            }

            results.slice(0, 20).forEach(result => {
                const li = Utils.el('li');
                const titleText = result.title || result.name || 'Unknown';
                const year = Utils.formatYear(result.release_date || result.first_air_date);

                let path, meta;
                if (activeCategory === 'movie') {
                    path = `/movie/${result.id}`;
                    meta = year ? `(${year})` : '';
                } else if (activeCategory === 'tv') {
                    path = `/show/${result.id}`;
                    meta = year ? `(${year})` : '';
                } else {
                    path = `/person/${result.id}`;
                    const knownFor = (result.known_for || [])
                        .slice(0, 3)
                        .map(k => k.title || k.name)
                        .join(', ');
                    meta = knownFor ? `Known for: ${knownFor}` : '';
                }

                const imgPath = result.poster_path || result.profile_path;
                const imgUrl = Utils.imgUrl(imgPath, 'w185');
                const thumbLink = Utils.link(path, '', 'search-result-thumb-link');
                if (imgUrl) {
                    const thumb = Utils.el('img', 'search-result-thumb');
                    thumb.src = imgUrl;
                    thumb.alt = titleText;
                    thumbLink.appendChild(thumb);
                } else {
                    const placeholder = Utils.el('div', 'search-result-thumb placeholder');
                    thumbLink.appendChild(placeholder);
                }
                li.appendChild(thumbLink);

                const textWrapper = Utils.el('div', 'search-result-text');
                const link = Utils.link(path, titleText, 'search-result-title');
                textWrapper.appendChild(link);

                if (meta) {
                    const metaEl = Utils.el('div', 'search-result-meta', meta);
                    textWrapper.appendChild(metaEl);
                }
                li.appendChild(textWrapper);

                resultsList.appendChild(li);
            });
        } catch (err) {
            resultsList.innerHTML = `<li class="error">Search failed: ${err.message}</li>`;
        }
    }
};
