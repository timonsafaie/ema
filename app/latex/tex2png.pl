#! /usr/bin/env perl

use strict;
use warnings;
use Compress::Zlib; # for 'crc'

my $version = "tex2png.pl v1.6.1 Charles Plager".
  " cplager_tex2png[at]email(dot)plager[dot]net";

###########################################################################
## This software takes either a complete latex file or a latex snippet   ##
## (from STDIN) and converts it into a graphics file (PNG, by            ##
## default).  It also can enbed the latex source code in the PNG file    ##
## to make it easy to edit and update the resulting PNG files.           ##
##                                                                       ##
##              http://www-cdf.fnal.gov/~cplager/latex/                  ##
###########################################################################


#####################################
## This script has been derived from:
## 'texttogif' by John Walker  
## http://www.fourmilab.ch/
## 
## With text embedding from: 
## 'png-tEXt.pl' written by Greg Newton - gnewt <at> ozemail.com.au
## http://mc2.vicnet.net.au/home/newtons/web/png/png-text-pod.html
##    


######################
##   Required Software
##
##   Perl        >= 5.6
##   -  Compress::Zlib Perl library
##   LaTeX2e     
##   dvips       
##   Netpbm      
##


###################
## Revision History 
##
## 1.6.1  060409 cplager
## - removed need for external 'ps2gif.sh'
##
## 1.6.0  060409 cplager
## - removed need for external 'png-tEXt.pl'
##
## 1.5.2  060402 cplager
## - added -package option
##


## If the following files are not in path, please put full path in the
## strings below:
## Image encoding and decoding commands for GIF and PNG output.
my $cmdGIFencode = 'ppmtogif';
my $cmdGIFdecode = 'giftopnm';
my $cmdPNGencode = 'pnmtopng';
my $cmdPNGdecode = 'pngtopnm';
## Leave blank for no embedding source by default, "true" otherwise
my $embed = "true";

#########################
# Default Configuration #
#########################

## default resolution of resulting graphics files
my $dpi = 150;

## Default image creation modes
my $imageCmdD = $cmdPNGdecode;
my $imageExt = 'png';

## Latex header and footer used for STDIN snippets.

my $header = "\\documentclass{article}
\\pagestyle{empty}
\\usepackage{xspace,amssymb,amsfonts,amsmath,color}
\\usepackage{mathptmx} % pretty fonts
%%%
\\begin{document}
\n";
my $footer = "\\end{document}\n";

######################################################################
##      You shouldn't need to change anything below this point.     ##
######################################################################
(my $thiscommand = $0) =~ s|.+/||g;
my $tempbase = "tex2png_temp$$";
my $temptex = "$tempbase.tex";
my $temptexlog = "$tempbase.texout";
my $templog = "$tempbase.log";
my $tempps  = "$tempbase.ps";

my @filesToCleanup;

push @filesToCleanup, $templog, $temptex, $tempps;


################## Main Program ####################

#
#   Command line option processing
#

my ($mathmode, $useTransparent, $useStdin) = 
  ("true", "white", "true");
my ($output, $debug, $color, $extract, $extractPng);
my $argline = "@ARGV";
my @packages;
while (@ARGV && $ARGV[0] =~ /^-/) {
   $_ = shift(@ARGV);
   s/^--/-/;				# Allow GNU-style -- options
   if (/^-ext/) {
      $extractPng = shift @ARGV;
      $extract = shift @ARGV;
      if ($extractPng !~ /\.png$/i) {
         die "You must provinde a .png file (!= $extractPng)\n";
      }
      if (!$extract) {
         ($extract = $extractPng) =~ s/\.png$/.tex/;
      }
      next;
   }
   if (/^-pa/) {           # -package XXX
      my $package = shift @ARGV;
      push @packages, $package;
      next;
   }
   if (/^-dp/) {			# -dpi nnn
	  $dpi = shift(@ARGV);
	  next;
   } 
   if (/^-s/i) {			# -stdin
	  $useStdin = "true";
	  next;
   } 
   if (/^-f/i) {			# -file
	  $useStdin = "";
	  next;
   } 
   if (/^-de/i) {			# -debug
	  $debug = "true";
	  next;
   } 
   if (/^-w/i) {			# -white
	  $useTransparent = "";
	  next;
   } 
   if (/^-o/i) {	        # -output
	  $output = shift @ARGV;
	  next;
   } 
   if (/^-te/i) {			# -textmode
	  $mathmode = "";
	  $useStdin = "true";
	  next;
   } 
   if (/^-gi/) {			# -gif
	  $imageCmdD = $cmdGIFdecode;
	  $imageExt = 'gif';
	  next;
   } 
   if (/^-h/) {			# -help
	  help();
   } 
   if (/^-p/) {			# -png
	  $imageCmdD = $cmdPNGdecode;
	  $imageExt = 'png';
	  next;
   } 
   if (/^-v/) {			# -version
	  print("Version $version\n");
	  exit(0);
   }
} # while -arg

