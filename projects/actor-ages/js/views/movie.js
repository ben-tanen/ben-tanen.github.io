Views.movie = async function(container, movieId) {
    Utils.showLoading(container, 1, 2);

    try {
        const [movie, credits] = await Promise.all([
            API.getMovie(movieId),
            API.getMovieCredits(movieId),
        ]);

        Utils.showLoading(container, 2, 2);

        const cast = credits.cast || [];
        const actorIds = cast.slice(0, 50).map(c => c.id);
        const people = await API.getPeople(actorIds);

        Utils.setTitle(movie.title);
        const wrapper = Utils.el('div');

        // breadcrumb
        const breadcrumb = Utils.el('div', 'breadcrumb');
        breadcrumb.appendChild(Utils.link('/', 'Search'));
        breadcrumb.appendChild(Utils.el('span', 'separator', ' / '));
        breadcrumb.appendChild(Utils.el('span', null, movie.title));
        wrapper.appendChild(breadcrumb);

        // header
        const header = Utils.el('div', 'detail-header');
        const posterUrl = Utils.imgUrl(movie.poster_path, 'w185');
        if (posterUrl) {
            const poster = Utils.el('img', 'detail-poster');
            poster.src = posterUrl;
            poster.alt = movie.title;
            header.appendChild(poster);
        }
        const headerText = Utils.el('div', 'detail-header-text');
        headerText.appendChild(Utils.el('h2', null, movie.title));
        headerText.appendChild(Utils.el('div', 'subtitle',
            `Released: ${Utils.formatDate(movie.release_date)}`
        ));
        header.appendChild(headerText);
        wrapper.appendChild(header);

        // cast table
        if (cast.length === 0) {
            wrapper.appendChild(Utils.el('p', null, 'No cast information available.'));
        } else {
            const rows = cast.slice(0, 50).map(member => {
                const person = people[member.id];
                const birthdate = person?.birthday || null;
                const age = Utils.calculateAge(birthdate, movie.release_date);

                const actorCell = Utils.actorCell(member.id, member.name, member.profile_path);
                const ageEl = Utils.el('span', 'age-value', age !== null ? String(age) : 'Unknown');

                return [
                    actorCell,
                    member.character || 'Unknown',
                    Utils.formatDate(birthdate),
                    ageEl,
                ];
            });

            const table = Utils.buildTable(
                ['Actor', 'Character', 'Birthdate', 'Age at Release'],
                rows
            );
            wrapper.appendChild(table);
        }

        Utils.render(container, wrapper);
    } catch (err) {
        Utils.showError(container, `Failed to load movie: ${err.message}`);
    }
};
