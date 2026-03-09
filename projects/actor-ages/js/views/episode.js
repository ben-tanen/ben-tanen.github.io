Views.episode = async function(container, showId, seasonNum, episodeNum) {
    Utils.showLoading(container, 1, 2);

    try {
        const [show, seasonData, credits] = await Promise.all([
            API.getShow(showId),
            API.getSeason(showId, seasonNum),
            API.getEpisodeCredits(showId, seasonNum, episodeNum),
        ]);

        const episode = (seasonData.episodes || []).find(
            e => e.episode_number === parseInt(episodeNum)
        );
        const episodeName = episode ? episode.name : `Episode ${episodeNum}`;
        const airDate = episode ? episode.air_date : null;

        Utils.showLoading(container, 2, 2);

        // get birthdates for all cast + guest stars
        const allMembers = [...(credits.cast || []), ...(credits.guest_stars || [])];
        const actorIds = allMembers.map(m => m.id);
        const people = await API.getPeople(actorIds);

        Utils.setTitle(`${show.name} S${seasonNum}E${episodeNum}: ${episodeName}`);
        const wrapper = Utils.el('div');

        // breadcrumb
        const breadcrumb = Utils.el('div', 'breadcrumb');
        breadcrumb.appendChild(Utils.link('/', 'Search'));
        breadcrumb.appendChild(Utils.el('span', 'separator', ' / '));
        breadcrumb.appendChild(Utils.link(`/show/${showId}`, show.name));
        breadcrumb.appendChild(Utils.el('span', 'separator', ' / '));
        breadcrumb.appendChild(Utils.el('span', null, `S${seasonNum}E${episodeNum}`));
        wrapper.appendChild(breadcrumb);

        // header
        const header = Utils.el('div', 'detail-header');
        const stillUrl = Utils.imgUrl(episode?.still_path, 'w300');
        if (stillUrl) {
            const still = Utils.el('img', 'detail-still');
            still.src = stillUrl;
            still.alt = episodeName;
            header.appendChild(still);
        }
        const headerText = Utils.el('div', 'detail-header-text');
        headerText.appendChild(Utils.el('h2', null, `S${seasonNum}E${episodeNum}: ${episodeName}`));
        headerText.appendChild(Utils.el('div', 'subtitle',
            `Aired: ${Utils.formatDate(airDate)}`
        ));
        header.appendChild(headerText);
        wrapper.appendChild(header);

        // prev/next navigation
        const nav = Utils.el('div', 'episode-nav');
        const episodes = seasonData.episodes || [];
        const seasons = (show.seasons || []).filter(s => s.season_number > 0);
        const currentEpIdx = episodes.findIndex(e => e.episode_number === parseInt(episodeNum));
        const currentSeasonIdx = seasons.findIndex(s => s.season_number === parseInt(seasonNum));

        const navLinks = [];

        // previous episode
        if (currentEpIdx > 0) {
            const prev = episodes[currentEpIdx - 1];
            navLinks.push(Utils.link(
                `/show/${showId}/season/${seasonNum}/episode/${prev.episode_number}`,
                `← S${seasonNum}E${prev.episode_number}`
            ));
        } else if (currentSeasonIdx > 0) {
            const prevSeason = seasons[currentSeasonIdx - 1];
            navLinks.push(Utils.link(
                `/show/${showId}/season/${prevSeason.season_number}/episode/${prevSeason.episode_count}`,
                `← S${prevSeason.season_number}E${prevSeason.episode_count}`
            ));
        }

        // next episode
        if (currentEpIdx < episodes.length - 1) {
            const next = episodes[currentEpIdx + 1];
            navLinks.push(Utils.link(
                `/show/${showId}/season/${seasonNum}/episode/${next.episode_number}`,
                `S${seasonNum}E${next.episode_number} →`
            ));
        } else if (currentSeasonIdx < seasons.length - 1) {
            const nextSeason = seasons[currentSeasonIdx + 1];
            navLinks.push(Utils.link(
                `/show/${showId}/season/${nextSeason.season_number}/episode/1`,
                `S${nextSeason.season_number}E1 →`
            ));
        }

        if (navLinks.length > 0) {
            const navEl = Utils.el('div', 'breadcrumb');
            navLinks.forEach((link, i) => {
                if (i > 0) navEl.appendChild(Utils.el('span', 'separator', ' · '));
                navEl.appendChild(link);
            });
            wrapper.appendChild(navEl);
        }

        // cast table
        function buildCastTable(members, label) {
            if (members.length === 0) return;

            wrapper.appendChild(Utils.el('h3', null, label));
            const rows = members.map(member => {
                const person = people[member.id];
                const birthdate = person?.birthday || null;
                const age = Utils.calculateAge(birthdate, airDate);

                const actorCell = Utils.actorCell(member.id, member.name, member.profile_path);
                const ageEl = Utils.el('span', 'age-value', age !== null ? String(age) : 'Unknown');

                return [
                    actorCell,
                    member.character || 'Unknown',
                    Utils.formatDate(birthdate),
                    ageEl,
                ];
            });

            wrapper.appendChild(Utils.buildTable(
                ['Actor', 'Character', 'Birthdate', 'Age at Air Date'],
                rows
            ));
        }

        buildCastTable(credits.cast || [], 'Cast');
        buildCastTable(credits.guest_stars || [], 'Guest Stars');

        if ((credits.cast || []).length === 0 && (credits.guest_stars || []).length === 0) {
            wrapper.appendChild(Utils.el('p', null, 'No cast information available for this episode.'));
        }

        Utils.render(container, wrapper);
    } catch (err) {
        Utils.showError(container, `Failed to load episode: ${err.message}`);
    }
};
