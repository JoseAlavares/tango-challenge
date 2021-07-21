# TANGO CHALLENGE

## Requirements
  - Docker
  - docker-compose
  - Any code editor like Visual Code or Sublime Text
  - Git client

## Install docker and docker compose
    - https://docs.docker.com/engine/install/
    - https://docs.docker.com/compose/install/
    
## Run the backend in a local enviroment:

- In Linux enviroments please refer in the section on installation docker to configure administrative permissions in docker

Please type the next comands in your command prompt like Bash or PowerShell

Clone the repository
```
git clone git@url-repo.git
```
Change the path to the real path in your pc
```
cd /path/to/repository
```
Up containers with docker-compose
```
docker-compose up -f Dockerfile.local -d --build
```
### License

Copyright (C) 2020, Cubix  
 All rights reserved.
----

