const Router = {
    _container: null,

    init(container) {
        this._container = container;

        // handle browser back/forward
        window.addEventListener('popstate', () => this._resolve());

        // handle the SPA redirect from 404.html
        // if there's a query param from the 404 redirect, restore the clean URL
        const redirectPath = sessionStorage.getItem('actor-ages-redirect');
        if (redirectPath) {
            sessionStorage.removeItem('actor-ages-redirect');
            history.replaceState(null, '', CONFIG.BASE_PATH + redirectPath);
        }

        this._resolve();
    },

    navigate(path) {
        history.pushState(null, '', CONFIG.BASE_PATH + path);
        this._resolve();
    },

    _resolve() {
        const fullPath = window.location.pathname;
        const path = fullPath.replace(CONFIG.BASE_PATH, '') || '/';

        // match routes
        let match;

        if (path === '/' || path === '') {
            Views.search(this._container);
        } else if ((match = path.match(/^\/movie\/(\d+)$/))) {
            Views.movie(this._container, match[1]);
        } else if ((match = path.match(/^\/show\/(\d+)$/))) {
            Views.show(this._container, match[1]);
        } else if ((match = path.match(/^\/show\/(\d+)\/season\/(\d+)\/episode\/(\d+)$/))) {
            Views.episode(this._container, match[1], match[2], match[3]);
        } else if ((match = path.match(/^\/show\/(\d+)\/actor\/(\d+)$/))) {
            Views.showActor(this._container, match[1], match[2]);
        } else if ((match = path.match(/^\/person\/(\d+)$/))) {
            Views.person(this._container, match[1]);
        } else {
            Utils.showError(this._container, 'Page not found');
        }

        // scroll to top on navigation
        window.scrollTo(0, 0);
    },
};
