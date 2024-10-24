#include <stdio.h>
#include <stdlib.h>
#include <time.h>

// Define the size of the array
#define ARRAY_SIZE 512000

// Function to generate an array of random floats
void generate_random_floats(float arr[], int size) {
    for (int i = 0; i < size; i++) {
        arr[i] = (float)rand() / RAND_MAX; // Random float between 0 and 1
    }
}

// Bubble Sort algorithm (O(n^2))
void bubble_sort(float arr[], int size) {
    for (int i = 0; i < size - 1; i++) {
        // if(i & 1 == 0)
            // printf("%d\n", i);
        for (int j = 0; j < size - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                float temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

int main() {
    // Seed the random number generator
    srand((unsigned int)time(NULL));

    // Allocate memory for the array
    float *array = (float *)malloc(ARRAY_SIZE * sizeof(float));
    if (array == NULL) {
        printf("Memory allocation failed!\n");
        return 1;
    }

    // Generate random floats
    generate_random_floats(array, ARRAY_SIZE);

    // Measure the sorting time
    clock_t start, end;
    start = clock();

    // Sort the array
    bubble_sort(array, ARRAY_SIZE);

    end = clock();

    // Calculate the elapsed time
    double time_taken = ((double)(end - start)) / CLOCKS_PER_SEC;
    printf("Time taken to sort %d elements: %f seconds\n", ARRAY_SIZE, time_taken);

    // Free the allocated memory
    free(array);

    return 0;
}