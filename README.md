# UITIA

## Запуск проекта в dev режиме

### Установить необходимые инструменты
* Установить рекомендуемую версию Node.js (LTS) https://nodejs.org/en/download/
* Установить Docker https://docs.docker.com/engine/install/
* Установить npm
    ```bash
    npm install -g npm
    ```
* Склонировать репозиторий
    ```bash
    git clone https://github.com/Zayac11/antique-shop
    ```
* Открыть папку в vscode или другом редакторе

### Запуск базы данных
* Запустить приложение `Docker Desktop`
* Открыть терминал в ide или просто по адресу папки
* Запустить докер контейнер
    ```bash
    docker run --name uitia -e POSTGRES_PASSWORD=admin -e POSTGRES_USER=admin -e POSTGRES_DB=uitia -p 5423:5432 -d postgres
    ```
    
* Загрузить дамп БД (Для Windows PowerShell)
    ```bash
    Get-Content .\dump.sql | docker exec -i uitiaa psql -U admin uitia
    ```
    
* Загрузить дамп БД (Для других ОС)
    ```bash
    docker exec -i uitia psql -U admin uitia < ./dump.sql
    ```

* (Опционально) Для подключения к базе данных через консоль
    ```bash
    docker exec -it uitia psql -d uitia -U admin
    ```
* В последующие разы для запуска достаточно будет
    ```bash
    docker start uitia
    ```

### Запуск backend
* Открыть терминал в ide или просто по адресу папки
* Перейти в папку с backend
    ```bash
    cd nj-jwt-auth-api4SUI
    ```
* Устновить зависимости
    ```bash
    npm ci
    ```
* Запустить backend
    ```bash
    npm run dev
    ```
### Запуск frontend
* Открыть НОВЫЙ терминал в ide или просто по адресу папки
* Перейти в папку frontend
    ```bash
    cd frontend
    ```
* Установить зависимости
    ```bash
    npm ci
    ```
* Запустить проект
    ```bash
    npm start
    ```
Проект откроется по адресу http://localhost:3000/
Сервер запущен по адресу http://127.0.0.1:8000/