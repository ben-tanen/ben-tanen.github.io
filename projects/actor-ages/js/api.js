const API = {
    // localStorage cache with TTL
    _cacheGet(key) {
        try {
            const item = localStorage.getItem('actor-ages:' + key);
            if (!item) return null;
            const parsed = JSON.parse(item);
            if (Date.now() > parsed.expiry) {
                localStorage.removeItem('actor-ages:' + key);
                return null;
            }
            return parsed.data;
        } catch {
            return null;
        }
    },

    _cacheSet(key, data) {
        try {
            localStorage.setItem('actor-ages:' + key, JSON.stringify({
                data,
                expiry: Date.now() + CONFIG.CACHE_TTL_MS,
            }));
        } catch {
            // localStorage full or unavailable — silently skip
        }
    },

    async _fetch(path, params = {}) {
        const cacheKey = path + '?' + new URLSearchParams(params).toString();
        const cached = this._cacheGet(cacheKey);
        if (cached) return cached;

        const url = new URL(CONFIG.TMDB_BASE_URL + path);
        url.searchParams.set('api_key', CONFIG.TMDB_API_KEY);
        Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

        const res = await fetch(url);
        if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);

        const data = await res.json();
        this._cacheSet(cacheKey, data);
        return data;
    },

    // search endpoints
    searchMovies(query) {
        return this._fetch('/search/movie', { query });
    },

    searchTV(query) {
        return this._fetch('/search/tv', { query });
    },

    searchPeople(query) {
        return this._fetch('/search/person', { query });
    },

    // detail endpoints
    getMovie(id) {
        return this._fetch(`/movie/${id}`);
    },

    getMovieCredits(id) {
        return this._fetch(`/movie/${id}/credits`);
    },

    getShow(id) {
        return this._fetch(`/tv/${id}`);
    },

    getShowAggregateCredits(id) {
        return this._fetch(`/tv/${id}/aggregate_credits`);
    },

    getSeason(showId, seasonNumber) {
        return this._fetch(`/tv/${showId}/season/${seasonNumber}`);
    },

    getEpisodeCredits(showId, seasonNumber, episodeNumber) {
        return this._fetch(`/tv/${showId}/season/${seasonNumber}/episode/${episodeNumber}/credits`);
    },

    getPerson(id) {
        return this._fetch(`/person/${id}`);
    },

    getPersonCombinedCredits(id) {
        return this._fetch(`/person/${id}/combined_credits`);
    },

    getCredit(creditId) {
        return this._fetch(`/credit/${creditId}`);
    },

    // batch fetch credit details with concurrency limit
    async getCredits(creditIds) {
        const results = {};
        const uniqueIds = [...new Set(creditIds.filter(Boolean))];
        const batchSize = 8;

        for (let i = 0; i < uniqueIds.length; i += batchSize) {
            const batch = uniqueIds.slice(i, i + batchSize);
            const credits = await Promise.all(
                batch.map(id => this.getCredit(id).catch(() => null))
            );
            batch.forEach((id, idx) => {
                if (credits[idx]) results[id] = credits[idx];
            });
        }

        return results;
    },

    // batch fetch person details with concurrency limit
    async getPeople(ids) {
        const results = {};
        const uniqueIds = [...new Set(ids)];
        const batchSize = 8;

        for (let i = 0; i < uniqueIds.length; i += batchSize) {
            const batch = uniqueIds.slice(i, i + batchSize);
            const people = await Promise.all(
                batch.map(id => this.getPerson(id).catch(() => null))
            );
            batch.forEach((id, idx) => {
                if (people[idx]) results[id] = people[idx];
            });
        }

        return results;
    },
};
