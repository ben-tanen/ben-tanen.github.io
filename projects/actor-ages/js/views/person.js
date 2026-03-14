Views.person = async function(container, personId) {
    Utils.showLoading(container);

    try {
        const [person, credits] = await Promise.all([
            API.getPerson(personId),
            API.getPersonCombinedCredits(personId),
        ]);

        Utils.setTitle(person.name);
        const wrapper = Utils.el('div');

        // breadcrumb
        const breadcrumb = Utils.el('div', 'breadcrumb');
        breadcrumb.appendChild(Utils.link('/', 'Search'));
        breadcrumb.appendChild(Utils.el('span', 'separator', ' / '));
        breadcrumb.appendChild(Utils.el('span', null, person.name));
        wrapper.appendChild(breadcrumb);

        // header
        const header = Utils.el('div', 'detail-header');
        const profileUrl = Utils.imgUrl(person.profile_path, 'w185');
        if (profileUrl) {
            const photo = Utils.el('img', 'detail-profile');
            photo.src = profileUrl;
            photo.alt = person.name;
            header.appendChild(photo);
        }
        const headerText = Utils.el('div', 'detail-header-text');
        headerText.appendChild(Utils.el('h2', null, person.name));
        const currentAge = Utils.calculateAge(person.birthday, new Date().toISOString().split('T')[0]);
        const ageText = person.birthday
            ? `Born: ${Utils.formatDate(person.birthday)}${currentAge !== null ? ` (age ${currentAge})` : ''}`
            : 'Birthdate unknown';
        headerText.appendChild(Utils.el('div', 'subtitle', ageText));
        header.appendChild(headerText);
        wrapper.appendChild(header);

        const castCredits = (credits.cast || []);

        // split into movies and tv
        const movies = castCredits
            .filter(c => c.media_type === 'movie' && c.release_date)
            .sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''));

        const tvShows = castCredits
            .filter(c => c.media_type === 'tv')
            .sort((a, b) => (b.first_air_date || '').localeCompare(a.first_air_date || ''));

        // movies section
        if (movies.length > 0) {
            wrapper.appendChild(Utils.el('h3', null, 'Movies'));
            const rows = movies.map(movie => {
                const nameLink = Utils.link(`/movie/${movie.id}`, movie.title || movie.name);
                const age = Utils.calculateAge(person.birthday, movie.release_date);
                const ageEl = Utils.el('span', 'age-value', age !== null ? String(age) : 'Unknown');
                return [
                    nameLink,
                    movie.character || 'Unknown',
                    Utils.formatDate(movie.release_date),
                    ageEl,
                ];
            });
            wrapper.appendChild(Utils.buildTable(
                ['Title', 'Character', 'Release Date', 'Age'],
                rows
            ));
        }

        // tv section
        if (tvShows.length > 0) {
            wrapper.appendChild(Utils.el('h3', null, 'TV Shows'));

            // deduplicate by show id (combined_credits can have multiple entries per show)
            const showMap = new Map();
            tvShows.forEach(show => {
                if (!showMap.has(show.id)) {
                    showMap.set(show.id, {
                        id: show.id,
                        name: show.name,
                        characters: [],
                        creditIds: [],
                        firstAirDate: show.first_air_date,
                        episodeCount: show.episode_count || 0,
                    });
                }
                const entry = showMap.get(show.id);
                if (show.character && !entry.characters.includes(show.character)) {
                    entry.characters.push(show.character);
                }
                if (show.credit_id) {
                    entry.creditIds.push(show.credit_id);
                }
            });

            // fetch credit details to find actual first appearance dates
            const allCreditIds = [...showMap.values()].flatMap(s => s.creditIds);
            const creditDetails = await API.getCredits(allCreditIds);

            // for each show, find the earliest episode air date from credit details
            showMap.forEach(show => {
                let earliestDate = null;
                for (const creditId of show.creditIds) {
                    const detail = creditDetails[creditId];
                    if (!detail || !detail.media || !detail.media.episodes) continue;
                    for (const ep of detail.media.episodes) {
                        if (ep.air_date && (!earliestDate || ep.air_date < earliestDate)) {
                            earliestDate = ep.air_date;
                        }
                    }
                }
                show.firstAppearance = earliestDate || show.firstAirDate;
            });

            const rows = [...showMap.values()].map(show => {
                const nameLink = Utils.link(`/show/${show.id}/actor/${personId}`, show.name);
                const age = Utils.calculateAge(person.birthday, show.firstAppearance);
                const ageEl = Utils.el('span', 'age-value', age !== null ? String(age) : 'Unknown');
                return [
                    nameLink,
                    show.characters.join(', ') || 'Unknown',
                    String(show.episodeCount || '?'),
                    Utils.formatDate(show.firstAppearance),
                    ageEl,
                ];
            });
            wrapper.appendChild(Utils.buildTable(
                ['Show', 'Character(s)', 'Episodes', 'First Appearance', 'Age at First App.'],
                rows
            ));
        }

        if (movies.length === 0 && tvShows.length === 0) {
            wrapper.appendChild(Utils.el('p', null, 'No acting credits found.'));
        }

        Utils.render(container, wrapper);
    } catch (err) {
        Utils.showError(container, `Failed to load person: ${err.message}`);
    }
};
