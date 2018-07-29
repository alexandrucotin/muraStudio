FROM python:3.7-alpine
RUN apk add --no-cache --virtual .pynacl_deps build-base python3-dev libffi-dev
ADD . /code
WORKDIR /code
RUN pip install -r requirements.txt
CMD ["python", "webserver.py"]
