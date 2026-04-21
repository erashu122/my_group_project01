package com.fitness.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {

        http
                .csrf(csrf -> csrf.disable())

                .authorizeExchange(exchange -> exchange
                        // 🔥 VERY IMPORTANT (CORS FIX)
                        .pathMatchers(HttpMethod.OPTIONS).permitAll()

                        .pathMatchers("/actuator/**").permitAll()
                        .anyExchange().authenticated()
                )

                .oauth2ResourceServer(oauth -> oauth.jwt());

        return http.build();
    }
}