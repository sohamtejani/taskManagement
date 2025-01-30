package com.eventify.eventmanagement.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eventify.eventmanagement.entity.User;
import com.eventify.eventmanagement.service.UserService;

@RestController
@RequestMapping("/home")
public class HomeController {
	
	@Autowired
	private UserService userService;
	@Autowired
	private AuthenticationManager authManager;
	
	// home/user
	@GetMapping("/user")
	public User getUser() {
		System.out.println("Getting users");
		
		return null;
	}
	
//	@GetMapping("/signup")
//	public ResponseEntity<User> signupUser(@RequestBody User user) {
//	    try {
//	    	System.out.println("Hmmmmmmmmmmmmm");
//	    	System.out.println("Hmmmmmmmmmmmmm");
//	    	System.out.println("Hmmmmmmmmmmmmm");
//	    	System.out.println("Hmmmmmmmmmmmmm");
//	    	System.out.println("Hmmmmmmmmmmmmm");
//	    	System.out.println("Hmmmmmmmmmmmmm");
//	    	System.out.println("Hmmmmmmmmmmmmm");
//	    	System.out.println("Hmmmmmmmmmmmmm");
//	    	System.out.println("Hmmmmmmmmmmmmm");
//	    	System.out.println("Hmmmmmmmmmmmmm");
//	    	System.out.println("Hmmmmmmmmmmmmm");
//	    	System.out.println("Hmmmmmmmmmmmmm");
//	    	System.out.println("Hmmmmmmmmmmmmm");
//	        System.out.println("Getting users");
//	        userService.saveNewEntry(user);
//	        return ResponseEntity.status(HttpStatus.CREATED).body(user); // Return the user with HTTP 201 Created
//	    } catch (Exception e) {
//	        e.printStackTrace();
//	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // Return error if something goes wrong
//	    }
//	}
	
	@GetMapping("/test")
	public String getTest() {
		System.out.println("Getting users");
		
		return "just for testing";
	}

	@GetMapping("/login")
	public User loginUser(@RequestBody User user) {
		try {
			
			authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUserName(), user.getPassword()));
		}catch(Exception e) {
			
		}
		System.out.println("Getting users");
		
		return userService.findByUserName(user.getUserName());
	}
	
	@GetMapping("/current-loggedin-users")
	public String getLoggedInSers(Principal principal) {
		return principal.getName();
	}
}
