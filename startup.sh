#!/bin/bash

## MACOS
export ajp_enabled=false
nohup java -jar target/game.springBoot.war > /dev/null 2> /dev/null &
echo $! > ./pid.file

## Linux
#export ajp_enabled=true
#/usr/local/java_8/bin/java -jar game.springBoot.war &
#echo $! > ./pid.file