if (@packages) {
   my $package = '\usepackage{'. join(',', @packages)."}";
   $header =~ s/%%%/$package/;
}

if ($extract) {
   print "Extracting tex source from $extractPng to $extract\n";
   my $temp = "$extract.temp";
   my $command = "$cmdPNGdecode -text $temp $extractPng 2>&1 1> /dev/null";
   #print "command $command\n";
   system $command;
   if (-z $temp) {
      print "No source code embedded.  Sorry.\n";
      unlink $temp;
      exit;
   }
   open (SOURCE, $temp) or die "Can't opne $temp for input\n";
   open (TARGET, ">$extract") or die "Can't open $extract for output\n";
   while (<SOURCE>) {
      if (/^TEX\s+/) {
         print TARGET replaceSpecialCharacters($');
      }
   }
   close SOURCE;
   close TARGET;
   unlink $temp;
   exit;
}

if ($embed && $imageExt !~ /png/i) {
   warn "Warning: Can not enbed latex source file into .gif images files\n";
   $embed = "";
}


my $input = $ARGV[0];

my @stdinLines;
if ($useStdin) {
   print "Please enter text, finished by <ctrl>-D on a blank line.\n";
   @stdinLines = <>;
   print "\nThank you.\n";
   open (TARGET, ">", $temptex);
   print TARGET $header;
   print TARGET "\\begin{displaymath}\n" if ($mathmode);
   foreach (@stdinLines) {
	  print TARGET if (/\S/ || ! $mathmode);
   }
   print TARGET "\\end{displaymath}\n" if ($mathmode);
   print TARGET $footer;
   close TARGET;
   $input = $temptex;
}

if (! $output) {
   ($output = $input) =~ s/\.tex//i;
   $output .= ".$imageExt";
} elsif ($output && $output !~ /\./) {
   $output .= ".$imageExt";
}

$input =~ s/(.*)\.tex$/$1/;
my $dvi = "$input.dvi";
my $texout = `latex -interaction=nonstopmode $input 2>&1`;

push @filesToCleanup, "$input.dvi", "$input.aux", "$input.log";

if (checkForProblems ($texout)) {
   print "Sorry, latex didn't compile\n\n $texout\n";
   cleanup() unless ($debug);
}

print "Latex compilation successful. Creating '$imageExt' file.\n\n\n";

`dvips -o $tempps $input 2>&1`;

# convert the ps file to the image file wanted
my %optionsHash;
$optionsHash{dpi}         = $dpi;
$optionsHash{transparent} = $useTransparent;
convertPs2Png ($tempps, $output, %optionsHash);

#   Print the reference to include this figure, including width and height,
#   to standard error.
my $resolution = `$imageCmdD $output 2>&1 | pnmfile`;
if ($resolution =~ /(\d+) by (\d+)/) {
   print STDERR "\n\n<img src=\"$output\" width=\"$1\" height=\"$2\">\n";
   if ($useStdin) {
      print STDERR "<!--\nunix: $thiscommand $argline\n",@stdinLines,"-->\n";
   }
} # if resolution


if ($embed) {
   ($embed = $input) =~ s/\.tex$//;
   $input .= ".tex" if (!-e $input);
   $embed .= ".emb";
   open (SOURCE, $input) or die "Can't open $input for reading.\n";
   open (TARGET, ">$embed") or die;
   $argline =~ s/-{1,2}f\w*//;
   $argline =~ s/-{1,2}te\w*//;
   $argline =~ s/-{1,2}s\w*//;
   my $line = "%% $thiscommand $argline -file XXX.tex\n";
   print TARGET removeSpecialCharacters($line);
   while (<SOURCE>) {
      print TARGET removeSpecialCharacters($_);
   }
   close TARGET;
   close SOURCE;
   my $temppng = "$tempbase\_$output";
   system "mv $output $temppng";
   my %tEXt;
   $tEXt{'TEX'} = "\@$embed";
   png_tEXt ($temppng, $output, \%tEXt);
   push @filesToCleanup, $temppng, $embed;
} # if embed
    
if ($debug) {
   print "Not cleaning up\n";
} else {
   cleanup();
}

#################
## Subroutines ##
#################

sub removeSpecialCharacters {
   my $line = shift;
   $line =~ s/(\W)/sprintf("%%%02x", ord($1))/ge;
   return $line;
}

sub replaceSpecialCharacters {
   my $line = shift;
   $line =~ s/%(\w{2})/chr(hex($1))/ge;
   return $line;
}

sub cleanup {
   foreach my $file (@filesToCleanup) {	  
	  unlink $file if (-e $file);
   } # foreach $file
   exit;
}

sub checkForProblems {
   my $line = shift;
   my @lines = split /\n/, $line;
   my $retval = "";
   foreach (@lines) {
	  if (/^\!/) {
		 $retval = "true";
	  }
   } # foreach
   return $retval;
}

sub help {
   print <<"EOD"
usage: $thiscommand [ options ] [texfile]
  Options:
      -debug            Debug mode: doesn't delete temporary files
      -dpi n            Set rendering dots per inch to n (default $dpi)
      -extract bla.png  Extract latex source code from 'bla.png' 
      -file             Get input from file, not STDIN
      -gif              Generate GIF image 
      -help             Print this message
      -output bla       Outputs 'bla.png'
      -package XXX      Includes package 'XXX' in header (can be used 
                        multiple times)
      -png              Generate PNG image (default)
      -stdin            Get tex content from STDIN (header and footer defined)
      -text             Don't start in math mode with '-stdin' option
      -version          Print version number
      -white            Makes a white (instead of transparent) background
$version
EOD
	 ;
   exit;
}

sub convertPs2Png {
   my $ps_file = shift;
   my $output_file = shift;
   my %optionsHash = @_;

   my $detail_default = 1.0;
   my $margin_default = 0;
   my $dpi_default = 100;
   my $rotate_default = 0;
   my $xsize_inch_default = 12;
   my $ysize_inch_default = 12;
   my $text_alpha_bits_default = 4;
   my $graphics_alpha_bits_default = 4;
   my %valuesHash;
   $valuesHash {dpi} = $dpi_default;
   $valuesHash {detail_ratio} = $detail_default;
   $valuesHash {margin_width} = $margin_default;
   $valuesHash {rotate_angle} = $rotate_default;
   $valuesHash {xsize_inch} = $xsize_inch_default;
   $valuesHash {ysize_inch} = $ysize_inch_default;
   $valuesHash {text_alpha_bits} = $text_alpha_bits_default;
   $valuesHash {graphics_alpha_bits} = $graphics_alpha_bits_default;

   # overwrite the defaults with the options hash
   foreach my $key (keys %optionsHash) {
      $valuesHash{$key} = $optionsHash{$key};
   }

   # convert command
   my $convert_command;
   if ($output_file =~ /\.gif$/i) {
      $convert_command = $cmdGIFencode;
   } elsif ($output_file =~ /\.png$/i) {
      $convert_command = $cmdPNGencode;
   } else {
      die "Target must be a .png or .gif file.  Aborting.\n";
   }

   my $reduction_ratio = sprintf (".3f", 1 / $valuesHash{detail_ratio}); 

   #dpi of working field

   my $work_dpi = $valuesHash{detail_ratio} * $valuesHash{dpi}; 

   #size of working field in pixels
   my $pix_Xsize =  $work_dpi * $valuesHash{xsize_inch};
   my $pix_Ysize =  $work_dpi * $valuesHash{ysize_inch};

   unlink $output_file;

   my $gscommand = "gs < /dev/null  -sDEVICE=ppmraw -dTextAlphaBits=$valuesHash{text_alpha_bits} -dGraphicsAlphaBits=$valuesHash{graphics_alpha_bits} -sOutputFile=- -g$pix_Xsize"."x"."$pix_Ysize -r$work_dpi -q -dNOPAUSE $ps_file | pnmcrop -white";

   # rotate command
   if ($valuesHash{rotate_angle}) {
      $gscommand .= " | pnmrotate $valuesHash{rotate_angle}";
   }

   # scale command
   if (1 != $valuesHash{detail_ratio}) {
      $gscommand .= " | pnmscale $valuesHash{reduction_ratio}";
   }

   # margin command
   if ($valuesHash{margin_width}) {
      $gscommand .= " | pnmmargin -white $valuesHash{margin_width}";
   }

   my $color_reduction_command = "pnmdepth 15";

   # transparent option
   my $transparent_option = "";
   if ($valuesHash{transparent}) {
      $transparent_option = "-transparent $valuesHash{transparent}";
   }


   $gscommand .= "| $color_reduction_command | ppmquant 256 | $convert_command -interlace $transparent_option -";

   system "$gscommand > $output_file";

   return;
}

################## png-tEXt.pl ##################
################## Subroutines ##################

# This trimmed from 'png-tEXt.pl' written by 
# Greg Newton - gnewt <at> ozemail.com.au
# http://mc2.vicnet.net.au/home/newtons/web/png/png-text-pod.html

sub png_tEXt {
   my $pngFile = shift;
   my $output  = shift;
   my $tEXtRef = shift;
   my (
       $ihdr,           # IHDR chunk
       $png,            # png data that doesn't concern us (just copy)
       $pngsize,        # Total size of png
       $pos,            # position in $png
       $sig,            # PNG signature
       $tchunk,         # content of text chunk
       $text,           # 'string' of all tEXt chunks with CRC, etc.
      );


   $pngsize = -s $pngFile;

   open(IN, "$pngFile") or die "Cannot find input file $pngFile.\n$!";
   binmode(IN);
   read(IN, $sig, 8);

   if (! ValidateSignature($sig)) {
      close(IN);
      warn "$pngFile does not have a valid png signature.  Aborting embedding\n";
      return;
   }

   read(IN, $ihdr, 25 ) ;
   read(IN, $png, $pngsize-8-25);
   close(IN);

   $pos=0;

   while (1) {
      my $chunk = substr($png, $pos, 8);
      my ($length, $type) = unpack("N A4", $chunk);
      
      if ($type eq 'IEND' || $pos > ($pngsize - 12)) {
         last;
      }
      
      $pos += $length + 12;
   }

   foreach my $keyword ( keys %$tEXtRef ) {
      my $tbuffer;
      # @ indicates get text from a file
      if ( substr($tEXtRef->{$keyword},0,1) eq '@' ) {
         open(IN, "<".substr($tEXtRef->{$keyword},1) ) 
           or die "Cannot find text source file ".
             substr($tEXtRef->{$keyword},1)."\n$!" ;
         $tbuffer = join '', <IN> ;
         close(IN) ;
      } else {
         $tbuffer = $tEXtRef->{$keyword} ;
         $tbuffer =~  s/\\([tnrfbae])/control_char($1)/eg;
      } # else if 
      $tchunk = sprintf "%s%c%s", $keyword, 0, $tbuffer ;
      $text .= pack "N A* N", (length( $tchunk ), 
                               'tEXt'.$tchunk, &crc32( 'tEXt'.$tchunk ) ) ;
      $pngsize += length($tchunk) + 8 ;
   }                            # foreach $keyword

   $png = $sig.$ihdr.$text.$png;

   open(OUT, ">$output") or die "Cannot open output file $output.\n$!";
   binmode(OUT);
   print OUT $png ;
}


# ChunkPrint
sub ChunkPrint {
   
}

# ValidateSignature
sub ValidateSignature {
   my $sig = shift;
   $sig eq "\x89PNG\r\n\x1a\n" && return 1;
   return 0;
}

# control_char
sub control_char {
   my $string = shift;
   $string =~  tr/tnrfbae/\t\n\r\f\b\a\e/; 
   return $string;
}

########### End png-tEXt.pl subroutines ##########

