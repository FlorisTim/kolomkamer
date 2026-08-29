import socket
import time
import datetime
import json

def writeToLog(text):
	fil = open("/media/floris/New Volume/accesslog", "r+")
	msg = str(datetime.datetime.now()) + ": " + text
	print(msg)
	fil.read()
	fil.write(msg  + "\n")
	fil.close()

def giveFileTo(filename, person):
	if "\n" in filename or " " in filename or "\n" in person or " " in person:
		return "illegal filename or person"
	file = open("/media/floris/New Volume/userdata/fileuser")
	read = file.read()
	file.close()
	wrt = open("/media/floris/New Volume/userdata/fileuser", "w")
	

PORT = 10620
HOST = "0.0.0.0"

server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

server_socket.bind((HOST, PORT))

server_socket.listen(5)

writeToLog("started listening")
while True:
	client_socket, client_address = server_socket.accept()
	request = client_socket.recv(1500).decode()
	headers = request.split('\n')
	fh_components = headers[0].split()
	http_method = fh_components[0]
	path = fh_components[1]
	personIp = request.split("X-Forwarded-For: ")[1].split('\n')[0]
	
	content = ""
	try:
		fil = open("/media/floris/New Volume/content"+path)
		content = fil.read()
		if content.startswith("not_allowed"):
			writeToLog("tried to access illegal file \"" + path + "\": " + personIp)
			content = "illegal location"
		else:
			writeToLog("tried to access file \"" + path + "\": " + personIp)
		fil.close()
	except:
		content = "could not open file"
		writeToLog("tried to access non existent file \"" + path + "\": " + personIp)


	response = (
			f"HTTP/1.1 200 OK\r\n"+
			 "Access-Control-Allow-Origin: *\r\n\r\n"+
			 content).encode()
	client_socket.sendall(response)


