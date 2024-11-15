- White noise is just the inverse fourier transform of a straight line (all component frequencies in some range have the same amplitude)
- Nyqvist limit: sample/2
- A sequence of early papers [3, 11, 13, 14, 15] still serves as a good reference
for the DFT and FFT. https://theswissbay.ch/pdf/Gentoomen%20Library/Information%20Theory/Compression/THE%20TRANSFORM%20AND%20DATA%20COMPRESSION%20HANDBOOK%20-%20K.R.%20RAO.PDF
- could add a chapter on pitch detection


- Big ideas in the FFT:
    - Divide and conquer (recursion)
    - Symmetry with nth roots of unity


"While frequency spectrum describes the amplitude and phase of each frequency band, cepstrum characterizes variations between the frequency bands. Features derived from cepstrum are found to better describe speech than features taken directly from the frequency spectrum."
https://dsp.stackexchange.com/questions/13/what-is-the-difference-between-a-fourier-transform-and-a-cosine-transform

Turn mp3 into txt 
`ffmpeg -i input.mp3 -f wav - | od -An -td2 -w2 -v> samples.txt`
## Missing fundamental phenomena 
Ears may hear a 100Hz signal even though a small speaker may be physically unable to produce the 100Hz signal
https://en.wikipedia.org/wiki/Missing_fundamental

## Polyphonic content
Polyphonic may be harder to detect, but be a tad easier when where notes are not harmonious
page 1-2
https://gotsopoulos.com/files/Gotsopoulos-BachelorThesis.pdf

## Size of FFT frequency bins
A base singer should be able to go as low as F2 (https://www.reddit.com/r/barbershop/comments/16bmbxz/what_is_the_typical_lowest_note_sang_in_a/?rdt=52566) which is around 87Hz. The difference between F2 and G2 is about 11Hz. With a sample size of 4192 and a sampling rate of 48000, the bin size is about 11.45, meaning both notes are very close to eachother. 
https://gotsopoulos.com/files/Gotsopoulos-BachelorThesis.pdf
It is thus more computationally intense to analyze lower notes