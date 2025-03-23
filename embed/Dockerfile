FROM python:3.11

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

ENV FLASK_APP=/app/src/app.py
ENV FLASK_ENV=development

EXPOSE 3096

CMD ["flask", "run", "-h", "0.0.0.0", "-p", "3096"]
