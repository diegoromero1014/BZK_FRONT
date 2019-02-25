#!/bin/bash
DIR='/IBM/IHS/HTTPServer/htdocs/biztrack'
USER="wassvc"
GROUP="wasgrp"
chown -R "$USER:$GROUP" "$DIR"