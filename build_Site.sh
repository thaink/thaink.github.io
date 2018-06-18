#!/bin/sh
./clean.sh
cd src
bundle exec jekyll build --destination ../_site
cd ../_site
jekyll serve
