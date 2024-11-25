ffmpeg -i $1.mp3 -f wav - | od -An -td2 -w2 -v> $1.temp.txt
tr '\n' ',' < $1.temp.txt > $1.txt
rm $1.temp.txt