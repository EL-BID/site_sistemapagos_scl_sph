#!/bin/bash

set -o errexit

is_command_present() {
    type "$1" >/dev/null 2>&1
}

is_mac() {
    [[ $OSTYPE == darwin* ]]
}


sudo apt-get update
sudo apt-get install openssl
curl -sL https://istio.io/downloadIstioctl | sh -