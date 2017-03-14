import os, sys, colorama
import spotipy
import spotipy.util as util

colorama.init()

os.environ["SPOTIPY_CLIENT_ID"]     = "8ab10b4296bd4266b959f2caee8dd7a4"
os.environ["SPOTIPY_CLIENT_SECRET"] = "4de2b4d46bd44c86b424e87582d4876b"
os.environ["SPOTIPY_REDIRECT_URI"]  = "http://ben-tanen.com"

user_id   = '129874447'
token     = util.prompt_for_user_token(user_id)
sp        = spotipy.Spotify(auth = token)
playlists = sp.user_playlists(user = user_id)


while playlists != None:
    for playlist in playlists['items']:
        if "Story Time" in playlist['name'] or "Musical Shots" in playlist['name']:
            date = playlist['name'][12:22].replace("-","/")
            print "%s, %s%s" % (date, playlist['uri'], (", " + playlist['name'][23:]) if len(playlist['name']) > 22 else "")

    playlists = sp.next(playlists)