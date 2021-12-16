package com.ak.web.game;

import java.util.Arrays;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;

/**
 * @author krasal5
 *
 */
@SpringBootApplication
public class Application extends SpringBootServletInitializer {

	@SuppressWarnings("hiding")
	private static Logger logger = LoggerFactory.getLogger(Application.class);

	/**
	 * java -jar game-1.1.war
	 * @param args
	 */
	public static void main(final String[] args) {
		SpringApplication.run(Application.class, args);
	}

	/**
	 * @param ctx
	 * @return
	 */
	@Bean
	public CommandLineRunner commandLineRunner(final ApplicationContext ctx) {
		return args -> {

			logger.info("\nLet's inspect the beans provided by Spring Boot:");

			String[] beanNames = ctx.getBeanDefinitionNames();
			Arrays.sort(beanNames);
//			for (String beanName : beanNames) {
//				System.out.println(beanName);
//			}
			logger.info("\tContext contains " + beanNames.length + " beans.\n");
		};
	}

}