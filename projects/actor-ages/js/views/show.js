Views.show = async function(container, showId) {
    Utils.showLoading(container);

    try {
        const [show, aggCredits] = await Promise.all([
            API.getShow(showId),
            API.getShowAggregateCredits(showId),
        ]);

        Utils.setTitle(show.name);
        const wrapper = Utils.el('div');

        // breadcrumb
        const breadcrumb = Utils.el('div', 'breadcrumb');
        breadcrumb.appendChild(Utils.link('/', 'Search'));
        breadcrumb.appendChild(Utils.el('span', 'separator', ' / '));
        breadcrumb.appendChild(Utils.el('span', null, show.name));
        wrapper.appendChild(breadcrumb);

        // header
        const header = Utils.el('div', 'detail-header');
        const posterUrl = Utils.imgUrl(show.poster_path, 'w185');
        if (posterUrl) {
            const poster = Utils.el('img', 'detail-poster');
            poster.src = posterUrl;
            poster.alt = show.name;
            header.appendChild(poster);
        }
        const headerText = Utils.el('div', 'detail-header-text');
        const seasons = (show.seasons || []).filter(s => s.season_number > 0);
        headerText.appendChild(Utils.el('h2', null, show.name));
        headerText.appendChild(Utils.el('div', 'subtitle',
            `${seasons.length} season${seasons.length !== 1 ? 's' : ''} · First aired: ${Utils.formatDate(show.first_air_date)}`
        ));
        header.appendChild(headerText);
        wrapper.appendChild(header);

        // view tabs: episodes vs. cast
        let activeTab = 'episodes';
        const tabContainer = Utils.el('div', 'view-tabs');
        const contentArea = Utils.el('div');

        const episodesTab = Utils.el('button', 'view-tab active', 'Browse by Episode');
        const castTab = Utils.el('button', 'view-tab', 'Browse by Actor');

        episodesTab.addEventListener('click', () => {
            activeTab = 'episodes';
            episodesTab.classList.add('active');
            castTab.classList.remove('active');
            renderEpisodes();
        });

        castTab.addEventListener('click', () => {
            activeTab = 'cast';
            castTab.classList.add('active');
            episodesTab.classList.remove('active');
            renderCast();
        });

        tabContainer.appendChild(episodesTab);
        tabContainer.appendChild(castTab);
        wrapper.appendChild(tabContainer);
        wrapper.appendChild(contentArea);

        Utils.render(container, wrapper);

        // render episodes view
        function renderEpisodes() {
            contentArea.innerHTML = '';
            const seasonList = Utils.el('ul', 'season-list');

            seasons.forEach(season => {
                const li = Utils.el('li');
                const toggle = Utils.el('div', 'season-toggle',
                    `Season ${season.season_number} (${season.episode_count} episodes)`
                );
                const episodeContainer = Utils.el('ul', 'episode-list');
                episodeContainer.style.display = 'none';
                let loaded = false;

                toggle.addEventListener('click', async () => {
                    if (episodeContainer.style.display === 'none') {
                        episodeContainer.style.display = 'block';
                        if (!loaded) {
                            loaded = true;
                            episodeContainer.innerHTML = '<li class="loading">Loading episodes...</li>';
                            try {
                                const seasonData = await API.getSeason(showId, season.season_number);
                                episodeContainer.innerHTML = '';
                                (seasonData.episodes || []).forEach(ep => {
                                    const epLi = Utils.el('li');
                                    const link = Utils.link(
                                        `/show/${showId}/season/${season.season_number}/episode/${ep.episode_number}`,
                                        `E${ep.episode_number}: ${ep.name}`
                                    );
                                    const meta = Utils.el('span', 'search-result-meta',
                                        ` · ${Utils.formatDate(ep.air_date)}`
                                    );
                                    epLi.appendChild(link);
                                    epLi.appendChild(meta);
                                    episodeContainer.appendChild(epLi);
                                });
                            } catch {
                                episodeContainer.innerHTML = '<li class="error">Failed to load episodes</li>';
                            }
                        }
                    } else {
                        episodeContainer.style.display = 'none';
                    }
                });

                li.appendChild(toggle);
                li.appendChild(episodeContainer);
                seasonList.appendChild(li);
            });

            contentArea.appendChild(seasonList);
        }

        // render cast view
        function renderCast() {
            contentArea.innerHTML = '';
            const castList = aggCredits.cast || [];

            if (castList.length === 0) {
                contentArea.appendChild(Utils.el('p', null, 'No cast information available.'));
                return;
            }

            // sort by total episode count descending
            const sorted = castList
                .map(member => ({
                    id: member.id,
                    name: member.name,
                    profilePath: member.profile_path,
                    roles: member.roles || [],
                    totalEpisodes: (member.roles || []).reduce((sum, r) => sum + (r.episode_count || 0), 0),
                }))
                .sort((a, b) => b.totalEpisodes - a.totalEpisodes);

            const rows = sorted.slice(0, 50).map(member => {
                const actorCell = Utils.actorCell(member.id, member.name, member.profilePath);
                const characters = member.roles.map(r => r.character).filter(Boolean).join(', ');
                return [
                    actorCell,
                    characters || 'Unknown',
                    String(member.totalEpisodes),
                ];
            });

            const table = Utils.buildTable(
                ['Actor', 'Character(s)', 'Episodes'],
                rows
            );
            contentArea.appendChild(table);
        }

        renderEpisodes();
    } catch (err) {
        Utils.showError(container, `Failed to load show: ${err.message}`);
    }
};
