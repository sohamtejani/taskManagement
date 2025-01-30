package com.eventify.eventmanagement.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class ValidationAspect {
	private static final Logger LOGGER = LoggerFactory.getLogger(ValidationAspect.class);
	
	@Around("execution(* com.eventify.eventmanagement.service.UserService.findById(..) && args(userIId)")
	public Object validationAndUpdate(ProceedingJoinPoint jp, int userId) throws Throwable{
		if(userId < 0) userId *= -1;
		
		LOGGER.info("");
		Object obj = jp.proceed(new Object[] {userId});
		return obj;
	}
}
