#!/bin/bash

# Verifica se a pasta de destino existe
if [ ! -d "/usr/share/nginx/html/pepvagas" ]; then
  echo "Pasta: /usr/share/nginx/html/apae nao existe. Abortando deploy."
  exit 1
fi

read -p "Deseja excluir o deploy ja existente no nginx? (y/n) " confirm
if [ "$confirm" != "y" ]; then
  echo "Deploy abortado."
  exit 1
fi

if [ ! -d "node_modules" ]; then
   echo "Node Modules nao existe, gerando.."
   sudo npm i
fi

# Executa os comandos com permissões de superusuário
sudo rm -rf /usr/share/nginx/html/pepvagas/*
sudo npm run build
sudo cp -r build/* /usr/share/nginx/html/pepvagas/

echo "Excluindo node_modules"
sudo rm -R node_modules

echo "Deploy concluído com sucesso."
