#!/bin/sh
rm -r src
git checkout develop src/
cd src
bundle exec jekyll build --destination ../_site

cd ..
rsync -av --delete --exclude _site/ --exclude src/ --exclude .git/ --exclude .gitignore --exclude .nojekyll --exclude _config.yml --exclude build_Site.sh --exclude google06d21d7bd9977893.html _site/ ./
rm -r _site
