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
