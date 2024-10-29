#include <stdio.h>

int main() {
    int n;

    // Prompt user for the number of elements in the array
    printf("Enter the number of elements: ");
    scanf("%d", &n);

    int arr[n];
    
    // Take array input from user
    printf("Enter %d elements:\n", n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }

    // Initialize max with the first element
    int max = arr[0];

    // Find the maximum element
    for (int i = 1; i < n; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }

    // Output the maximum element
    printf("The maximum element is: %d\n", max);

    return 0;
}
