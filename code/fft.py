import cmath
import numpy as np

PI = 3.141592653


"""
An FFT that prints what it does along the way. 
"""
def printfft(samples, depth): 
    print(f"{'   ' * depth}fft({samples})")
    N = len(samples) 
    print(f"{'   ' * depth}N =", N)
    if N == 1:
        return samples

    Ey = samples[0::2]
    Oy = samples[1::2]

    Ey = fft(Ey, depth + 1)
    Oy = fft(Oy, depth + 1)
    y = [None] * N
    for k in range(0, N//2):
        twiddle = np.exp(-2j * PI * k / N) #i-th twiddle factor
        y[k] = Ey[k] + Oy[k] * twiddle
        print(f"{'   ' * depth}{Ey[k]} + {Oy[k]} * {twiddle} = {y[k]}")
        y[k + N//2] = Ey[k] - Oy[k] * twiddle
        print(f"{'   ' * depth}{Ey[k]} - {Oy[k]} * {twiddle} = {y[k + N//2]}")

    print(f"{'   ' * depth}y = {y}")
    return y


"""
Typical Radix-2 FFT
"""
def fft(samples): 
    N = len(samples) 
    
    # Recursive base case
    if N == 1:
        return samples

    # Recursive step
    Ey = fft(samples[0::2])
    Oy = fft(samples[1::2])

    # Combination step
    y = [0] * N
    for k in range(0, N//2):
        twiddle = np.exp(-2j * PI * k / N) # k-th twiddle factor
        y[k]        = Ey[k] + Oy[k] * twiddle 
        y[k + N//2] = Ey[k] - Oy[k] * twiddle 

    return y

for f in fft([0, 1, 2, 3, 4, 5, 6, 7], 0):
    print(np.round(f, 1))