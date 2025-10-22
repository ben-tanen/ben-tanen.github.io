const clientId = "9b5e61a0dd144744930212f2af73076b";
const redirectUri = "http://127.0.0.1:4000/projects/2025/10/20/album-progress.html";
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
        window.history.replaceState({}, document.title, redirectUri);
    } else {
        console.error("Token exchange failed:", data);
    }
    return data;
}
