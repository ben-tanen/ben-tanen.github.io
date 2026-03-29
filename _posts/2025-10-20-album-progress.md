---
layout: post
title:  "Album Progress Bar"
date:   2025-10-20 10:05:41
thumbnail: /assets/img/post-thumbnails/album-progress.png
landing-proj: false
new-post-style: true
---

A few weeks ago, I decided I wanted to try and fill in some gaps in my musical knowledge, listening to the albums and artists I had always heard about but never had actually given a listen to. My starting list was already fairly long, but because I struggle with a nasty case of "completionisim" (made up word for those of us that feel the need to 100% every video game we play), I've also decided to supplement my list with as many of the "greatest albums of all time" lists as I can find. I'm working on an additional project to try comparing and visualizing those lists, but in the meantime, I'm just working through my ever-growing list of albums and artists.

While I'm making my way through that list, I've encountered some looooooooong albums and I found myself wanting for a progress bar to show how far I was into a given album. I could obviously look at what track I was on in the context of the longer track list, but some songs can be substantially longer than others, so I decided to cook up this little progress bar tool, which should show more scaled progress through an album. Once you've authenticated with Spotify, you can get the information for the album you're currently listening to or for any album by searching with it's album URI.

I recognize this is a fairly dumb and somewhat pointless tool (I probably should just enjoy the music and not worry about my "progress", but alas...), but I made it anyway so here it is for anyone else that suffers from "completionism" and "progress-tracking-ism".

<div id="album-progress-form">
    <button id="album-progress-login-btn">Log in with Spotify</button>
    <div id="album-progress-actions" class="hidden">
        <button id="album-progress-current-btn">Get Current Album</button>
        <button id="album-progress-playlist-btn" class="hidden">Get Current Playlist</button>
        <form id="album-progress-input-form">
            <input type="text" id="album-progress-input-uri" placeholder="Spotify URI" />
            <button type="submit">Search</button>
        </form>
    </div>
</div>

<div id="album-progress-container" class="hidden">
    <div id="album-progress-header">
        <p id="album-progress-title"><a id="album-progress-title-link">...</a></p>
        <p id="album-progress-artist">...</p>
        <p id="album-progress-progress">Listened to <span id="album-progress-ntracks1">XX</span> of <span id="album-progress-ntracks2">YY</span> tracks (<span id="album-progress-ntracks3">ZZ</span>%), <span id="album-progress-time1">HH:MM:SS</span> of <span id="album-progress-time2">HH:MM:SS</span> run time (<span id="album-progress-time3">AA</span>%).</p>
    </div>
    <svg id="album-progress-viz"></svg>
</div>
<style>
    div#album-progress-form, div#album-progress-container {
        margin: auto;
        max-width: 600px;
    }

    div#album-progress-actions {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
    }

    div#album-progress-form button,
    div#album-progress-actions button {
        padding: 8px 16px;
        border: none;
        border-radius: 30px;
        color: white;
        background-color: #20D760;
        cursor: pointer;
        white-space: nowrap;
    }

    #album-progress-input-form {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    #album-progress-input-uri {
        padding: 8px 12px;
        border: 1px solid #ccc;
        border-radius: 30px;
        font-size: 0.9em;
        width: 180px;
        outline: none;
    }

    #album-progress-input-uri:focus {
        border-color: #20D760;
    }

    div#album-progress-container {
        margin-top: 20px;
    }

    div#album-progress-container.hidden,
    #album-progress-login-btn.hidden,
    #album-progress-actions.hidden,
    #album-progress-playlist-btn.hidden {
        display: none;
    }

    div#album-progress-container p {
        margin-bottom: 5px;
    }

    p#album-progress-title {
        weight: 700;
        font-size: 1.2em;
    }

    svg#album-progress-viz {
        width: 100%;
    }

    g.track-group.played rect.track-pill {
        fill: #77bdee;
    }

    rect.track-pill {
        fill: #999;
    }

    rect.progress-fill {
        fill: transparent;
    }

    g.track-group.playing rect.progress-fill {
        fill: #20D760;
    }

    g {
        cursor: pointer;
    }
</style>

<script src="/projects/album-progress/js/spotify-auth.js"></script>
<script src="/projects/album-progress/js/spotify-get-album.js"></script>
<script>
    function updateAuthUI() {
        const loggedIn = isTokenValid();
        document.getElementById("album-progress-login-btn").classList.toggle("hidden", loggedIn);
        document.getElementById("album-progress-actions").classList.toggle("hidden", !loggedIn);
    }

    document.getElementById("album-progress-login-btn").addEventListener("click", login);
    document.getElementById("album-progress-current-btn").addEventListener("click", getCurrentAlbum);
    document.getElementById("album-progress-playlist-btn").addEventListener("click", getCurrentPlaylist);
    document.getElementById("album-progress-input-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const uri = document.getElementById("album-progress-input-uri").value.trim();
        if (uri.length === 0) {
            alert("Enter a Spotify Album or Playlist URI...");
        } else if (uri.includes("playlist")) {
            const playlistId = extractPlaylistId(uri);
            await getPlaylistById(playlistId, null);
        } else {
            const albumId = extractAlbumId(uri);
            await getAlbumById(albumId);
        }
    });
    handleCallback().then(() => {
        updateAuthUI();
        checkPlaybackContext();
    });
</script>