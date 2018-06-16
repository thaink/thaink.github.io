#!/bin/sh
cd src
bundle exec jekyll build --destination ../_site

cd ..
mv _site/* .
rm -r _site
