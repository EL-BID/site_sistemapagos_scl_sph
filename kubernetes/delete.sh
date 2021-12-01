#!/bin/bash

set -o errexit

is_command_present() {
    type "$1" >/dev/null 2>&1
}

is_mac() {
    [[ $OSTYPE == darwin* ]]
}

confirm() {
    local default="$1"  # Should be `y` or `n`.
    local prompt="$2"

    local options="y/N"
    if [[ $default == y || $default == Y ]]; then
        options="Y/n"
    fi

    local answer
    read -rp "$prompt [$options] " answer
    if [[ -z $answer ]]; then
        # No answer given, the user just hit the Enter key. Take the default value as the answer.
        answer="$default"
    else
        # An answer was given. This means the user didn't get to hit Enter so the cursor on the same line. Do an empty
        # echo so the cursor moves to a new line.
        echo
    fi

    [[ yY =~ $answer ]]
}


if confirm y "¿Desea remover instalciones anteriores?"; then
    helm delete postgresql --namespace site
    helm delete pgadmin --namespace site
    helm delete keycloak --namespace site
    helm delete superset --namespace site
    helm delete site-api-rest --namespace site
    helm delete site-frontend --namespace site
    helm delete nginx --namespace site
    kubectl delete pvc data-postgresql-postgresql-0 -n site
    istioctl uninstall --purge
fi


