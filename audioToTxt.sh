ffmpeg -i $1.mp3 -f wav - | od -An -td2 -w2 -v> $1.txt
