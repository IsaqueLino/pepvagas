#!/bin/bash


# Requisitos
#    - WWW Buildado dentro do projeto
#    - Estar no caminho root do projeto -> frontend/

sudo rm -r /usr/share/nginx/html/vagas/*

sudo cp -r ./www/* /usr/share/nginx/html/vagas/