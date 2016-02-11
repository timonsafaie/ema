#!/bin/bash

perl tex2png.pl -dpi $1 -package amsmath -package amssymb -package latexsym -package asl -package mathtools -package graphicx -package gensymb -package fancyhdr -package amsfonts -package mathdesign -package mathpazo -package fdsymbol -file $2.tex -output $2

chown ec2-user:www $2.png
chown ec2-user:www $2.tex

mv $2.png ../../help/output/images/
mv $2.tex ../../help/output/tex/
