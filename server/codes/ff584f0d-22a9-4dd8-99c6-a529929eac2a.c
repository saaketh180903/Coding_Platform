#include <stdio.h>
int main() {
    int n;
    scanf("%d",&n);
    int arr[n];
    for(int i=0;i<n;i++){
        int num;
        scanf("%d",&num);
        arr[i]=num;
    }
    int maximum=arr[0];
    for(int i=1;i<n;i++){
        if(maximum<arr[i]){
            maximum=arr[i];
        }
    }
    printf("%d",maximum);
    return 0;
}