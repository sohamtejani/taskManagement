package com.eventify.eventmanagement.service;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.eventify.eventmanagement.entity.Category;
import com.eventify.eventmanagement.entity.Priority;
import com.eventify.eventmanagement.entity.Status;
import com.eventify.eventmanagement.entity.Task;
import com.eventify.eventmanagement.entity.User;
import com.eventify.eventmanagement.exception.ResourceNotFoundException;
import com.eventify.eventmanagement.repository.TaskRepository;
import com.eventify.eventmanagement.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class TaskService {
	@Autowired
	private TaskRepository taskRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Transactional
    public Task saveTask(Task task, String userName) {
        User user = userRepository.findByUserName(userName);
        
     
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        task.setUser(user);
        
        return taskRepository.save(task);
    }
	
	public User findUserByTaskId(Long taskId) {
		return this.taskRepository.findUserByTaskId(taskId);
	}
	
	public List<Task> findAllTasks(String username){
		List<Task> tasks = this.taskRepository.findTasksByUsername(username);
		return tasks;
	}
	
	public Optional<Task> findTaskByUsernameAndTaskId(Long taskId, String username) {
		Optional<Task> t = this.taskRepository.findByUsernameAndTaskId(username, taskId);
		if(t == null) {
			System.out.println("something wrong...");
		}
		return t;
	}
	
	public Page<Task> getTasks(String username, int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		Page<Task> tasks = taskRepository.findByUser_UserName(username, pageable);
        return tasks;
    }
	
	public String findUserNameByTaskId(Long taskId) {
		return this.taskRepository.findUserNameByTaskId(taskId);
	}
	
	@Transactional
	public Task updateTask(Long taskId,  Task t) {
		taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));
		t.setTaskId(taskId);
		return this.taskRepository.save(t);
		
	}

	public boolean deleteByTaskId(Long taskId) {
	    Optional<Task> taskOptional = taskRepository.findById(taskId);
	    if (taskOptional.isPresent()) {
	        taskRepository.deleteById(taskId);
	        return true;
	    }
	    return false;
	}

}
