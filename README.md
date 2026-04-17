# Fitness Microservices Project - Quick Start (Submission Friendly)

If you are seeing Maven errors like:
- `Permission denied` when running `./mvnw`
- `Non-resolvable parent POM`
- `status code: 403 ... repo.maven.apache.org`

use the steps below.

## 1) Build backend services without wrapper-download issues

All service `mvnw` scripts are now configured to prefer installed Maven (`mvn`) by default.
If you still want to force wrapper behavior:

```bash
MVNW_FORCE_WRAPPER=true ./mvnw test
```

## 2) Configure Maven once (required on restricted networks/proxy)

Create `~/.m2/settings.xml`:

```xml
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 https://maven.apache.org/xsd/settings-1.0.0.xsd">

  <mirrors>
    <mirror>
      <id>central</id>
      <name>Maven Central</name>
      <url>https://repo.maven.apache.org/maven2</url>
      <mirrorOf>central</mirrorOf>
    </mirror>
  </mirrors>

  <!-- Uncomment and set if your network requires explicit proxy -->
  <!--
  <proxies>
    <proxy>
      <id>corp-proxy</id>
      <active>true</active>
      <protocol>http</protocol>
      <host>YOUR_PROXY_HOST</host>
      <port>YOUR_PROXY_PORT</port>
      <username>YOUR_USERNAME</username>
      <password>YOUR_PASSWORD</password>
      <nonProxyHosts>localhost|127.0.0.1</nonProxyHosts>
    </proxy>
  </proxies>
  -->

</settings>
```

## 3) Backend run/test commands

Run these from repository root:

```bash
(cd configserver && ./mvnw spring-boot:run)
(cd eureka && ./mvnw spring-boot:run)
(cd userservice && ./mvnw spring-boot:run)
(cd activityservice && ./mvnw spring-boot:run)
(cd aiservice && ./mvnw spring-boot:run)
(cd gateway && ./mvnw spring-boot:run)
```

Test each service:

```bash
(cd userservice && ./mvnw test)
(cd activityservice && ./mvnw test)
(cd gateway && ./mvnw test)
(cd aiservice && ./mvnw test)
(cd eureka && ./mvnw test)
(cd configserver && ./mvnw test)
```

## 4) Frontend

```bash
cd fitness-app-frontend
npm install
npm run build
npm run dev
```

## Notes for submission

- If backend still fails with `403` from Maven Central, it is a machine/network policy issue, not Java code compilation.
- In that case, submit with this troubleshooting note and your configured `settings.xml`.
