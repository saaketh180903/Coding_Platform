#include <stdio.h>

int main() {
    int a = 0; // Initialize 'a' to 0
    for (int i = 0; i < 5; i++) {
        int x;
        scanf("%d", &x);
        
        // Update 'a' if 'x' is greater than 'a'
        if (x > a) {
            a = x;
        }
    }
    
    printf("The maximum value is: %d\n", a); // Output the maximum value
    return 0;
}