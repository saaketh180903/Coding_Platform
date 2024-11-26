#include <stdio.h>
#include <math.h>
int main() {
    int a=0;
    for(int i=0;i<5;i++){
        int x;
        scanf("%d",&x);
        a=max(x,a);
    }
    printf("%d",a);
}