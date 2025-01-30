package com.eventify.eventmanagement.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class LoggingAspect {
	private static final Logger LOGGER = LoggerFactory.getLogger(LoggingAspect.class);

//	@Before("execution(* *.*(..))")
	
	// Here Before is advice and point-cut is execution("...") 
//	@Before("execution(* com.eventify.eventmanagement.service.TaskService.updateTask(..) )") // return type, fully_qualified_class name.method name, argument
	
	@Before("execution(* com.eventify.eventmanagement.service.TaskService.*(..) )") // return type, fully_qualified_class name.method name, argument
	public void logMethodCall(JoinPoint jp) {
		LOGGER.info("Method called: "+ jp.getSignature().getName());
	}
	

	
	// after is called even if exception is thrown or not.
	
	@After("execution(* com.eventify.eventmanagement.service.TaskService.*(..) )") // return type, fully_qualified_class name.method name, argument
	public void logMethodCallAfter(JoinPoint jp) {
		LOGGER.info("Method called: "+ jp.getSignature().getName());
	}
	
	
	@AfterThrowing
	public void logMethodCallAfterThrowing(JoinPoint jp) {
		LOGGER.info("Method called: "+ jp.getSignature().getName());
	}
	
	@AfterReturning
	public void logMethodExecutedSuceess(JoinPoint jp) {
		LOGGER.info("Method executed successfully : "+ jp.getSignature().getName());
	}
	
	// performance monitoring using @Around
	
	
}
// Weaving: Linking aspects with other application types
