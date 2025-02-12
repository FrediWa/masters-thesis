program fftprog
    implicit None
    integer :: k
    complex, dimension(16) :: a, X, b
    real :: tol = 1.0e-30
    
    a = [0, 1, 2, 3, 42, 5, 633, 7, 0, 1, 1, 0, 4222, 5, 633, 7]
    X = fft(a)
    b = ifft(fft(a))

    do k = 1, SIZE(a)
        if (abs(a(k)-b(k)) < tol) then
            print*, "Identical within ", tol
        end if
    end do

contains
    !---snippet-start-B
    function fft(input) result(X)
        complex, dimension(:) :: input
        complex, dimension(SIZE(input)) :: X
        
        X = r2fft(input, 1)
    end function fft

    function ifft(input) result(x)    
        complex, dimension(:) :: input
        complex, dimension(SIZE(input)) :: x
        
        x = r2fft(input, -1)
        x = x / SIZE(input)
    end function ifft
    !---snippet-end-B

    !---snippet-start-A
    recursive function r2fft(input, inverse_factor) result(X)
        complex, dimension(:) :: input
        complex, dimension(SIZE(input)) :: X
        complex, dimension(SIZE(input)/2) :: O, E
        complex :: T, i
        integer :: N, inverse_factor
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
        E = r2fft(input(1:N:2), inverse_factor)
        O = r2fft(input(2:N:2), inverse_factor)

        ! Combination step
        do k = 0, N/2-1
            T = exp(-2*i * PI * k * inverse_factor / N) 
            X(k+1) = E(k+1) + T * O(k+1)
            X(k + N/2+1) = E(k+1) - T * O(k+1)
        end do
        
    end function r2fft
    !---snippet-end-A
end program fftprog

