#include <stdio.h>
#include <stdlib.h>

int main() {
    // Print the operating system name
    printf("Operating System: %s\n", getenv("OS") ? getenv("OS") : "Unknown");

    // Print the system architecture
    #ifdef _WIN64
        printf("Architecture: 64-bit Windows\n");
    #elif _WIN32
        printf("Architecture: 32-bit Windows\n");
    #elif __linux__
        printf("Architecture: Linux\n");
    #elif __APPLE__ || __MACH__
        printf("Architecture: macOS\n");
    #else
        printf("Architecture: Unknown\n");
    #endif

    // Print the processor type (if available)
    FILE *fp;
    char buffer[128];
    
    // Command to get CPU information
    #ifdef __linux__
        fp = popen("lscpu | grep 'Model name'", "r");
    #elif _WIN32 || _WIN64
        fp = popen("wmic cpu get caption", "r");
    #else
        printf("Processor information not available for this OS.\n");
        return 1;
    #endif
    
    if (fp == NULL) {
        printf("Failed to run command\n");
        return 1;
    }

    // Read and print the output of the command
    while (fgets(buffer, sizeof(buffer), fp) != NULL) {
        printf("Processor: %s", buffer);
    }
    
    pclose(fp);
    
    return 0;
}