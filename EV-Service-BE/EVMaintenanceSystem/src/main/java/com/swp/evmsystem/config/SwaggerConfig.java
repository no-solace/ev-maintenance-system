package com.swp.evmsystem.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    private String title = "API Documentation for EV Service Center Maintenance Management System (EVM System)";
    private String version = "1.0";
    private String description = "This documentation provides details about the RESTful APIs available in the" +
            " EVM System, which is designed to manage and maintain electric vehicle service centers efficiently.";

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title(title)
                        .version(version)
                        .description(description));
    }
}