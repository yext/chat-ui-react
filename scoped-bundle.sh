#!/bin/bash

# generate tailwind css bundle (include minification)
npm run tailwindcss -- -o bundle.css --minify -c tailwind.config.js

# scope styling to class name "yext-chat"
WRAPPER_CLASSNAME="yext-chat"
CSS_BUNDLE=$(cat bundle.css)
echo ".${WRAPPER_CLASSNAME} { ${CSS_BUNDLE} }" > bundle.css

# unwrap nesting to follow native css format
npm run postcss -- bundle.css -o bundle.css

# replace top level targets (html and body) that is now nested into yext-chat
# to directly target yext-chat (e.g. ".yext-chat html {...}" => ".yext-chat {...}")
sed -i '' 's/html{/{/' bundle.css
sed -i '' 's/body{/{/' bundle.css

# move bundle to lib
mv bundle.css ./lib/bundle.css
