usage() {
    echo "Usage: $0 [-b]"
    exit 1
}

flag_build=false

while getopts ":b" opt; do
    case ${opt} in
        b )
            flag_build=true
            ;;
        \? )
            echo "Invalid option: -$OPTARG" 1>&2
            usage
            ;;
    esac
done

if $flag_build; then
    docker compose -f app/compose-dev.yaml up --build
else
    docker compose -f app/compose-dev.yaml up
fi
