#!/bin/bash

set -o errexit

is_command_present() {
    type "$1" >/dev/null 2>&1
}

is_mac() {
    [[ $OSTYPE == darwin* ]]
}


check_k8s_setup() {
    echo "Checking your k8s setup status"
    if ! is_command_present kubectl; then
        echo "Kubect is not present on your machine. Now this script will be installed"
        curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl"
        chmod +x ./kubectl
        sudo mv ./kubectl /usr/local/bin/kubectl
        kubectl version --client
        exit 1
    else
        echo "Kubectl is present on your machine"
        echo ""
    fi
}


check_cluster_setup() {
    echo "Checking your cluster status and version"
    clusters=`kubectl config view -o json | jq -r '."current-context"'`
    if [[ ! -n $clusters ]]; then
        echo "Please setup k8s cluster & config kubectl to connect to it"
        exit 1
    fi
    k8s_minor_version=`kubectl version --short -o json | jq ."serverVersion.minor" | sed 's/[^0-9]*//g'`
    if [[ $k8s_minor_version < 16 ]]; then
        echo "+++++++++++ ERROR ++++++++++++++++++++++"
        echo "SITE deployments require Kubernetes >= v1.16. Found version: v1.$k8s_minor_version"
        echo "+++++++++++ ++++++++++++++++++++++++++++"
        exit 1
    fi;
}

check_helm_setup() {
    echo "Checking your helm setup status"
    if ! is_command_present helm; then
        echo "Helm is not present on your machine. Now this script will be install"
        curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3
        chmod 700 get_helm.sh
        ./get_helm.sh
        exit 1
    else
         echo "Helm is present on your machine"
         echo ""
    fi
}



