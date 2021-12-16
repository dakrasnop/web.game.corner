package com.ak.web.game.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.support.ServletContextResource;
import org.springframework.web.servlet.ModelAndView;

import com.ak.corners.model.BoardModel;

@Controller
@RequestMapping("/game")
public class WebAppController {

	private static Logger logger = LoggerFactory.getLogger(WebAppController.class);

	@Autowired
	private ServletContext servletContext;

	@GetMapping("/")
	public ModelAndView index(final HttpSession session) {
		logger.debug("Session exist with id: " + session.getId());
		Map<String, Object> model = new HashMap<String, Object>();
		BoardModel gameEngine = (BoardModel) session.getAttribute("engine");
		if (gameEngine != null ) {
			model.put("restore", true);
			model.put("index", session.getAttribute("index"));
		} else {
			model.put("restore", false);
			model.put("index", 0);
			session.setAttribute("index", 1);
		}
		return new ModelAndView("index-react", model);
	}

	@GetMapping("")
	public ModelAndView indexReact(final HttpSession session) {
		logger.debug("[React] Session exist with id: " + session.getId());
		Map<String, Object> model = new HashMap<String, Object>();
		BoardModel gameEngine = (BoardModel) session.getAttribute("engine");
		if (gameEngine != null ) {
			model.put("restore", true);
			model.put("index", session.getAttribute("index"));
		} else {
			model.put("restore", false);
			model.put("index", 0);
			session.setAttribute("index", 0);
		}
		return new ModelAndView("index-react", model);
	}

	@GetMapping("/favicon.ico")
	@ResponseBody
	public Resource favicon(final HttpSession session) {
		logger.debug("Favicon request.");
		Resource resource = new ServletContextResource(servletContext, "/WEB-INF/favicon.ico");
		logger.debug("Favicon file exist = " + resource.exists());
		return resource;
	}
}
