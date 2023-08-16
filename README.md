# Ton Api
## Desafio técnico da Stone

O desafio consiste em construir uma api com rotas que consumam de uma api para incrementar e consultar o número de visitas a um determinado site,
além de ter rotas para criação e busca de um usuário. A api deve ter algum tipo de segurança, nesse caso, auth e middleware jwt.

### Documentação

Acesse a [Documentação Swagger](https://z0lmzmahfg.execute-api.us-east-1.amazonaws.com/dev/swagger) da API e teste no seu navegador.

### Instalação
Tenha certeza de ter a cli do Serverless no seu pc, devidamente configurada

Baixe o projeto, e na pasta dele abra o terminal e digite o comando:
```bash
$ npm install
```

Para rodar offline, o projeto conta com um plugin do Serverless. Basta rodar:
```bash
$ npm run start
```


### Variáveis de ambiente
Copie o arquivo `.env.example` para um arquivo `.env` e altere as variáveis segundo suas necessidades