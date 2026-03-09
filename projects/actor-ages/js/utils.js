const Utils = {
    // calculate age at a reference date given a birthdate
    // both should be 'YYYY-MM-DD' strings
    calculateAge(birthdate, referenceDate) {
        if (!birthdate || !referenceDate) return null;

        const birth = new Date(birthdate + 'T00:00:00');
        const ref = new Date(referenceDate + 'T00:00:00');

        let age = ref.getFullYear() - birth.getFullYear();
        const monthDiff = ref.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && ref.getDate() < birth.getDate())) {
            age--;
        }

        return age;
    },

    // build a cell with a small thumbnail and a link
    actorCell(personId, name, profilePath) {
        const cell = this.el('div', 'actor-cell');
        const url = this.imgUrl(profilePath, 'w92');
        if (url) {
            const img = this.el('img', 'actor-thumb');
            img.src = url;
            img.alt = name;
            cell.appendChild(img);
        }
        cell.appendChild(this.link(`/person/${personId}`, name));
        return cell;
    },

    imgUrl(path, size = 'w185') {
        if (!path) return null;
        return `https://image.tmdb.org/t/p/${size}${path}`;
    },

    formatDate(dateStr) {
        if (!dateStr) return 'Unknown';
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    },

    formatYear(dateStr) {
        if (!dateStr) return '';
        return dateStr.substring(0, 4);
    },

    // create an element with optional class and text
    el(tag, className, textContent) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (textContent) element.textContent = textContent;
        return element;
    },

    // create an internal link that uses client-side routing
    link(href, textContent, className) {
        const a = document.createElement('a');
        a.href = CONFIG.BASE_PATH + href;
        a.textContent = textContent;
        if (className) a.className = className;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            Router.navigate(href);
        });
        return a;
    },

    // clear container and append new content
    render(container, ...children) {
        container.innerHTML = '';
        children.forEach(child => {
            if (typeof child === 'string') {
                container.insertAdjacentHTML('beforeend', child);
            } else {
                container.appendChild(child);
            }
        });
    },

    // build a table from headers and row data
    buildTable(headers, rows) {
        const table = this.el('table', 'age-table');

        const thead = this.el('thead');
        const headerRow = this.el('tr');
        headers.forEach(h => headerRow.appendChild(this.el('th', null, h)));
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = this.el('tbody');
        rows.forEach(rowData => {
            const tr = this.el('tr');
            rowData.forEach(cell => {
                const td = this.el('td');
                if (cell instanceof HTMLElement) {
                    td.appendChild(cell);
                } else {
                    td.textContent = cell ?? 'Unknown';
                }
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        const wrap = this.el('div', 'table-wrap');
        wrap.appendChild(table);
        return wrap;
    },

    // show a loading spinner in the container with optional step progress
    showLoading(container, step, total) {
        if (step && total) {
            container.innerHTML = `<div class="loading">Loading... [${step}/${total}]</div>`;
        } else {
            container.innerHTML = '<div class="loading">Loading...</div>';
        }
    },

    setTitle(subtitle) {
        document.title = subtitle ? `${subtitle} – Actor Ages` : 'Actor Ages';
    },

    // show an error message
    showError(container, message) {
        container.innerHTML = `<div class="error">${message}</div>`;
    },
};
