docker run -it --rm --user "$(id -u):$(id -g)" -v "$PWD/wazuh-assistant-frontend:/app" -p 127.0.0.1:3000:3000 node:24.13.0-bookworm /bin/bash
