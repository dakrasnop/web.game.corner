package com.ak.web.game.config;

import org.apache.catalina.connector.Connector;
import org.apache.coyote.ajp.AbstractAjpProtocol;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

/**
 * @author alexei krasnopolski
 *
 */
@Configuration
public class ServerSetup {

	@Value("${ajp.port}")
	int ajpPort;

	@Autowired
	private Environment env;

//	@Value("${ajp.enabled}")
//	boolean ajpEnabled;

	@Bean
	public TomcatServletWebServerFactory servletContainer() {
		TomcatServletWebServerFactory tomcat = new TomcatServletWebServerFactory();
		tomcat.addAdditionalTomcatConnectors(getHttpConnector());

		String ajpEnabled = env.getProperty("ajp_enabled");
		if (ajpEnabled.equals("true")) {
			Connector ajpConnector = new Connector("AJP/1.3");
			ajpConnector.setPort(ajpPort);
			ajpConnector.setSecure(true);
			ajpConnector.setScheme("https");
			ajpConnector.setAllowTrace(false);
			((AbstractAjpProtocol<?>) ajpConnector.getProtocolHandler()).setSecretRequired(false);
			tomcat.addAdditionalTomcatConnectors(ajpConnector);
		}
		return tomcat;
	}


	private Connector getHttpConnector() {
		Connector connector = new Connector(TomcatServletWebServerFactory.DEFAULT_PROTOCOL);
//		connector.setScheme("http");
		connector.setPort(8082);
//		connector.setSecure(false);
//		connector.setRedirectPort(8443);
		return connector;
	}

}
