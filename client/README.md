### When running the application with containers it is not the same as running using python ###
The changes to files will not be hot loading, you will have to rebuild the containers

### The application ###

The application has 2 docker containers.
One has an nginx server, the other has the flask application.
static files will be served by the nginx container, the templates will be rendered by the application

When you run the app using docker it is accesible at http://localhost/

You need to have docker-compose installed in your virtual environment.

To create a virutal environment using python 3.7:

```bash
python3.7 -m venv venv
```

This will create a folder called venv at the current working directory.
To activate run:

```bash
source venv/bin/activate
```

There is a file called requirements.txt in ```server/requirements.txt``` . You can use it to install the project requirements.
To do that run the command:

```bash
pip install -r requirements.txt
```

This will install everything you would need to run the app. You can check the requirements.txt to see what packages would be installed.
After installing new things you should always run

```bash
pip freeze > requirements.txt
```

to update the requirements file.


### Running the application ###

You need to have docker installed, most of the commands have been tested on OSX, so may not work on windows.
Should work on Linux

This will start the nginx container that hosts the static assets and 2 identical containers for the flask app.
It will rebuild the images if required. app_server is part of the docker-compose.yml. Its a symbol to represent the flask app node.
```docker-compose.yml``` is the file that manages the structure of the set of containers that are run.

```bash
docker-compose up --build
```

to shutdown gracefully when running in the background

```bash
docker-compose down
```

to stop while running in terminal in foreground: ```CTRL + c```

Sometimes it can fail so you have to run

```bash
docker-compose stop #this stops running containers, you can't remove a container that is already running
docker-compose rm  #this removes the containers
```

