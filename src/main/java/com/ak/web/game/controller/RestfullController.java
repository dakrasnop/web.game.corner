package com.ak.web.game.controller;

import static com.ak.corners.model.CellState.BLACK;
import static com.ak.corners.model.CellState.WHITE;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ak.corners.model.BoardModel;
import com.ak.corners.model.Location;
import com.ak.corners.model.Move;
import com.ak.json.JNode;
import com.ak.json.nodetree.JArrayNode;
import com.ak.json.nodetree.JObjectNode;
import com.ak.json.nodetree.JValueNode;

/**
 * @author krasal5
 *
 */
@RestController
@RequestMapping("/game")
public class RestfullController {

	private static Logger logger = LoggerFactory.getLogger(RestfullController.class);

	/**
	 * @return
	 */
	@RequestMapping(value = "newgame", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public String newGameStart(final HttpSession session) {
		BoardModel gameEngine = new BoardModel();
		session.setAttribute("engine", gameEngine);

		Location [][] figPos = gameEngine.getCurrPos().figPos();
		JNode wfNode = new JArrayNode();
		JNode bfNode = new JArrayNode();
		for (int i = 0; i < 9; i++) {
			JNode nw = new JArrayNode();
			for (int k : figPos[WHITE.value()][i].toArray()) {
				nw.addNode(new JValueNode<Integer>(k));
			};
			JNode nb = new JArrayNode();
			for (int k : figPos[BLACK.value()][i].toArray()) {
				nb.addNode(new JValueNode<Integer>(k));
			};
			wfNode.addNode(nw);
			bfNode.addNode(nb);
		}
		JNode response = new JObjectNode();
		response.addNode("white", wfNode);
		response.addNode("black", bfNode);
		logger.debug("Initial game:" + response.toJson());
		return response.toJson();
	}

	/**
	 * @return
	 */
	@RequestMapping(value = "restoregame", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public String restoreGameStart(final HttpSession session) {
		Integer index = (Integer) session.getAttribute("index");
		if (index == null) {
			index = 0;
		} else {
			index++;
		}
		session.setAttribute("index", index);

		BoardModel gameEngine = (BoardModel) session.getAttribute("engine"); // TODO: check null situation

		Location [][] figPos = gameEngine.getCurrPos().figPos();
		JNode wfNode = new JArrayNode();
		JNode bfNode = new JArrayNode();
		for (int i = 0; i < 9; i++) {
			JNode nw = new JArrayNode();
			for (int k : figPos[WHITE.value()][i].toArray()) {
				nw.addNode(new JValueNode<Integer>(k));
			};
			JNode nb = new JArrayNode();
			for (int k : figPos[BLACK.value()][i].toArray()) {
				nb.addNode(new JValueNode<Integer>(k));
			};
			wfNode.addNode(nw);
			bfNode.addNode(nb);
		}
		JNode response = new JObjectNode();
		response.addNode("white", wfNode);
		response.addNode("black", bfNode);
		logger.debug("Restored game:" + response.toJson());
		return response.toJson();
	}

	@RequestMapping(value = "humanmove", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public String humanMove(final HttpSession session,
			@RequestParam(value = "source", required = true, defaultValue = "") final String sourceId,
			@RequestParam(value = "destination", required = true, defaultValue = "") final String destinationId,
			@RequestParam(value = "figureId", required = true, defaultValue = "") final String figureId
			) {
		BoardModel gameEngine = (BoardModel) session.getAttribute("engine");
		JNode response = new JObjectNode();
		if (gameEngine != null) {
			logger.debug("1. source=" + sourceId + "  dest=" + destinationId + "  figureId=" + figureId);

			String [] tokens = sourceId.split("\\.");
			Location sourceLoc = new Location(Integer.parseInt(tokens[1]), Integer.parseInt(tokens[2]));

			tokens = destinationId.split("\\.");
			Location destLoc = new Location(Integer.parseInt(tokens[1]), Integer.parseInt(tokens[2]));

			tokens = figureId.split("\\.");
			int id = Integer.parseInt(tokens[2]);
			if (gameEngine.testMove(sourceLoc, destLoc)) {
				response.addNode("allow", new JValueNode<Boolean>(true));
				logger.debug("2. source=" + sourceLoc + "  dest=" + destLoc + "  figureId=" + id);
				gameEngine.makeMove(new Move(sourceLoc, destLoc, id, WHITE));
				response.addNode("win", new JValueNode<Boolean>(gameEngine.isWin(WHITE)));
			} else {
				logger.debug("2. Move does not allowed: source=" + sourceLoc + "  dest=" + destLoc + "  figureId=" + id);
				response.addNode("allow", new JValueNode<Boolean>(false));
				response.addNode("win", new JValueNode<Boolean>(false));
			}
		} else {
			response.addNode("allow", new JValueNode<Boolean>(false));
			response.addNode("win", new JValueNode<Boolean>(false));
		}

		return response.toJson();
	}

	@RequestMapping(value = "computermove", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public String computerMove(final HttpSession session) {
		BoardModel gameEngine = (BoardModel) session.getAttribute("engine");
		JNode response = new JObjectNode();
		if (gameEngine != null) {
			Move move = gameEngine.makeOpponentMove();
			JNode array = new JArrayNode();
			array.addNode(new JValueNode<Integer>(move.getStart().getX()));
			array.addNode(new JValueNode<Integer>(move.getStart().getY()));
			response.addNode("start", array);
			array = new JArrayNode();
			array.addNode(new JValueNode<Integer>(move.getFinish().getX()));
			array.addNode(new JValueNode<Integer>(move.getFinish().getY()));
			response.addNode("finish", array);
			response.addNode("figIdx", new JValueNode<Integer>(move.getFigureId()));
			response.addNode("win", new JValueNode<Boolean>(gameEngine.isWin(BLACK)));
		} else {
		}

		return response.toJson();
	}

}
