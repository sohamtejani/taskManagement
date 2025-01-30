package com.eventify.eventmanagement.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.eventify.eventmanagement.entity.User;
import com.eventify.eventmanagement.repository.UserRepository;


@Service
public class UserDetailsServiceImpl implements UserDetailsService{
	
	@Autowired
	private UserRepository userRepository;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{
		User user = null;
		try {
			user = userRepository.findByUserName(username);
			
		}catch(Exception e) {
			e.printStackTrace();
			System.out.println(user.toString());
		}
		if(user != null) {
			
			try {
		        return new CustomUserDetails(user);
		    } catch (Exception e) {
		    	System.out.println("User not available");
		        System.err.println("Error while building UserDetails: " + e.getMessage());
		        e.printStackTrace();
		        throw new UsernameNotFoundException("Error building UserDetails for username");
		    }
		}
		throw new UsernameNotFoundException("User not found with username: "+ username);
	}

//    @Override
//	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{
//		List<User> users = null;
//		try {
//			users = userRepo.findByUserName(username);
//			
//		}catch(Exception e) {
//			e.printStackTrace();
//			System.out.println(users.get(0).toString());
//		}
//		if(users != null) {
//			
//			try {
//		        User user = users.get(0);
//		        System.out.println("Stored password: " + user.getPassword()); // Debugging only, remove in production!
//
//		        return org.springframework.security.core.userdetails.User.builder()
//		                .username(user.getUserName())
//		                .password(user.getPassword()) // Ensure this matches the encoded format
//		                .roles(user.getRoles().toArray(new String[0])) 
//		                .build();
//		     
//		    } catch (Exception e) {
//		    	System.out.println("User not available");
//		        System.err.println("Error while building UserDetails: " + e.getMessage());
//		        e.printStackTrace();
//		        throw new UsernameNotFoundException("Error building UserDetails for username");
//		    }
//		}
//		throw new UsernameNotFoundException("User not found with username: "+ username);
//	}
    
}