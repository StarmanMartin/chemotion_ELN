#!/bin/bash
ln -s ../node_modules node_modules

if [ ! -x yarn ]
then
  npm install -g yarn
fi
yarn install

echo "THIS WILL FAIL UNTIL THE RUBY GEMS ARE INSTALLED BY run-ruby-dev.sh. JUST TRY AGAIN AFTER INSTALLING THEM."
./bin/webpack-dev-server --inline true
