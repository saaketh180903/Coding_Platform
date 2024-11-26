#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    printf("Enter the size of the array: ");
    if (scanf("%d", &n) != 1 || n <= 0) {
        printf("Invalid input. Array size must be a positive integer.\n");
        return 1;
    }

    // Allocate memory dynamically
    int *arr = (int *)malloc(n * sizeof(int));
    if (arr == NULL) {
        printf("Memory allocation failed.\n");
        return 1;
    }

    printf("Enter %d elements:\n", n);
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &arr[i]) != 1) {
            printf("Invalid input.\n");
            free(arr); // Free allocated memory before exiting
            return 1;
        }
    }

    int maximum = arr[0];
    for (int i = 1; i < n; i++) {
        if (maximum < arr[i]) {
            maximum = arr[i];
        }
    }

    printf("Maximum element: %d\n", maximum);

    // Free allocated memory
    free(arr);
    return 0;
}
