package com.eventify.eventmanagement.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.eventify.eventmanagement.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUserName(String username);
    
    User findByEmail(String email);
    
    @Query("SELECT u.userId from User u WHERE u.userName = :username")
    Long findUserIdByUserName(@Param("username") String username);



    // void deleteByUserName(String username);
    	
    // List<User> findAllUsers();

    // List<User> findByEmail(String email);
    
    // User findByUserName(String username);
}

