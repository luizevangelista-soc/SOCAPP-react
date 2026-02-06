# SOCAPP - REACT NATIVE

## COMANDOS DE INSTALAÇÃO
### UTILIZE GIT BASH DENTRO DO DIRETORIO DO PROJETO PARA RODAR OS COMANDOS
```
node verion 24.13.0
npm install -g typescript
npm install -g expo-cli
npm install
```

## Abra um emulador pelo android studio ou pelo terminal
```
npx expo start -c --android
```


### Redis Local (server)
```
podman machine start 

podman pull docker.io/redis

podman run --name redis-server -d -p 6379:6379 redis

podman exec -it redis-server redis-cli

KEYS *
```