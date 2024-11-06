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



FFT(0, 1, 2, 3, 4, 5, 6, 7)
    n=8
    E = 0, 2, 4, 6
    O = 1, 3, 5, 7
    FFT(0, 2, 4, 6)
        n=4
        E = 0, 4
        O = 2, 6
        FFT(0, 4)
            n = 2
            E = 0
            O = 4
            FFT(0)
                n = 1: return [0]
            y_even = [0]
            FFT(4)
                n = 1: return [4]
            y_odd = [4]
            x = 1 // starting twiddle factor
            loop 0<1:
                // 0
                y[0] = y_even[0] +1 * y_odd[0] = 0 + 4
                y[4] = y_even[0] -1 * y_odd[0] = 0 - 4
            return y
        y_even = [4, -4]
        FFT(2, 6)
            n = 2
            E = 2
            O = 6
            FFT(2)
                n = 1: return [0]
            y_even = [2]
            FFT(6)
                n = 1: return [4]
            y_odd = [6]
            x = 1 // starting twiddle factor
            loop 0<1:
                // 0
                y[0] = y_even[0] +1 * y_odd[0] = 2 + 6
                y[4] = y_even[0] -1 * y_odd[0] = 2 - 6
            return y
        y_odd = [8, -6]
        x = 1
        loop 0 < 2:
            // 0
            y[0] = y_even[0] +1 * y_odd[0] = 4 +
            y[4] = y_even[0] -1 * y_odd[0] = 4 -
            // 0
            y[1] = y_even[1] +1 * y_odd[1] = -4 +
            y[5] = y_even[1] -1 * y_odd[1] = -4 -


