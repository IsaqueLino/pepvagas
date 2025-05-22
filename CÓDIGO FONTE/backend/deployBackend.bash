#!/bin/bash

# Atualizar as dependências do Node.js caso necessário
npm install

# Buildar a aplicação
npm run package

# Reiniciar o processo no PM2 para carregar as alterações
pm2 reload backend-linux

echo "Deploy do backend feito com sucesso!"

cp ./src/resource/bannerpadrao.svg ../../uploads/vaga-bannerpadrao.svg
cp ./src/resource/logopadrao.svg ../../uploads/vaga-logopadrao.svg
