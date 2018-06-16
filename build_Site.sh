#!/bin/sh
git checkout HEAD src/
cd src
bundle exec jekyll build --destination ../_site

cd ..
rsync -av _site/* .
rm -r _site
