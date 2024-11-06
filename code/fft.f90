program fft
    implicit None
    integer :: k
    complex, dimension(8) :: a, X
    a = [0, 1, 2, 3, 4, 5, 6, 7]
    X = r2fft(a)
    do k = 1, 8
        ! printing the value of n and its factorial
        print*,  X(k)
    end do

contains

    recursive function r2fft(input) result(X)
        complex, dimension(:) :: input
        complex, dimension(SIZE(input)) :: X
        complex, dimension(SIZE(input)/2) :: O, E
        complex :: T, i
        integer :: N
        real :: PI

        PI = 3.14159265358979323
        i = cmplx(0, 1)
        N = size(input)

        ! Recursive base case
        if (N == 1) then
            X = input
            return
        end if

        ! Split
        E = r2fft(input(1:N:2))
        O = r2fft(input(2:N:2))

        ! Combination step
        do k = 1, N/2
            T = exp(-2*i * PI * (k-1) / N) 
            X(k) = E(k) + T * O(k)
            X(k + N/2) = E(k) - T * O(k)
        end do
        


    
    end function r2fft

end program fft

