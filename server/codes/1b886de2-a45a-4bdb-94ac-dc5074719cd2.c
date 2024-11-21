#include <stdio.h>
int main() {
    int x=0;
    int n;
    scanf("%d",&n);
    for(int i=0;i<n;i++){
        int z;
        scanf("%d",&z);
        if(z>x){
            x=z;
        }
    }
    printf("%d",x);
}