#!/usr/bin/env python3
"""Local preview server. Dev convenience only — not part of the deployed site.

    python3 serve.py   ->  http://127.0.0.1:4173

Threaded on purpose: the reel clips are large, and a single-threaded server
stalls every other request while one video is streaming.
"""
import functools, http.server, os

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)

Handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
server = http.server.ThreadingHTTPServer(("127.0.0.1", 4173), Handler)
server.daemon_threads = True
print("serving", ROOT, "on http://127.0.0.1:4173")
server.serve_forever()
