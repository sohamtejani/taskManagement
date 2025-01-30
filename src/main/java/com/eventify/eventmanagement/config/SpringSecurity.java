package com.eventify.eventmanagement.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.eventify.eventmanagement.authentication.JwtAuthenticationFilter;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SpringSecurity {
	
    @Autowired
    private UserDetailsService userDetailsService;
    
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
    	CorsConfiguration configuration = new CorsConfiguration();
    	configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:5555"));
    	configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
    	configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "*")); // Allow specific headers
        configuration.setAllowCredentials(true);
    	UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource(); 
    	source.registerCorsConfiguration("/**", configuration);
    	
    	return source;
    }

    
//    @Bean
//    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
//        AuthenticationManagerBuilder authenticationManagerBuilder = 
//            http.getSharedObject(AuthenticationManagerBuilder.class);
//        authenticationManagerBuilder
//            .userDetailsService(userDetailsService)
//            .passwordEncoder(bCryptPasswordEncoder());
//        System.out.println("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj");
//        return authenticationManagerBuilder.build();
//    }
    
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {
        return configuration.getAuthenticationManager();
    }
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        try {
            SecurityFilterChain chain = http
            		.cors(c -> c.configurationSource(corsConfigurationSource()))
            		.csrf(csrf -> csrf.disable())
            		.sessionManagement(c -> c.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                    .authorizeHttpRequests(request -> request
                            .requestMatchers("/public/**").permitAll() // Allow unauthenticated access
                            .requestMatchers("/graphql/user/test", "/graphql/user/create").permitAll()
                            .requestMatchers("/graphql/admin/**").hasRole("ADMIN")
                            .anyRequest().authenticated())
                    .httpBasic(Customizer.withDefaults())
                    .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                    .build();
            return chain;
        }catch(Exception e) {
        	System.out.println("Error in Spring Security.............................................................");
        	e.printStackTrace();
        	throw new Exception("hm...............................hm.........................");
        }   
    }
    
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
    	return new BCryptPasswordEncoder(14);
    }
    
    @Bean
    public AuthenticationProvider authenticationProvider() {
    	DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
    	//System.out.println("Bajarang bali ki jay");System.out.println("Bajarang bali ki jay");System.out.println("Bajarang bali ki jay");System.out.println("Bajarang bali ki jay");System.out.println("Bajarang bali ki jay");System.out.println("Bajarang bali ki jay");System.out.println("Bajarang bali ki jay");System.out.println("Bajarang bali ki jay");System.out.println("Bajarang bali ki jay");System.out.println("Bajarang bali ki jay");System.out.println("Bajarang bali ki jay");
    	provider.setUserDetailsService(userDetailsService);
    	provider.setPasswordEncoder(bCryptPasswordEncoder());
    	return provider;
    }
  
}
