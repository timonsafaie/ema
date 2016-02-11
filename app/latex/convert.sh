#!/bin/bash

perl tex2png.pl -dpi $1 -package asmath -package amssymb -package latexsym -file $2.tex -output $2

chown ec2-user:www $2.png
chown ec2-user:www $2.tex

mv $2.png ../output/images/
mv $2.tex ../output/tex/
