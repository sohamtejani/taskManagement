package com.eventify.eventmanagement.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eventify.eventmanagement.entity.ResponseMessage;
import com.eventify.eventmanagement.entity.SignupRequest;
import com.eventify.eventmanagement.entity.User;
import com.eventify.eventmanagement.service.UserService;

@RestController
@RequestMapping("/public")
public class PublicController {
	@Autowired
	private UserService userService;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@GetMapping("/test")
	public ResponseEntity testIt() {
		return ResponseEntity.ok(new ResponseMessage("User registered successfully!", 200));
	}

	
}

