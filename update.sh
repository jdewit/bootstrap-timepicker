#!/bin/sh
echo 'Copying assets to gh-pages'

git checkout gh-pages

git checkout master css/bootstrap-timepicker.min.css
git checkout master js/bootstrap-timepicker.min.js

git add .
git commit -m 'Update assets'

echo 'On branch gh-pages'

