#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX_NODES 100

typedef struct Queue {
    int items[MAX_NODES];
    int front, rear;
} Queue;

// Function to initialize the queue
void initQueue(Queue* q) {
    q->front = -1;
    q->rear = -1;
}

// Check if the queue is empty
bool isEmpty(Queue* q) {
    return q->front == -1;
}

// Enqueue an element
void enqueue(Queue* q, int value) {
    if (q->rear == MAX_NODES - 1) return; // Queue overflow
    if (q->front == -1) q->front = 0;
    q->rear++;
    q->items[q->rear] = value;
}

// Dequeue an element
int dequeue(Queue* q) {
    if (isEmpty(q)) return -1; // Queue underflow
    int item = q->items[q->front];
    if (q->front >= q->rear) { // Queue is now empty
        q->front = q->rear = -1;
    } else {
        q->front++;
    }
    return item;
}

void bfs(int n, int graph[MAX_NODES][MAX_NODES]) {
    int distances[MAX_NODES];
    bool visited[MAX_NODES] = {false};
    Queue q;
    initQueue(&q);

    // Initialize distances to -1 (unreachable)
    for (int i = 1; i <= n; i++) {
        distances[i] = -1;
    }

    // BFS initialization
    enqueue(&q, 1);
    visited[1] = true;
    distances[1] = 0;

    while (!isEmpty(&q)) {
        int current = dequeue(&q);

        for (int i = 1; i <= n; i++) {
            if (graph[current][i] && !visited[i]) {
                enqueue(&q, i);
                visited[i] = true;
                distances[i] = distances[current] + 1;
            }
        }
    }

    // Print the distances
    for (int i = 1; i <= n; i++) {
        printf("%d ", distances[i]);
    }
    printf("\n");
}

int main() {
    int n;
    scanf("%d", &n);

    int graph[MAX_NODES][MAX_NODES] = {0};
    for (int i = 0; i < n - 1; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        graph[u][v] = 1;
        graph[v][u] = 1;
    }

    bfs(n, graph);

    return 0;
}
