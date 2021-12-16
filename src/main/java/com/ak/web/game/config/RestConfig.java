package com.ak.web.game.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.ak.json.transform.JParser;

@Configuration
public class RestConfig {

//	@Value("${location}")
//	String location;

	@Bean
	public JParser jsonParser() {
		return new JParser();
	}

}
