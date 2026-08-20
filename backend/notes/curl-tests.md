# Auth API  manual test commands (PowerShell)

## Signup
[System.IO.File]::WriteAllText("$PWD\signup.json", '{"name":"Sam Lee","phone":"0501234567","email":"sam@example.com","password":"correcthorse123"}')
curl.exe -v -X POST http://localhost:8080/api/auth/signup -H "Content-Type: application/json" -d "@signup.json"

## Login
[System.IO.File]::WriteAllText("$PWD\login.json", '{"email":"sam@example.com","password":"correcthorse123"}')
curl.exe -v -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "@login.json"

## Login (wrong password, expect 401)
[System.IO.File]::WriteAllText("$PWD\badlogin.json", '{"email":"sam@example.com","password":"wrongpassword"}')
curl.exe -v -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "@badlogin.json"

## Signup duplicate (expect 409)
curl.exe -v -X POST http://localhost:8080/api/auth/signup -H "Content-Type: application/json" -d "@signup.json"

## Promote to admin
curl.exe -v -X POST http://localhost:8080/api/auth/promote/sam@example.com

## Menu testing 

curl.exe http://localhost:8080/api/menu
curl.exe "http://localhost:8080/api/menu/search?q=matcha"
