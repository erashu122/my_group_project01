# Fitness Microservices Project (Quick Complete Setup)

Ye guide project ko **jaldi se chalane** ke liye hai.

## 1) Prerequisites

- Java 17+
- Maven 3.9+
- Node.js 20+
- PostgreSQL
- MongoDB
- RabbitMQ
- Keycloak (for gateway auth flow)

## 2) Environment variables (important)

`.env.example` copy karo aur `.env` banao:

```bash
cp .env.example .env
```

Default values:

```bash
DB_URL=jdbc:postgresql://localhost:5432/fitness_user_database
DB_USERNAME=postgres
DB_PASSWORD=postgres
GEMINI_API_KEY=your-real-gemini-key
```

## 3) Maven notes (if you get 403 / proxy issues)

If your network blocks Maven Central, create `~/.m2/settings.xml`:

```xml
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 https://maven.apache.org/xsd/settings-1.0.0.xsd">
  <mirrors>
    <mirror>
      <id>central</id>
      <mirrorOf>central</mirrorOf>
      <url>https://repo.maven.apache.org/maven2</url>
    </mirror>
  </mirrors>
</settings>
```

## 4) Run backend services

### Option A (recommended): one command script

```bash
./scripts/start-backend.sh
```

- Script `.env` auto-load karta hai (agar file available ho).
- Ctrl+C pe started backend processes ko cleanly stop karta hai.

### Option B: manual order

```bash
(cd configserver && ./mvnw spring-boot:run)
(cd eureka && ./mvnw spring-boot:run)
(cd userservice && ./mvnw spring-boot:run)
(cd activityservice && ./mvnw spring-boot:run)
(cd aiservice && ./mvnw spring-boot:run)
(cd gateway && ./mvnw spring-boot:run)
```

## 5) Run frontend

```bash
cd fitness-app-frontend
npm install
npm run dev
```

## 6) Quick test commands

```bash
(cd userservice && ./mvnw test)
(cd activityservice && ./mvnw test)
(cd gateway && ./mvnw test)
(cd aiservice && ./mvnw test)
(cd eureka && ./mvnw test)
(cd configserver && ./mvnw test)
```

## Security cleanup done

- Hardcoded DB credentials removed from config; now env-driven.
- Hardcoded Gemini API key removed from config; now env-driven.

