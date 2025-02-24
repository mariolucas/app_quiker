# App teste Quiker

## Sobre a stack

- Foi utilizado Docker para faciliar na execução da aplicação, sem a necessidade de várias configurações para rodar um teste. 
- Nodejs e React por serem a base de tecnologias de desenvolvimento da empresa. 
- Utilizei bootstrap para poder agilizar na estrutura/layout do projeto, visto o tempo corrido eu não poderia me dedicar ao layout.
- Banco de dados foi MySQL, a escolha também foi em relação ao tempo, pois configurar dois bancos de dados levaria mais tempo, mas pensei em usar MySQL para dados do usuário e MongoDB para os posts e relatório.

## Subir o projeto para executar os testes

- Basta ter o docker e o docker-compose instalado na máquina, e na raiz do projeto executar docker-compose up. O projeto já esta configurado para criar o banco, as tabelas, executar o frontend e a api. Porta 3000 para o frontend, porta 5000 para a api/backend
- Para o envio de e-mail pelo projeto será necessário configurar uma conta Gmail. Em api/ edite o arquivo .env adicionando um email em EMAIL_USER, e a senha em EMAIL_PASS.