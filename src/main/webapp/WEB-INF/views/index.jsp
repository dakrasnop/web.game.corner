<?xml version="1.0" encoding="UTF-8" ?>
<!--%@ taglib prefix='security' uri='http://www.springframework.org/security/tags' %-->
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Pragma" content="no-cache">
		<meta http-equiv="Expires" content="0">
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
		<link id="link" rel="stylesheet" href="" />
		<title>Game</title>
		<script src="https://ajax.googleapis.com/ajax/libs/prototype/1.7/prototype.js" type="text/javascript" ></script>
		<script src="game/js/Figure.js" type="text/javascript" ></script>
		<script src="game/js/Board.js" type="text/javascript" ></script>
		<script src="game/js/BoardCell.js" type="text/javascript" ></script>
		<script src="game/js/Button.js" type="text/javascript" ></script>
		<script src="game/js/GamePosition.js" type="text/javascript" ></script>
		<script src="game/js/game.js" type="text/javascript" ></script>
	</head>
	<body id="body" onload="start(${restore});">
		<table style="width:100%;">
			<tr align="center">
				<td  id="table-row-0" style="color:#3e7878; font:18pt bold;">C O R N E R S</td>
			</tr>
			<tr align="center">
				<td id="table-row-1">
					<div id="table"></div>
				</td>
			</tr>
			<tr align="center">
				<td id="table-row-2"></td>
			</tr>
		</table>
	</body>
</html>