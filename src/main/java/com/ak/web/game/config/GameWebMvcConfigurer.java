package com.ak.web.game.config;

import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;

/**
 * The GameWebMvcConfigurer class
 *
 * @version 1.0.0
 * @author <a href="mailto:krasnop@bellsouth.net">Alexei Krasnopolski</a>
 */
@EnableWebMvc
@Configuration
@ComponentScan(basePackages = { "com.ak.web.game.controller" })
public class GameWebMvcConfigurer implements WebMvcConfigurer {

	static Logger logger = LoggerFactory.getLogger(GameWebMvcConfigurer.class);

	@Override
	public void addViewControllers(final ViewControllerRegistry registry) {
		registry.addViewController("/").setViewName("index");
//		registry.addViewController("/react").setViewName("index-react");
	}

	@Override
	public void addResourceHandlers(final ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/game/**")
		.addResourceLocations("classpath:/static/css")
		.addResourceLocations("classpath:/static/img")
		.addResourceLocations("classpath:/static/js");
		registry.addResourceHandler("/favicon.ico")
		.addResourceLocations("/WEB-INF/favicon.ico");
	}

	@Bean
	public ViewResolver viewResolver() {
		InternalResourceViewResolver bean = new InternalResourceViewResolver();

		bean.setViewClass(JstlView.class);
		bean.setPrefix("/WEB-INF/views/");
		bean.setSuffix(".jsp");

		return bean;
	}

	@Bean
	public HttpSessionListener httpSessionListener() {
		return new HttpSessionListener() {
			@Override
			public void sessionCreated(final HttpSessionEvent se) {
				logger.debug(
						"Session Created with session id+" + se.getSession().getId());
			}

			@Override
			public void sessionDestroyed(final HttpSessionEvent se) {
				logger.debug(
						"Session Destroyed, Session id:" + se.getSession().getId());
			}
		};
	}

}
