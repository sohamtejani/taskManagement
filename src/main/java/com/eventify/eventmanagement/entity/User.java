package com.eventify.eventmanagement.entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
    name = "user",
    uniqueConstraints = {
    		@UniqueConstraint(columnNames = "userName"),
    		@UniqueConstraint(columnNames = "email")
    }
)
public class User {

	public User() {
		
	}
    public User(Long userId, String firstName, String lastName, String userName, String email, String password,
			List<String> roles) {
		super();
		this.userId = userId;
		this.firstName = firstName;
		this.lastName = lastName;
		this.userName = userName;
		this.email = email;
		this.password = password;
		this.roles = roles;
	}
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    private Long userId;

    private String firstName;
    
    private String lastName;

    @Column(nullable = false, unique = true)
    private String userName;
    
    @Column(nullable = false, unique = true)
    private String email;

    private String password;
    
//    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL) // do not create separate table, since it is taken care or created by user which is in Task. 
//	private List<Task> taskList;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
        name = "user_roles",  
        joinColumns = @jakarta.persistence.JoinColumn(name = "user_id")  // Correct usage of @JoinColumn from jakarta.persistence
    )
    @Column(name = "role")  
    private List<String> roles;

	public void setRoles(List<String> roles) {
		this.roles = roles;	
	}
	public List<String> getRoles() {
        return roles;
    }
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}	
}
