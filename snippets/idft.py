for k in range(N): 
   for n in range(N): 
       signal[k] += filtered[n] * cmath.exp(2j * PI * k * n / N)
   signal[k] /= N