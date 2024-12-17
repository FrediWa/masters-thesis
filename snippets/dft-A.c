for(int n = 0; n < N; n++)
{
    real_components[k] += signal[n] * cos(-2*PI*k*n/N);
    img_components[k]  += signal[n] * sin(-2*PI*k*n/N);
}
