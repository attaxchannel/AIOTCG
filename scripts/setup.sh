#!/bin/bash
set -e
echo "AIOTCG setup"
cp -n .env.example .env || true
echo "Edit .env with OPENAI_API_KEY then: docker compose up --build -d"
docker compose up --build -d
echo "Frontend http://localhost:3000  Backend http://localhost:8000/docs"
