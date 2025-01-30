package com.eventify.eventmanagement.controller;

import java.text.ParseException;
import java.util.Locale;
import java.util.Optional;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.eventify.eventmanagement.entity.Category;
import com.eventify.eventmanagement.entity.Priority;
import com.eventify.eventmanagement.entity.Status;
import com.eventify.eventmanagement.entity.Task;
import com.eventify.eventmanagement.entity.User;
import com.eventify.eventmanagement.service.TaskService;
import com.eventify.eventmanagement.service.UserService;

import io.jsonwebtoken.ExpiredJwtException;

@RestController
@RequestMapping("/task")
public class TaskController {
	
	@Autowired
	private TaskService taskService;
	
	@Autowired
	private UserService userService;
	
	@GetMapping("/category")
	public ResponseEntity<List<Category>> getCategory() {
		List<Category> categories = Arrays.asList(Category.values());
	    return ResponseEntity.ok(categories);
	}

	@GetMapping("/status")
	public ResponseEntity<List<Status>> getStatus() {
		List<Status> status = Arrays.asList(Status.values());
	    return ResponseEntity.ok(status);
	}
	
	@GetMapping("/priority")
	public ResponseEntity<List<Priority>> getPriority() {
		List<Priority> priorites = Arrays.asList(Priority.values());
	    return ResponseEntity.ok(priorites);
	}
	
