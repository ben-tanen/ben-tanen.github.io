const clientId = "9b5e61a0dd144744930212f2af73076b";
const redirectUri = `${window.location.protocol}//${window.location.href.includes("ben-tanen.com") ? "ben-tanen.com" : "127.0.0.1:4000"}/projects/2025/10/20/album-progress.html`;
const scopes = [
    "user-read-playback-state",
    "user-read-currently-playing"
];

function generateRandomString(length) {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () => possible.charAt(Math.floor(Math.random() * possible.length))).join("");
}

async function sha256(plain) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest("SHA-256", data);
}

function base64urlencode(a) {
    let str = "";
    const bytes = new Uint8Array(a);
    for (let i = 0; i < bytes.byteLength; i++) str += String.fromCharCode(bytes[i]);
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function generateCodeChallenge(codeVerifier) {
    const hashed = await sha256(codeVerifier);
    return base64urlencode(hashed);
}

async function login() {
    const codeVerifier = generateRandomString(128);
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    localStorage.setItem("code_verifier", codeVerifier);

    const state = generateRandomString(16);
    const scope = scopes;

    const args = new URLSearchParams({
        response_type: "code",
        client_id: clientId,
        scope,
        redirect_uri: redirectUri,
        state,
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
    });

    window.location = "https://accounts.spotify.com/authorize?" + args.toString();
}

async function handleCallback() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (!code) return null;

    const codeVerifier = localStorage.getItem("code_verifier");

    const body = new URLSearchParams({
        client_id: clientId,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
    });

    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
    });

    const data = await response.json();
    if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        if (data.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("expires_at", String(Date.now() + data.expires_in * 1000));
        window.history.replaceState({}, document.title, redirectUri);
    } else {
        console.error("Token exchange failed:", data);
    }
    return data;
}

function isTokenValid() {
    const token = localStorage.getItem("access_token");
    const expiresAt = localStorage.getItem("expires_at");
    if (!token || !expiresAt) return false;
    return Date.now() < Number(expiresAt) - 60000;
}

async function refreshAccessToken() {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) return null;

    const body = new URLSearchParams({
        client_id: clientId,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
    });

    try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body,
        });

        const data = await response.json();
        if (data.access_token) {
            localStorage.setItem("access_token", data.access_token);
            if (data.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);
            localStorage.setItem("expires_at", String(Date.now() + data.expires_in * 1000));
            return data.access_token;
        }
    } catch (e) {
        console.error("Token refresh failed:", e);
    }

    clearTokens();
    return null;
}

async function getValidToken() {
    if (isTokenValid()) return localStorage.getItem("access_token");

    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) return await refreshAccessToken();

    return null;
}

function clearTokens() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("code_verifier");
}
