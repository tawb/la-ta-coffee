package com.latacoffee.auth_service.common;

import java.lang.reflect.Method;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class RetryAspect {

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
                System.out.println("Attempt " + attempt + "/" + maxAttempts
                        + " failed for " + method.getName() + ": " + ex.getMessage());

                if (attempt < maxAttempts) {
                    Thread.sleep(delayMs);
                }
            }
        }

        System.out.println("All " + maxAttempts + " attempts failed for " + method.getName());
        throw lastException;
    }
}