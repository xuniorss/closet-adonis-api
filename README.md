# Backend adonis.js para e-commerce

Este projeto foi desenvolvido usando um framework (adonis.js) para Node.js, cuja intenção é promover endpoints api para ser utilizada pelo frontend. Projeto simples, mas que abrange principais conceitos do framework.

### 📋 Pré-requisitos

O banco de dados usado para este projeto foi o `PostgreSQL`, sendo assim certifique-se de criar um banco localmente com nome `closet`.

## 🚀 Começando

Para executar esta aplicação em seu ambiente local, siga os passos abaixo:

### 🔧 Instalação

#### 1. Clone o repositório:

```shell
git clone https://github.com/xuniorss/closet-adonis-api.git
```

#### 2. Navegue até o diretório do projeto:

```shell
cd closet-adonis-api
```

#### 3. Instale as dependências:

```shell
npm i
# ou
yarn
```

## ⚙️ Configuração para início da aplicação

#### Com sua ide aberta:

1. Para executar as migrations, rode o seguinte comando no terminal: `node ace migration:run`

### 🏃‍♂️ Iniciando o projeto

```shell
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

2. Com o projeto sendo executado localmente siga os passos abaixo para criação de um usuário com `perfil administrativo`.

-  Abra o postman ou insomnia para, crie um endpoint do tipo `POST` na seguinte rota `/create-account`

-  Use o exemplo abaixo no corpo da requisição (altere os valores caso queira). lembre-se que o `isAdm` deve ser `true`

```
{
    "username": "Gilberto",
    "email": "email@teste.com",
    "password": "123123123",
    "isAdm": true
}
```

## 🛠️ Algumas libs utilizadas

-  [typescript](https://www.typescriptlang.org/)
-  [uuid](https://www.npmjs.com/package/uuid)
-  [phc-argon2](https://www.npmjs.com/package/phc-argon2)

---

por [Gilberto Fortunato](https://github.com/xuniorss)
