# Demo infrastructure

The infrastructure runs on kubernetes.

## Quickstart

Run the `./scripts/setup.sh` file to install `k3s` (a local kubernetes installation).

```bash
./scripts/setup.sh
```

When that has completed, in your terminal try typing the following command:

```bash
k3s kubectl get pods -A
```
