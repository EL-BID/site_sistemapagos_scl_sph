#!/bin/bash

set -o errexit

install_dir="$PWD"

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

if confirm y "¿Instalar superset?"; then
    helm delete nginx --namespace site
    read -rp '- Ingrese usuario postgres (usuario ingresado en el script anterior)' postgresql_username
    read -srp '- Ingrese clave del usuario postgres (usuario ingresado en el script anterior)' postgresql_password
    read -rp 'Ingrese usuario de administración de superset: ' superset_username
    read -srp 'Ingrese clave de administración de superset: ' superset_password
    bash "$install_dir/scripts/superset/values.yaml.sh" "$postgresql_username" "$postgresql_password" "$superset_username" "$superset_password" > "$install_dir/helms/superset/values.yaml"
    cd "$install_dir/helms/superset"
    helm package "$install_dir/helms/superset" .
    helm install superset "$install_dir/helms/superset/superset-0.1.4.tgz" --namespace site
    rm "$install_dir/helms/superset/superset-0.1.4.tgz"
    cd ..
    bash "$install_dir/scripts/nginx/values-superset.yaml.sh"  > "$install_dir/helms/nginx/values.yaml"
    cd "$install_dir/helms/nginx"
    helm package "$install_dir/helms/nginx" .
    helm install nginx "$install_dir/helms/nginx/nginx-1.0.0.tgz" --namespace site
    rm "$install_dir/helms/nginx/nginx-1.0.0.tgz"
    cd ..
    echo ""
fi


