for k in range(N): 
   for n in range(N): 
       X[k] += signal[n] * cmath.exp(-2j * PI * k * n / N)