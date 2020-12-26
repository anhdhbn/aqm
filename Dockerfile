FROM python:3.6

ENV FLASK_APP run.py

COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY app app
COPY authentication authentication
COPY core core
COPY data data
COPY mqttclient mqttclient
COPY manage.py gunicorn-cfg.py .env ./

# RUN python manage.py makemigrations
# RUN python manage.py migrate

EXPOSE 5005
CMD ["gunicorn", "--config", "gunicorn-cfg.py", "core.wsgi"]
