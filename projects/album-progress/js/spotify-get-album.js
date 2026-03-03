
// GENERAL HELPER FUNCTIONS

function convertMsToHMS(ms) {
    const h = Math.floor(ms / 3.6e6),
          m = Math.floor((ms % 3.6e6) / 60e3),
          s = Math.floor((ms % 60e3) / 1e3);
    if (h > 0) {
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    } else {
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
}

function truncateString(string, maxLength) {
    return (string.length > maxLength) ? (string.slice(0, maxLength - 3) + "...") : string;
}

// GET DATA FROM SPOTIFY

function extractAlbumId(uriOrId) {
      const match = uriOrId.match(/spotify:album:([a-zA-Z0-9]+)/);
      return match ? match[1] : uriOrId;
}

async function getAlbumById(id, currentTrack = {trackDiscNumber: 0, trackNumber: 0, trackProgressMs: 0, trackProgressPct: 0}) {
    const token = await getValidToken();
    if (!token) {
        alert("Not logged in yet!");
        return;
    }

    const res = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    const [tracks, discs] = await getAllTracks(data.tracks, token),
          currentTrackNumber = currentTrack.trackNumber + d3.sum(discs.filter(disc => disc[0] < currentTrack.trackDiscNumber), disc => disc[1]);

    d3.select("div#album-progress-container").classed("hidden", false);
    createAlbumHeader(
        album = {
            name: data.name,
            id: data.id
        },
        artist = data.artists.map(a => a.name).join(", "),
        nTracks = {
            progress: currentTrackNumber > 0 ? (currentTrackNumber - 1) + currentTrack.trackProgressPct : 0,
            total: tracks.length
        },
        duration = {
            progress: d3.sum(tracks, d => d.trackDurationMs * (d.trackNumber < currentTrackNumber ? 1 : 0)) + currentTrack.trackProgressMs,
            total: tracks.map(d => d.trackDurationMs).reduce((ps, a) => ps + a, 0)
        });
    createTrackList(tracks, currentTrack = { ...currentTrack, trackNumber: currentTrackNumber });
}

async function getCurrentAlbum() {
    const token = await getValidToken();
    if (!token) {
        alert("Not logged in yet!");
        return;
    }

    const res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 204 || res.status > 400) {
        alert("No track is currently playing or unable to fetch playback info.");
        return;
    }

    const data = await res.json();
    if (!data.item) {
        alert("No curently playing info found.");
        return;
    }

    const currentAlbumId = extractAlbumId(data.item.album.uri);
    getAlbumById(currentAlbumId, currentTrack = {
        trackDiscNumber: data.item.disc_number,
        trackNumber: data.item.track_number,
        trackProgressMs: data.progress_ms,
        trackProgressPct: data.progress_ms / data.item.duration_ms
    });
}

function parseTracks(tracks) {
    return tracks.items.map(d => ({
        trackName: d.name,
        trackUri: d.uri,
        trackId: d.id,
        trackDiscNumber: d.disc_number,
        trackNumber: d.track_number,
        trackDurationMs: d.duration_ms
    }));
}

