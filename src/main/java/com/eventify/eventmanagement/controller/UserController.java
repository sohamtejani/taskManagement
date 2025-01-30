package com.eventify.eventmanagement.controller;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eventify.eventmanagement.entity.LoginData;
import com.eventify.eventmanagement.entity.ResponseMessage;
import com.eventify.eventmanagement.entity.SignupRequest;
import com.eventify.eventmanagement.entity.User;
import com.eventify.eventmanagement.service.JwtService;
import com.eventify.eventmanagement.service.UserService;

import graphql.com.google.common.base.Objects;

@RestController
@RequestMapping("/user")
public class UserController {
	
	@Autowired
	private UserService userService;
	
	@Autowired PasswordEncoder passwordEncoder;

	/*@PutMapping("/update-user")
	public ResponseEntity<?> updateUser(@RequestBody User user){
		org.springframework.security.core.Authentication authentication = null;
		try {
			authentication = SecurityContextHolder.getContext().getAuthentication();
			if (authentication == null || !authentication.isAuthenticated()) {
			    throw new SecurityException("User is not authenticated");
			}
		}catch(SecurityException e) {
			System.out.println("Here is security Exception:");;
			e.printStackTrace();
		}
		String userName = authentication.getName();
		User userInDb = userService.findByUserName(userName);
		userInDb.setUserName(user.getUserName());
		userInDb.setPassword(user.getPassword());
		
		userService.saveUpdatedUser(userInDb);
		
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		
	}
	*/
	@PutMapping("/update-user")
	public ResponseEntity<?> updateUser(@RequestBody User user) {
	    org.springframework.security.core.Authentication authentication = null;
	    try {
	        authentication = SecurityContextHolder.getContext().getAuthentication();
	        if (authentication == null || !authentication.isAuthenticated()) {
	            throw new SecurityException("User is not authenticated");
	        }
	    } catch (SecurityException e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated");
	    }

	    // Retrieve the currently authenticated user's username
	    String currentUsername = authentication.getName();
	    User userInDb = userService.findByUserName(currentUsername);

	    // Update user details
	    userInDb.setUserName(user.getUserName());
	    userInDb.setPassword(user.getPassword()); // Make sure the password is encoded

	    // Save updated user details
	    userService.saveUpdatedUser(userInDb);

	    // Generate a new JWT token with the updated username
	    
	    String newToken = this.userService.generateNewToken(user.getUserName());

	    // Return the new token in the response
	    Map<String, String> response = new HashMap<>();
	    response.put("message", "User updated successfully");
	    response.put("token", newToken);

	    return ResponseEntity.ok(response);
	}

	@PostMapping("/create")
	public ResponseEntity<?> signup(@RequestBody SignupRequest signupRequest) {
	    // Validate the incoming data, e.g., check if username already exists
	    if ( this.userService.doUsernameExists(signupRequest.getUsername())) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists.");
	    }
	    
	    if ( this.userService.doEmailExists(signupRequest.getEmail())) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already exists.");
	    }
	    
	    // Create a new user entity based on the signup request
	    User user = new User();
	    user.setUserName(signupRequest.getUsername());
	    user.setPassword(signupRequest.getPassword()); // Ensure password is encoded
	    user.setEmail(signupRequest.getEmail());
	    user.setFirstName(signupRequest.getFirstName());
	    user.setLastName(signupRequest.getLastName());
	    user.setRoles(signupRequest.getRoles() ); // Set default role or roles
	    
	    userService.saveNewEntry(user);
	    return ResponseEntity.ok(new ResponseMessage("User registered successfully!", 200));
	}
	
	@PostMapping("/login")
	public ResponseEntity<ApiResponse<String>> login(@RequestBody LoginData loginData) {
		try {
			String token = userService.verify(loginData.getUsername(), loginData.getPassword());
			if(token != "failure") {
				ApiResponse<String> response = ApiResponse.success(HttpStatus.OK.value(), "Successfully logged in", token);
				
				return new ResponseEntity<>(response, HttpStatus.OK);
			}else {
				ApiResponse<String> response = ApiResponse.error(HttpStatus.UNAUTHORIZED.value(), "Invalid credentials", "Username or password is incorrect");
                return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
			}
		}catch(Exception e) {
			ApiResponse<String> response = ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "An error occurred", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	
}
