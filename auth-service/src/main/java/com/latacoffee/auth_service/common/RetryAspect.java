package com.latacoffee.auth_service.common;

import java.lang.reflect.Method;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Aspect
@Component
public class RetryAspect {
    private static final Logger log = LoggerFactory.getLogger(RetryAspect.class);

    @Around("@annotation(com.latacoffee.auth_service.common.RetryOnFailure)")
    public Object retry(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        RetryOnFailure retryConfig = method.getAnnotation(RetryOnFailure.class);

        int maxAttempts = retryConfig.maxAttempts();
        long delayMs = retryConfig.delayMs();

        Throwable lastException = null;

        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return joinPoint.proceed();
            } catch (Throwable ex) {
                lastException = ex;
                log.warn("Attempt {}/{} failed for {}: {}", attempt, maxAttempts, method.getName(), ex.getMessage());

                if (attempt < maxAttempts) {
                    Thread.sleep(delayMs);
                }
            }
        }

        log.error("All {} attempts failed for {}", maxAttempts, method.getName());
        throw lastException;
    }
}