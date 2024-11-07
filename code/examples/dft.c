#include<stdio.h>
#include<math.h>

#define PI 3.14159265

double signal[100] = {-0.01298834,  0.62287525,  0.64266088,  0.39309558,  0.55407458,
        0.46687195,  0.07696683, -0.13428404,  0.2125712 ,  0.56682695,
        0.35255289, -0.07344963, -0.19440193, -0.39828423, -0.76045664,
       -0.93904834, -0.64378784, -0.10538606, -0.0191478 , -0.0770602 ,
        0.20759604,  0.26489319, -0.01446728, -0.10203322,  0.18541585,
        0.71846037,  0.65895866,  0.55279442,  0.47323697,  0.320843  ,
       -0.19692215, -0.70079488, -0.50351568, -0.2084213 , -0.39026458,
       -0.40464819, -0.21803275, -0.06597763, -0.43361738, -0.59737773,
       -0.26324774,  0.14985702,  0.40232333,  0.36181805,  0.71280815,
        0.88267642,  0.44570612, -0.04845183,  0.09024869,  0.12878691,
       -0.01379347, -0.16357949,  0.04875364,  0.01579485, -0.42485222,
       -0.86966164, -0.82641629, -0.40154267, -0.41441184, -0.24656304,
        0.29293001,  0.65095673,  0.46211624,  0.06227949,  0.14192956,
        0.45974134,  0.32732394,  0.2491743 ,  0.51755635,  0.6134795 ,
        0.21664776, -0.3395053 , -0.53987479, -0.49349075, -0.70477015,
       -0.80705511, -0.17017299,  0.07967089, -0.09223614, -0.28124558,
       -0.21687388,  0.14495917,  0.09015705,  0.08465125,  0.58524868,
        0.9818192 ,  0.78087388,  0.38900172,  0.1761942 ,  0.04442821,
       -0.29729617, -0.49258935, -0.17076793, -0.06084692, -0.16322715,
       -0.46860467, -0.45899852, -0.44382644, -0.55613981, -0.55769558};

void DFT(double* signal, double* real_components, double* img_components, int N)
{
    for(int k = 0; k < N; k++)
    {
        //---snippet-start
        for(int n = 0; n < N; n++)
        {
            real_components[k] += signal[n] * cos(-2*PI*k*n/N);
            img_components[k]  += signal[n] * sin(-2*PI*k*n/N);
        }
        //---snippet-end
        int complex_separator = img_components[k] < 0 ? '\0' : '+';
        printf("%d) %f%c%fi\n", k, real_components[k], complex_separator, img_components[k]);
    }
}

void IDFT(double* signal, double* real_components, double* img_components, int N)
{
    for(int k = 0; k < N; k++)
    {
        for(int n = 0; n < N; n++)
        {
            real_components[k] += signal[n] * cos(2*PI*k*n/N);
            img_components[k]  += signal[n] * sin(2*PI*k*n/N);
        }
        int complex_separator = img_components[k] < 0 ? '\0' : '+';
        printf("%d) %f%c%fi\n", k, real_components[k], complex_separator, img_components[k]);
    }
}

int main()
{
    const int N = 100;
    double real_components[N] = {0};
    double img_components[N] = {0};

    DFT(signal, real_components, img_components, N);


    
}