Views.showActor = async function(container, showId, actorId) {
    Utils.showLoading(container, 1, 3);

    try {
        const [show, person] = await Promise.all([
            API.getShow(showId),
            API.getPerson(actorId),
        ]);

        const seasons = (show.seasons || []).filter(s => s.season_number > 0);

        Utils.showLoading(container, 2, 3);

        // fetch all season data to get episode air dates and credits
        const seasonDataList = await Promise.all(
            seasons.map(s => API.getSeason(showId, s.season_number))
        );

        // for each season, check aggregate credits to find which episodes this actor was in
        const aggCredits = await API.getShowAggregateCredits(showId);
        const actorAgg = (aggCredits.cast || []).find(c => c.id === parseInt(actorId));
        const characterNames = actorAgg
            ? actorAgg.roles.map(r => r.character).filter(Boolean)
            : [];

        Utils.showLoading(container, 3, 3);

        // build episode list by checking per-episode credits
        const appearances = [];

        for (const seasonData of seasonDataList) {
            for (const episode of (seasonData.episodes || [])) {
                // fetch episode credits to check if actor appeared
                try {
                    const epCredits = await API.getEpisodeCredits(
                        showId, episode.season_number, episode.episode_number
                    );
                    const allCast = [...(epCredits.cast || []), ...(epCredits.guest_stars || [])];
                    const appearance = allCast.find(c => c.id === parseInt(actorId));

                    if (appearance) {
                        appearances.push({
                            season: episode.season_number,
                            episode: episode.episode_number,
                            name: episode.name,
                            airDate: episode.air_date,
                            character: appearance.character,
                        });
                    }
                } catch {
                    // skip episodes where credits fail to load
                }
            }
        }

        Utils.setTitle(`${person.name} in ${show.name}`);
        const wrapper = Utils.el('div');

        // breadcrumb
        const breadcrumb = Utils.el('div', 'breadcrumb');
        breadcrumb.appendChild(Utils.link('/', 'Search'));
        breadcrumb.appendChild(Utils.el('span', 'separator', ' / '));
        breadcrumb.appendChild(Utils.link(`/show/${showId}`, show.name));
        breadcrumb.appendChild(Utils.el('span', 'separator', ' / '));
        breadcrumb.appendChild(Utils.el('span', null, person.name));
        wrapper.appendChild(breadcrumb);

        // header
        const header = Utils.el('div', 'detail-header');
        header.appendChild(Utils.el('h2', null, `${person.name} in ${show.name}`));
        const charText = characterNames.length > 0
            ? `as ${characterNames.join(', ')}`
            : '';
        header.appendChild(Utils.el('div', 'subtitle', charText));
        wrapper.appendChild(header);

        // age range summary
        if (appearances.length > 0 && person.birthday) {
            const ages = appearances
                .filter(a => a.airDate)
                .map(a => Utils.calculateAge(person.birthday, a.airDate))
                .filter(a => a !== null);

            if (ages.length > 0) {
                const minAge = Math.min(...ages);
                const maxAge = Math.max(...ages);
                const summary = Utils.el('div', 'age-summary');
                summary.textContent = minAge === maxAge
                    ? `Age ${minAge} · ${appearances.length} episode${appearances.length !== 1 ? 's' : ''}`
                    : `Ages ${minAge}–${maxAge} · ${appearances.length} episode${appearances.length !== 1 ? 's' : ''}`;
                wrapper.appendChild(summary);
            }
        }

        // episodes table
        if (appearances.length === 0) {
            wrapper.appendChild(Utils.el('p', null, 'No episode appearances found.'));
        } else {
            const rows = appearances.map(a => {
                const epLabel = `S${a.season}E${a.episode}: ${a.name}`;
                const epLink = Utils.link(
                    `/show/${showId}/season/${a.season}/episode/${a.episode}`,
                    epLabel
                );
                const age = Utils.calculateAge(person.birthday, a.airDate);
                const ageEl = Utils.el('span', 'age-value', age !== null ? String(age) : 'Unknown');

                return [
                    epLink,
                    a.character || characterNames[0] || 'Unknown',
                    Utils.formatDate(a.airDate),
                    ageEl,
                ];
            });

            wrapper.appendChild(Utils.buildTable(
                ['Episode', 'Character', 'Air Date', 'Age'],
                rows
            ));
        }

        Utils.render(container, wrapper);
    } catch (err) {
        Utils.showError(container, `Failed to load actor details: ${err.message}`);
    }
};
