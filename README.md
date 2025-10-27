Oraculum — Frontend

Este repositório contém o frontend do projeto Oraculum, desenvolvido em React, como parte da disciplina de Residência Tecnológica do curso de Análise e Desenvolvimento de Sistemas, em parceria com o Banco do Brasil.

Sobre o Projeto

O Oraculum é uma aplicação web voltada ao aprendizado e conscientização sobre cibersegurança.
O usuário pode se cadastrar com seu e-mail, assistir a um resumo introdutório com vídeo educativo e realizar um quiz que avalia seu nível de conhecimento.
Com base no resultado, a aplicação apresenta uma trilha de aprendizado personalizada, composta por módulos, videoaulas e conteúdos complementares.

Funcionalidades

Cadastro de usuário com e-mail

Exibição de resumo e vídeo introdutório sobre cibersegurança

Quiz para avaliação do nível de conhecimento

Liberação de trilha de aprendizado conforme o resultado do quiz

Interface responsiva e fácil de navegar

Tecnologias Utilizadas

O projeto foi desenvolvido utilizando o Create React App com as seguintes dependências principais:

Tecnologia	Descrição
React 19	Biblioteca principal para construção da interface
React DOM	Renderização dos componentes React no navegador
React Router DOM 7	Gerenciamento de rotas e navegação
React Scripts 5	Ferramentas de build, testes e execução do Create React App
Testing Library (React, DOM, Jest, User Event)	Ferramentas para testes de componentes
Web Vitals	Métricas de performance da aplicação
Como Executar o Projeto
Pré-requisitos

Node.js 18+

npm (ou yarn)

Passos para execução
# Clonar o repositório
git clone https://github.com/seu-usuario/oraculum-frontend.git

# Entrar na pasta do projeto
cd oraculum-frontend

# Instalar as dependências
npm install
# ou
yarn install

# Executar o projeto
npm start
# ou
yarn start


Após a inicialização, o projeto estará disponível em:
http://localhost:3000/

Estrutura do Projeto

A estrutura atual do projeto é a seguinte:

oraculum-frontend/
├── assets/         # Imagens, ícones e outros arquivos estáticos
├── components/     # Componentes reutilizáveis
├── data/           # Dados e configurações locais
├── pages/          # Páginas principais da aplicação
├── App.js          # Componente raiz
├── index.css       # Estilos globais
└── index.js        # Ponto de entrada da aplicação

Boas Práticas e Padrões

Código padronizado conforme as regras do ESLint do Create React App

Componentes nomeados em PascalCase

Separação clara entre lógica, layout e estilo

Utilização de hooks para gerenciamento de estado e efeitos

Estrutura modular e de fácil manutenção

Licença

Este projeto está sob a licença MIT.
Consulte o arquivo LICENSE para mais informações.


This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