async function getAllTracks(data, token) {

    let allTracks = parseTracks(data);

    let next = data.next;
    while (next) {
        const res = await fetch(next, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        allTracks.push(...parseTracks(data));
        next = data.next;
    }

    const discs = Array.from(d3.rollup(
        allTracks,
        v => d3.max(v, d => d.trackNumber),
        d => d.trackDiscNumber
    ));

    allTracks = allTracks.map(d => {
        const prevTracks = d3.sum(discs.filter(disc => disc[0] < d.trackDiscNumber), disc => disc[1]);
        return { ...d, trackNumber: d.trackNumber + prevTracks };
    });

    return [allTracks, discs];
}

// CREATE VISUALIZATION

function createAlbumHeader(album, artist, nTracks, duration) {
    d3.select("a#album-progress-title-link")
        .attr("href", `https://play.spotify.com/album/${album.id}`)
        .text(album.name);
    d3.select("p#album-progress-artist").text(artist);
    updateHeaderProgress(nTracks, duration);
}

function updateHeaderProgress(nTracks, duration) {
    d3.select("span#album-progress-ntracks1").text(nTracks.progress % 1 == 0 ? nTracks.progress : nTracks.progress.toFixed(1));
    d3.select("span#album-progress-ntracks2").text(nTracks.total);
    d3.select("span#album-progress-ntracks3").text((nTracks.progress / nTracks.total * 100).toFixed(1));
    d3.select("span#album-progress-time1").text(convertMsToHMS(duration.progress));
    d3.select("span#album-progress-time2").text(convertMsToHMS(duration.total));
    d3.select("span#album-progress-time3").text((duration.progress / duration.total * 100).toFixed(1));
}

function createTrackList(tracks, currentTrack = {}) {

    const vizPadding = {
        top: 5,
        left: 0
    }

    const pillDimensions = {
        width: 10,
        radius: 5,
        padding: 3
    }

    const totalDurationMs = d3.sum(tracks, d => d.trackDurationMs),
          minTrackDurationMs = d3.min(tracks, d => d.trackDurationMs),
          allTracksOver30s = minTrackDurationMs >= 30e3;

    const svg = d3.select("svg#album-progress-viz");

    svg.attr("height", totalDurationMs / 3.6e6 * 800);
    const scale = d3.scaleLinear().domain([0, totalDurationMs]).range([0, +svg.attr("height") - vizPadding.top]);

    svg.selectAll("g.track-group").remove();

    const gs = svg.selectAll("g.track-group")
        .data(tracks).enter()
        .append("g")
        .classed("track-group", true)
        .classed("played", d => d.trackNumber < currentTrack.trackNumber)
        .classed("playing", d => d.trackNumber == currentTrack.trackNumber)
        .attr("id", (d, i) => `track-${i + 1}-${d.trackId}`)
        .attr("transform", (d, i) => `translate(${vizPadding.left}, ${vizPadding.top + scale(d3.sum(tracks.filter((d1, i1) => i1 < i), d1 => d1.trackDurationMs))})`);

    const rs = gs.append("rect")
        .attr("class", "track-pill")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", pillDimensions.width)
        .attr("height", d => scale(d.trackDurationMs) - pillDimensions.padding)
        .attr("ry", 5);

    const playingG = gs.filter(d => d.trackNumber == currentTrack.trackNumber);
    playingG.append("clipPath")
        .attr("id", "playing-pill-clip")
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", pillDimensions.width)
        .attr("height", d => scale(d.trackDurationMs) - pillDimensions.padding)
        .attr("ry", 5);
    playingG.append("rect")
        .attr("class", "progress-fill")
        .attr("clip-path", "url(#playing-pill-clip)")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", pillDimensions.width)
        .attr("height", d => (scale(d.trackDurationMs) - pillDimensions.padding) * (currentTrack.trackProgressPct || 0));

    const ts = gs.append("text")
        .attr("x", pillDimensions.width + pillDimensions.padding)
        .attr("y", d => (scale(d.trackDurationMs) - pillDimensions.padding) / 2)
        .style("alignment-baseline", "middle")
        .text(d => `${d.trackNumber}: ${truncateString(d.trackName, 50)} (${convertMsToHMS(d.trackDurationMs)})`);

    gs.on("click", (event, d) => {
        const g = d3.select(gs.filter((d1) => d1.trackNumber == d.trackNumber).node());
        if (g.classed("playing")) {
            g.classed("playing", false);
        } else {
            g.classed("played", !g.classed("played"));
        }
        const all_gs_data = svg.selectAll("g.track-group").data(),
              played_gs_data = svg.selectAll("g.track-group.played").data(),
              playing_gs_data = svg.selectAll("g.track-group.playing").data();
        updateHeaderProgress(
            nTracks = {
                progress: played_gs_data.length + playing_gs_data.length,
                total: all_gs_data.length
            },
            duration = {
                progress: d3.sum(played_gs_data, d => d.trackDurationMs) + d3.sum(playing_gs_data, d => d.trackDurationMs),
                total: d3.sum(all_gs_data, d => d.trackDurationMs)
            }
        );
    });
        
}