package com.eventify.eventmanagement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.eventify.eventmanagement.entity.Task;
import com.eventify.eventmanagement.entity.User;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>{
	
	@Query("SELECT t FROM Task t WHERE t.user.userName = :username")
	List<Task> findTasksByUsername(@Param("username") String username);
	
	@Query("Select t.user from Task t where t.taskId = :taskId")
	User findUserByTaskId(@Param("taskId") Long taskId);
	
	
	Page<Task> findByUser_UserName(String username, Pageable pageable);
	
	@Query("SELECT t FROM Task t WHERE t.user.userName = :username AND t.taskId = :taskId")
    Optional<Task> findByUsernameAndTaskId(@Param("username") String username, @Param("taskId") Long taskId);
	
	@Query("SELECT t.user.userName FROM Task t WHERE t.taskId = :taskId")
	String findUserNameByTaskId(@Param("taskId") Long taskId);
	
	/*
	 * @Query("Select t from Task t where t.user.username = :userName")
	 * List<Task> findByUser_UserName(@Param("userName") String u_name);
	 * */
	
}