	@GetMapping("/fetchTask")
	public ResponseEntity<ApiResponse<Optional<Task>>> fetchTasks(@RequestParam("taskId") Long taskId) {
	    try {
	        String username = SecurityContextHolder.getContext().getAuthentication().getName();
	        System.out.println("Authenticated user: " + username);

	        Optional<Task> taskOptional = this.taskService.findTaskByUsernameAndTaskId(taskId, username);

	        // Check if task exists
	        if (taskOptional.isEmpty()) {
	            // Check if the task belongs to another user
	            User user = this.taskService.findUserByTaskId(taskId);
	            if (user != null && user.getUserName().equals(username)) {
	                ApiResponse<Optional<Task>> response = ApiResponse.success(
	                    HttpStatus.NOT_FOUND.value(),
	                    "Task does not exist",
	                    Optional.empty()
	                );
	                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	            } else {
	                ApiResponse<Optional<Task>> response = ApiResponse.error(
	                    HttpStatus.FORBIDDEN.value(),
	                    "Access denied to the requested task",
	                    null
	                );
	                return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
	            }
	        }

	        // Task found and belongs to the user
	        ApiResponse<Optional<Task>> response = ApiResponse.success(
	            HttpStatus.OK.value(),
	            "Task fetched successfully",
	            taskOptional
	        );
	        return new ResponseEntity<>(response, HttpStatus.OK);

	    } catch (Exception e) {
	        // General exception handler
	        ApiResponse<Optional<Task>> response = ApiResponse.error(
	            HttpStatus.INTERNAL_SERVER_ERROR.value(),
	            "An error occurred",
	            e.getMessage()
	        );
	        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

	
//	@GetMapping("/fetchTasks")
//    public ResponseEntity<Page<Task>> fetchAllTasks(
//    		
//            @RequestParam(defaultValue = "1") int page,
//            @RequestParam(defaultValue = "3") int size) {
//		String username = SecurityContextHolder.getContext().getAuthentication().getName();
//		System.out.println(username);
//        Page<Task> tasks = taskService.getTasks(username, page, size);
//        System.out.println(tasks.getContent());
//        return ResponseEntity.ok(tasks);
//    }
	
	@GetMapping("/fetchAllTask")
	public ResponseEntity<ApiResponse<List<Task>>> fetchAllTasks(){
		String username = SecurityContextHolder.getContext().getAuthentication().getName();
		
		List<Task> tasks = this.taskService.findAllTasks(username);
		
		ApiResponse<List<Task>> response = ApiResponse.success(HttpStatus.OK.value(), "Successfully logged in", tasks);
		
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@PostMapping("/upload")
	public Task uploadTask(@RequestBody Task task, @RequestParam("category")String category,
			@RequestParam("priority")String priority,
			@RequestParam("status")String status,
			@RequestParam("dueDate")String due,
			@RequestParam("startDate")String start) {
		String userName = "";
		 System.out.println("Category: " + category);
		    System.out.println("Priority: " + priority);
		    System.out.println("Status: " + status);
		    System.out.println("Due Date: " + due);
		    System.out.println("Start Date: " + start);
	    try {
	    	if(category==null||priority==null||status==null||due==null||start==null) {
	    		System.out.println("...................................................................");
	        	throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "insuficient Data");
	        }
	        userName = SecurityContextHolder.getContext().getAuthentication().getName();
	            
	        Date currentDate = new Date();
	        task.setCreatedDate(currentDate);
	        task.setUpdatedDate(currentDate);
	        task.setCategory(Category.valueOf(category));
	        task.setPriority(Priority.valueOf(priority));
	        task.setStatus(Status.valueOf(status));
	        
	        SimpleDateFormat formatter = new SimpleDateFormat("EEE MMM dd HH:mm:ss z yyyy", Locale.ENGLISH);
	        
	        // Set the formatter's time zone to UTC (or to any other zone you prefer)
	        formatter.setTimeZone(TimeZone.getTimeZone("UTC"));
	        Date dueDate = formatter.parse(due);
	        Date startDate = formatter.parse(start);
	        System.out.println(dueDate);
	        System.out.println(startDate);
	        
	        task.setDueDate(dueDate);
	        task.setStartDate(startDate);

	    }catch(ExpiredJwtException e) {
	    	throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Session expired");
	    }
	    catch (ParseException e) {
	        e.printStackTrace();
	        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid date format");
	    }

	    return taskService.saveTask(task, userName);
	}
	
	@DeleteMapping("/deleteTask/{taskId}")
	public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
	    try {
	        
	        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
	        System.out.println("Dleting............................");
	        
	        User user = taskService.findUserByTaskId(taskId);

	        if (user == null) {
	            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Task owner not found");
	        }

	        
	        if (!user.getUserName().equals(userName)) {
	            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed to delete this task");
	        }

	        
	        boolean isDeleted = taskService.deleteByTaskId(taskId);

	        if (isDeleted) {
	            return ResponseEntity.noContent().build();
	        } else {
	            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found");
	        }
	    } catch (ResponseStatusException e) {
	        throw e; // Re-throw specific exceptions
	    } catch (Exception e) {
	        e.printStackTrace();
	        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
	    }
	}


	@PutMapping("/update-task/{taskId}")
	public ResponseEntity<?> updateTask(@RequestBody Task task,
			@PathVariable Long taskId,
			@RequestParam("category")String category,
			@RequestParam("priority")String priority,
			@RequestParam("status")String status,
			@RequestParam("dueDate")String due,
			@RequestParam("startDate")String start) throws ParseException {
		String userName = "";
	    try {
	    	System.out.println(".............................");
	    	System.out.println(".............................");
	    	System.out.println(".............................");
	    	System.out.println(".............................");
	        userName = SecurityContextHolder.getContext().getAuthentication().getName();
	        System.out.println(userName);
	        if(taskId==null||category==null||priority==null||status==null||due==null||start==null) {
	        	throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "insuficient Data");
	        }
	        
	        System.out.println(taskId + "        7777777777777777777");
	        User user = taskService.findUserByTaskId(taskId);
	      System.out.println("55555555555555"+ user.getUserName()+ " "+ userName);
	        if(!user.getUserName().equals(userName)) {
	        	return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You don't have rights to update this task.");
	        }
	        task.setUser(user);
	    System.out.println("Matched.............");
	    }catch(ExpiredJwtException e) {
	    	throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Session expired");
	    }
	    catch(Exception e) {
	    	e.printStackTrace();
	    }
	    
	    Date currentDate = new Date();
        task.setCreatedDate(currentDate);
        task.setUpdatedDate(currentDate);
        task.setCategory(Category.valueOf(category));
        task.setPriority(Priority.valueOf(priority));
        task.setStatus(Status.valueOf(status));
        
        
        SimpleDateFormat formatter = new SimpleDateFormat("EEE MMM dd HH:mm:ss z yyyy", Locale.ENGLISH);
        
        formatter.setTimeZone(TimeZone.getTimeZone("UTC"));
        Date dueDate = formatter.parse(due);
        Date startDate = formatter.parse(start);
//        Date updatedAt = formatter.parse();
        System.out.println(dueDate);
        System.out.println(startDate);
        
        task.setDueDate(dueDate);
        task.setStartDate(startDate);

        
	    Task updated = taskService.updateTask(taskId,  task);
	    return ResponseEntity.ok(updated);
	}
	
}
