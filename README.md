# Ton Api
## Desafio técnico da Stone

O desafio consiste em construir uma api com rotas que consumam de uma api para incrementar e consultar o número de visitas a um determinado site,
além de ter rotas para criação e busca de um usuário. A api deve ter algum tipo de segurança, nesse caso, auth e middleware jwt.

### Instalação
Tenha certeza de ter a cli do Serverless no seu pc, devidamente configurada

Baixe o projeto, e na pasta dele abra o terminal e digite o comando:
```bash
$ npm install
```

Para rodar offline, o projeto conta com um plugin do Serverless. Basta rodar:
```bash
$ serverless offline
```


### Variáveis de ambiente
Copie o arquivo `.env.example` para um arquivo `.env` e altere as variáveis segundo suas necessidades


### Testando minha api
Essa api está disponível na AWS e conta com os seguintes endpoints:
<br />

<img width="153" alt="image" src="https://user-images.githubusercontent.com/56317536/183805544-0d71ed99-cca2-4295-9afa-a4c898eb5cb7.png">

A lambda getUser tem um middleware jwt, e precisa que o usuário tenha feito login e usado o token no campo Authorization, dos headers.

Base Url da api: https://j8kl2329r9.execute-api.us-east-1.amazonaws.com/dev