check_os() {
    if is_mac; then
        package_manager="brew"
        desired_os=1
        os="mac"
        return
    fi

    local os_name="$(
        cat /etc/*-release \
            | awk -F= '$1 == "NAME" { gsub(/"/, ""); print $2; exit }' \
            | tr '[:upper:]' '[:lower:]'
    )"

    case "$os_name" in
        ubuntu*)
            desired_os=1
            os="ubuntu"
            package_manager="apt-get"
            ;;
        debian*)
            desired_os=1
            os="debian"
            package_manager="apt-get"
            ;;
        red\ hat*)
            desired_os=1
            os="red hat"
            package_manager="yum"
            ;;
        centos*)
            desired_os=1
            os="centos"
            package_manager="yum"
            ;;
        *)
            desired_os=0
            os="Not Found: $os_name"
    esac
}

overwrite_file() {
    local relative_path="$1"
    local template_file="$2"
    local full_path="$install_dir/$relative_path"
    echo "Copy $template_file to $full_path"

    if [[ -f $full_path ]] && ! confirm y "File $relative_path already exists. Would you like to replace it?"; then
        rm -f "$template_file"
    else
        mv -f "$template_file" "$full_path"
    fi
}


urlencode() {
    # urlencode <string>
    local old_lc_collate="$LC_COLLATE"
    LC_COLLATE=C

    local length="${#1}"
    for (( i = 0; i < length; i++ )); do
        local c="${1:i:1}"
        case $c in
            [a-zA-Z0-9.~_-]) printf "$c" ;;
            *) printf '%%%02X' "'$c" ;;
        esac
    done

    LC_COLLATE="$old_lc_collate"
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


echo_contact_support() {
    echo "Please contact <it@disruptica.com> with your OS details and version${1:-.}"
}

bye() {  # Print a friendly good bye message and end the script.
    set +o errexit
    echo -e "\n Bye! \U1F44B\n"
    exit 1
}



echo -e "👋  Thank you for install SITE"
echo ""


# Checking OS and assigning package manager
desired_os=0
os=""
echo -e "🕵️  Detecting your OS"
check_os

# Run end script if failure happen
trap bye EXIT


if [[ $desired_os -eq 0 ]];then
    echo ""
    echo "This script is currently meant to install SITE on Mac OS X | Ubuntu machines."
    echo_contact_support " if you wish to extend this support."
    bye
else
    echo "You're on OS that is supported by this installation script."
    echo ""
fi

if [[ $EUID -eq 0 ]]; then
    echo "+++++++++++ ERROR ++++++++++++++++++++++"
    echo "Please do not run this script as root/sudo."
    echo "++++++++++++++++++++++++++++++++++++++++"
    echo_contact_support
    bye
fi

# Check for  kubernetes setup
check_k8s_setup
check_cluster_setup
check_helm_setup
install_dir="$PWD"


echo "+++++++++++ BIENVENIDO ++++++++++++++++++++++"
echo "Bienvenido a la instalación del proyecto SITE"
echo "Esta instalación tomará varios minutos"
echo "++++++++++++++++++++++++++++++++++++++++"
echo ""




if confirm y "¿Es la primera instalación?"; then
export PATH=$PATH:$HOME/.istioctl/bin
istioctl install
kubectl create namespace site
kubectl label namespace site istio-injection=enabled --overwrite
cd $install_dir/scripts/nginx
kubectl apply -f secret.yaml  -n site
kubectl create priorityclass priority.yaml
cd ../../..
fi




if confirm y "¿Instalar base de datos postgres?"; then
    read -rp 'Ingrese usuario: ' postgresql_username
    read -srp 'Ingrese clave del usuario: ' postgresql_password
    read -srp 'Ingrese clave del usuario root: ' postgresql_password_root
    read -rp 'Ingrese tamaño de disco de postgres  (persistence size (Ejemplo: 5Gi)):' postgresql_persistence_size
    bash "$install_dir/scripts/postgresql/values.yaml.sh"  "$postgresql_username" "$postgresql_password" "$postgresql_password_root" "$postgresql_persistence_size" > "$install_dir/helms/postgresql/values.yaml"
    cd "$install_dir/helms/postgresql"
    helm package "$install_dir/helms/postgresql" .
    helm install postgresql "$install_dir/helms/postgresql/postgresql-8.6.4.tgz" --namespace site
    rm "$install_dir/helms/postgresql/postgresql-8.6.4.tgz"
    cd ..
    echo ""
fi

if confirm y "¿Instalar pgadmin?"; then
    read -rp 'Ingrese email para administrar pgadmin: ' pgadmin_username
    read -srp 'Ingrese clave para administrar pgadmin: ' pgadmin_password
    bash "$install_dir/scripts/pgadmin/values.yaml.sh" "$postgresql_username" "$pgadmin_username" "$pgadmin_password" > "$install_dir/helms/pgadmin/values.yaml"
    cd "$install_dir/helms/pgadmin"
    helm package "$install_dir/helms/pgadmin" .
    helm install pgadmin "$install_dir/helms/pgadmin/pgadmin-1.2.3.tgz" --namespace site
    rm "$install_dir/helms/pgadmin/pgadmin-1.2.3.tgz"
    cd ..
    echo ""
fi

if confirm y "¿Instalar credential manager o keycloak?"; then
    read -rp 'Ingrese nombre del realm:' keycloak_realm
    read -rp 'Ingrese email de administración del realm:' keycloak_email
    read -srp 'Ingrese clave de administración del realm: ' keycloak_password
    bash "$install_dir/scripts/keycloak/values.yaml.sh" "$postgresql_username" "$postgresql_password" "$keycloak_realm" "$keycloak_email" "$keycloak_password"  > "$install_dir/helms/keycloak/values.yaml"
    cd "$install_dir/helms/keycloak"
    helm package "$install_dir/helms/keycloak" .
    helm install keycloak "$install_dir/helms/keycloak/keycloak-10.1.0.tgz" --namespace site
    rm "$install_dir/helms/keycloak/keycloak-10.1.0.tgz"
    cd ..
    echo ""
fi




if confirm y "¿Instalar SITE API REST?"; then
    bash "$install_dir/scripts/site-api-rest/values.yaml.sh"  > "$install_dir/helms/site-api-rest/values.yaml"
    cd "$install_dir/helms/site-api-rest"
    helm package "$install_dir/helms/site-api-rest" .
    helm install site-api-rest "$install_dir/helms/site-api-rest/site-api-rest-1.0.0.tgz" --namespace site
    rm "$install_dir/helms/site-api-rest/site-api-rest-1.0.0.tgz"
    cd ..
    echo ""
fi

if confirm y "¿Instalar SITE front end?"; then
    bash "$install_dir/scripts/site-frontend/values.yaml.sh"  > "$install_dir/helms/site-frontend/values.yaml"
    cd "$install_dir/helms/site-frontend"
    helm package "$install_dir/helms/site-frontend" .
    helm install site-frontend "$install_dir/helms/site-frontend/site-frontend-1.0.0.tgz" --namespace site
    rm "$install_dir/helms/site-frontend/site-frontend-1.0.0.tgz"
    cd ..
    echo ""
fi


if confirm y "¿Instalar nginx proxy?"; then
    bash "$install_dir/scripts/nginx/values.yaml.sh"  > "$install_dir/helms/nginx/values.yaml"
    cd "$install_dir/helms/nginx"
    helm package "$install_dir/helms/nginx" .
    helm install nginx "$install_dir/helms/nginx/nginx-1.0.0.tgz" --namespace site
    rm "$install_dir/helms/nginx/nginx-1.0.0.tgz"
    cd ..
    echo ""
fi