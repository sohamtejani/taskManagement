package com.eventify.eventmanagement.service;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;
import com.eventify.eventmanagement.entity.User;
import com.eventify.eventmanagement.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService {
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

	@Autowired
	private AuthenticationManager authenticationManager;
	
	@Autowired
	private JwtService jwtService;
	
	@Transactional
	public void saveNewEntry(User user) {
		user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
		System.out.println("Hey Userservice...");
		userRepository.save(user);
	}
	
	@Transactional
	public void saveUpdatedUser(User user) {
		String encodedPassword = bCryptPasswordEncoder.encode(user.getPassword());
		user.setPassword(encodedPassword);
		userRepository.save(user);
		System.out.println("User is updated !!!!   Here is the encoded password: "+ encodedPassword);
	}
	
	public void saveAdmin(User user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        user.setRoles(Arrays.asList("USER", "ADMIN"));
        userRepository.save(user);
    }
	
	public String verify(String username, String password) {
		Authentication authentication = authenticationManager
				.authenticate(
					new UsernamePasswordAuthenticationToken(username, password));
		if(authentication.isAuthenticated()) {
			return jwtService.generateJwtToken(username);
		}
		return "failure";
	}
	
	public boolean doUsernameExists(String username ) {
		if(this.userRepository.findByUserName(username) != null) {
			return true;
		}
		return false;
		
	}
	
	public boolean doEmailExists(String email ) {
		if(this.userRepository.findByEmail(email) != null) {
			return true;
		}
		return false;
		
	}
	 public void saveUser(User user) {
		 userRepository.save(user);
	    }

	    public Optional<User> findById(Long id) {
	        return userRepository.findById(id);
	    }

	    public void deleteById(Long id) {
	        userRepository.deleteById(id);
	    }

	    public User findByUserName(String userName) {
	        return userRepository.findByUserName(userName);
	    }
	
	public List<User> getAllUsers(){
		return this.userRepository.findAll();
	}

	public String generateNewToken(String userName) {
		String newToken = jwtService.generateJwtToken(userName);
		return newToken;
	}
	 
}
