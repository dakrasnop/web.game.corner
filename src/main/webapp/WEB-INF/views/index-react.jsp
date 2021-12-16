<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
	<head>
    <meta charset="UTF-8" />
		<meta http-equiv="Pragma" content="no-cache">
		<meta http-equiv="Expires" content="0">
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
		<link id="link" rel="stylesheet" href="" />
		<title>React Game</title>
		<!-- Note: when deploying, replace "development.js" with "production.min.js". -->
		<script src="https://unpkg.com/react@17/umd/react.development.js" crossorigin></script>
		<script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>

		<script src="js/reactJs/app.js" type="text/javascript" ></script>
		<script src="js/reactJs/Game.js"></script>
		<script src="js/reactJs/Board.js"></script>
		<script src="js/reactJs/Figure.js"></script>
		<script src="js/reactJs/BoardCell.js"></script>
		<script src="js/reactJs/Button.js"></script>
		<script src="js/reactJs/Announcement.js"></script>
		<script src="js/reactJs/GamePosition.js"></script>
	</head>
	<body id="body" onload="start(${restore},${index});">
		<table style="width:100%;">
			<tr align="center">
				<td id="table-row-0" style="color:#3e7878; font:18pt bold;">C O R N E R S [React]</td>
			</tr>
			<tr align="center">
				<td id="table-row-1"></td>
			</tr>
		</table>
	</body>
</html>