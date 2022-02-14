#!/bin/bash

k3s kubectl -n kubernetes-dashboard describe secret admin-user-token | grep '^token' | awk '{print $2}'

#  k3s kubectl -n kube-system describe secret $(microk8s kubectl -n kube-system get secret | grep default-token | cut -d " " -f1) | grep token: | awk '{print $2}'
