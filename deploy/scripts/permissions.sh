#!/bin/bash
DIR='/IBM/IHS/HTTPServer/htdocs/biztrack'
USER="wassvc"
GROUP="wasgrp"
#rm -rf "$DIR"
#mkdir "$DIR"
chown -R "$USER:$GROUP" "$DIR"
