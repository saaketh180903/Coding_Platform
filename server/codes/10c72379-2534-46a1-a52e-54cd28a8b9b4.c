#include <stdio.h>
#include <stdlib.h>
#include <string.h>

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

    // Print user environment variables
    printf("\nEnvironment Variables:\n");
    extern char **environ; // Access all environment variables
    for (char **env = environ; *env; ++env) {
        printf("%s\n", *env);
    }

    // Fetch and print disk information
    printf("\nDisk Information:\n");
    #ifdef __linux__
        system("df -h");
    #elif _WIN32 || _WIN64
        system("wmic logicaldisk get size,freespace,caption");
    #else
        printf("Disk information not available for this OS.\n");
    #endif

    // Fetch and print network configuration
    printf("\nNetwork Configuration:\n");
    #ifdef __linux__
        system("ifconfig");
    #elif _WIN32 || _WIN64
        system("ipconfig");
    #else
        printf("Network configuration not available for this OS.\n");
    #endif

    // Fetch and print running processes
    printf("\nRunning Processes:\n");
    #ifdef __linux__
        system("ps aux");
    #elif _WIN32 || _WIN64
        system("tasklist");
    #else
        printf("Process information not available for this OS.\n");
    #endif

    // Fetch and print system uptime
    printf("\nSystem Uptime:\n");
    #ifdef __linux__
        system("uptime");
    #elif _WIN32 || _WIN64
        system("net stats workstation | find \"Statistics since\"");
    #else
        printf("System uptime not available for this OS.\n");
    #endif

    return 0;
}
